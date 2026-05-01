'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSizes, addSize, updateSize, deleteSize } from '@/app/redux/sizeSlice'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/size-constant'
import { toast } from 'react-toastify';
import DeletePopup from '@/app/common/utils/delete-popup'
import { limitToCharacters, validateRequiredField } from '@/app/common/utils/validationHelpers'

const SizePage = () => {
  const dispatch = useDispatch()
  const {
    sizes = [],
    loading,
    error,
  } = useSelector((state) => state.size ?? {})

  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentSize, setCurrentSize] = useState(null)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [active, setActive] = useState(true)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [sizeToDelete, setSizeToDelete] = useState(null)
    const [formErrors, setErrors] = useState({
      name: '',
      code: '',
    })

  useEffect(() => {
    dispatch(fetchSizes())
  }, [dispatch])

  const validateForm = () => {
    const newErrors = {};

    const nameError = validateRequiredField(name, "Size Name");
    if (nameError) newErrors.name = nameError;

    const codeError = validateRequiredField(code, "Size Code");
    if (codeError) newErrors.code = codeError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formErrors = {
      name: '',
      code: '',
    }
  
    if (!validateForm()) return;
    setErrors(formErrors)
  
    if (!name.trim() || !code.trim()) return
    try {
      if (editMode && currentSize) {
        const response = await dispatch(
          updateSize({ sizeId: currentSize.sizeId, name, code, active }),
        ).unwrap()
        if (response.statusCode === 200) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await dispatch(addSize({ name, code })).unwrap()
        if (response.statusCode === 200) {
          toast.success(response.message)
        }
        else if (response.statusCode === 417) {
          toast.warn(response.message);
        } else {
          toast.error(response.message);
        }
      }

      setShowForm(false)
      setEditMode(false)
      setCurrentSize(null)
      setName('')
      setCode('')
      setActive(true)
      setErrors({ name: '', code: '' })
      dispatch(fetchSizes())
    } catch (error) {
      console.error('Error saving size:', error)
    }
  }

  const handleEdit = (size) => {
    setEditMode(true)
    setCurrentSize(size)
    setName(size.name)
    setCode(size.code)
    setActive(size.active)
    setErrors({ name: '', code: '' })
    setShowForm(true)
  }

  const handleDeleteClick = (size) => {
    setSizeToDelete(size)
    setShowDeletePopup(true)
  }

  const handleDeleteConfirm = async () => {
    if (sizeToDelete) {
      try {
        const response = await dispatch(deleteSize({ sizeId: sizeToDelete.sizeId })).unwrap();
        if (response.statusCode === 200) {
          toast.success(response.message)
        }
      } catch (error) {
        toast.error("Failed to delete Size!")
      }
      setShowDeletePopup(false)
      dispatch(fetchSizes())
    }
  }


  const handleCancel = () => {
    setShowForm(false)
    setEditMode(false)
    setCurrentSize(null)
    setName('')
    setCode('')
    setActive(true)
  }

  return (
    <div className="max-w-full pt-8 mx-auto mt-5 mb-6 bg-white rounded-lg ">
     <div className='flex justify-center md:justify-start'>
  {!showForm && (
    <button
      onClick={() => {
        setShowForm(true)
        setEditMode(false)
        setName('')
        setCode('')
        setErrors({ name: '', code: '' })
        setActive(true)
      }}
      className="px-4 py-2 mx-auto mt-3 text-white rounded-md bg-add-btn md:mx-0"
    >
      + Add Size
    </button>
  )}
</div>


      {showForm && (
        <div className="p-4 mb-4 rounded">
          <h2 className="mb-4 text-2xl font-bold text-center text-add-label">
            {editMode ? 'Edit Size' : 'Add Size'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium">Size Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  const limitedValue = limitToCharacters(e.target.value);
                  setName(limitedValue)
                  setErrors((prev) => ({ ...prev, name: '' }))
                }}
                placeholder="Enter Size Name"
                className="w-full p-2 mt-2 border rounded focus:ring-2 focus:ring-blue-400"
              />
              {formErrors.name && (
                <p className="text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>

            {/* {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>} */}

            <div>
              <label className="block font-medium">Size Code</label>
              <input
                type="text"
                value={code}
                maxLength={15}
                onChange={(e) => {
                  setCode(e.target.value)
                  setErrors((prev) => ({ ...prev, code: '' }))
                }}
                placeholder="Enter Code Name"
                className="w-full p-2 mt-2 border rounded focus:ring-2 focus:ring-blue-400"
              />
              {formErrors.code && (
                <p className="text-sm text-red-500">{formErrors.code}</p>
              )}
            </div>

            {/* {formErrors.code && <p className="mt-1 text-sm text-red-500">{formErrors.code}</p>} */}

            {editMode && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-5 h-5"
                />
                <label htmlFor="isActive" className="font-medium">
                  Active
                </label>
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 text-white rounded bg-submit-btn hover:bg-green-600"
              >
                {editMode ? 'Update' : 'Submit'}
              </button>
              <button
                type="button"
                className="px-4 py-2 text-white rounded bg-cancel-btn hover:bg-gray-600"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <>
          {error && <p className="text-red-500">Error: {error}</p>}
          <Table
            columns={Columns}
            data={sizes}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            loading={loading}
            title={"Size"}
          />
        </>
      )}

<DeletePopup
            show={showDeletePopup}
            type="size"
            name={sizeToDelete?.name}
            onCancel={() => setShowDeletePopup(false)}
            onConfirm={handleDeleteConfirm}
        />
    </div>
  )
}

export default SizePage
