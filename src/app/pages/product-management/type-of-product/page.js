'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTypeOfProduct,
  addTypeOfProduct,
  updateTypeOfProduct,
  deleteTypeOfProduct,
} from '@/app/redux/typeofProductSlice'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/typeOfProduct-constant'
import { toast } from 'react-toastify';
import DeletePopup from '@/app/common/utils/delete-popup'
import { limitToCharacters, validateRequiredField } from '@/app/common/utils/validationHelpers'

const TypeOfProduct = () => {
  const dispatch = useDispatch()
  const { typeofproduct, loading, error } = useSelector((state) => state?.typeofProduct)

  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentType, setCurrentType] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [active, setActive] = useState(true)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [typeToDelete, setTypeToDelete] = useState(null)
  const [formErrors, setFormErrors] = useState({
    name: '',
    description: '',
  })

  useEffect(() => {
    dispatch(fetchTypeOfProduct())
  }, [dispatch])


  const validateForm = () => {
    const newErrors = {};

    const nameError = validateRequiredField(name, "Type of Product Name");
    if (nameError) newErrors.name = nameError;

    const descriptionError = validateRequiredField(description, "Type of Product Description");
    if (descriptionError) newErrors.description = descriptionError;

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    try {
      if (editMode && currentType) {
        const response = await dispatch(
          updateTypeOfProduct({
            typeofProductId: currentType.typeofProductId,
            name,
            description,
            active,
          }),
        ).unwrap()
        if (response.statusCode === 200) toast.success(response.message)
        else toast.error(response.message)
      } else {
        const response = await dispatch(addTypeOfProduct({ name, description })).unwrap()
        if (response.statusCode === 200) toast.success(response.message)
        else if (response.statusCode === 417) toast.warn(response.message)
        else toast.error(response.message)
      }
      setShowForm(false)
      setEditMode(false)
      setCurrentType(null)
      setName('')
      setDescription('')
      setActive(true)
      setFormErrors({ name: '', description: '' })
      dispatch(fetchTypeOfProduct())
    } catch (error) {
      console.error('Error saving type:', error)
    }
  }

  const handleEdit = (type) => {
    setEditMode(true)
    setCurrentType(type)
    setName(type.name)
    setDescription(type.description)
    setActive(type.active)
    setFormErrors({ name: '', description: '' })
    setShowForm(true)
  }

  const handleDeleteClick = (type) => {
    setTypeToDelete(type)
    setShowDeletePopup(true)
  }

  const handleDeleteConfirm = async () => {
    if (typeToDelete) {
      try {
        const response = await dispatch(
          deleteTypeOfProduct({ typeofProductId: typeToDelete.typeofProductId })
        ).unwrap();

        if (response?.statusCode === 200) {
          toast.success(response.message || 'Type of Product deleted successfully.');
        } else {
          toast.error(response?.message || 'Unexpected response while deleting.');
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error?.message || 'Failed to delete Type of Product.');
      } finally {
        setShowDeletePopup(false);
        dispatch(fetchTypeOfProduct());
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false)
    setEditMode(false)
    setCurrentType(null)
    setName('')
    setDescription('')
    setActive(true)
  }

  return (
    <div className="max-w-full pt-8 mx-auto mt-5 mb-6 bg-white rounded-lg ">
      <div className="flex">
        <div className="flex justify-start w-full lg:justify-start">
          {!showForm && (
            <button
              onClick={() => {
                setShowForm(true)
                setEditMode(false)
                setName('')
                setDescription('')
                setFormErrors({ name: '', description: '' })
                setActive(true)
              }}
              className="px-4 py-2 mx-auto mt-3 text-white rounded-md bg-add-btn sm:w-auto sm:mx-0"
            >
              + Add Type Of Product
            </button>

          )}
        </div>
      </div>

      {showForm && (
        <div className="p-4 mb-4 rounded">
          <h2 className="mb-4 text-2xl font-bold text-center text-add-label">
            {editMode ? 'Edit Type Of Product' : 'Add Type Of Product'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-3 font-medium">Type of Product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  const limitedValue = limitToCharacters(e.target.value);
                  setName(limitedValue)
                  setFormErrors((prev) => ({ ...prev, name: '' }))
                }}
                placeholder="Enter Type Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E34]"
              />
              {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
            </div>

            <div>
              <label className="block mb-3 font-medium">Type of Product Description</label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  setFormErrors((prev) => ({ ...prev, description: '' }))
                }}
                placeholder="Enter Type Description"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E34]"
              />
              {formErrors.description && <p className="text-sm text-red-500">{formErrors.description}</p>}
            </div>

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
            data={typeofproduct?.filter(item => item != null && typeof item === 'object')}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            title={'Type Of Product'}
            loading={loading}
          />
        </>
      )}

      <DeletePopup
        show={showDeletePopup}
        type="type of product"
        name={typeToDelete?.name}
        onCancel={() => setShowDeletePopup(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

export default TypeOfProduct