'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchBrand,
  addBrand,
  updateBrand,
  deleteBrand,
} from '@/app/redux/brandSlice'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/brand-constant'
import { toast } from 'react-toastify';
import DeletePopup from '@/app/common/utils/delete-popup'

const Brand = () => {
  const dispatch = useDispatch()
  const {
    brand = [],
    loading,
    error,
  } = useSelector((state) => state.brand ?? {})

  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentBrand, setCurrentBrand] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [active, setActive] = useState(true)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [brandToDelete, setBrandToDelete] = useState(null)
  const [formErrors, setFormErrors] = useState({
    name: '',
    description: '',
  })

  useEffect(() => {
    dispatch(fetchBrand())
  }, [dispatch])

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Brand name is required";
    }

    if (!description.trim()) {
      newErrors.description = "Dsescription name is required";
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = {
      name: '',
      description: '',
    }

    if (!name.trim()) {
      errors.name = 'Brand name is required'
    }
    if (!description.trim()) {
      errors.description = 'Brand description is required'
    }
    setFormErrors(errors)
    if (!name.trim() || !description.trim()) return
    if (!validateForm()) return;
    try {
      if (editMode && currentBrand) {
        const response = await dispatch(
          updateBrand({
            brandId: currentBrand.brandId,
            name,
            description,
            active,
          }),
        ).unwrap()
        if (response.statusCode === 200) {
          toast.success(response.message)
        } else {
          toast.error(response.message)
        }
      } else {
        const response = await dispatch(
          addBrand({ name, description }),
        ).unwrap()
        if (response.statusCode === 200) {
          toast.success(response.message)
        } else if (response.statusCode === 417) {
          toast.warn(response.message)
        } else {
          toast.error(response.message)
        }
      }

      setShowForm(false)
      setEditMode(false)
      setCurrentBrand(null)
      setName('')
      setDescription('')
      setActive(true)
      setFormErrors({ name: '', description: '' })
      dispatch(fetchBrand())
    } catch (error) {
      console.error('Error saving brand:', error)
    }
  }

  const handleEdit = (brand) => {
    setEditMode(true)
    setCurrentBrand(brand)
    setName(brand.name)
    setDescription(brand.description)
    setActive(brand.active)
    setFormErrors({ name: '', description: '' })
    setShowForm(true)
  }

  const handleDeleteClick = (brand) => {
    setBrandToDelete(brand)
    setShowDeletePopup(true)
  }

  const handleDeleteConfirm = async () => {
    if (brandToDelete) {
      try {
        const response = await dispatch(
          deleteBrand({ brandId: brandToDelete.brandId }),
        ).unwrap()
        if (response.statusCode === 200) {
          toast.success(response.message)
        } else {
          toast.error(response.message)
        }
      } catch (error) {
        console.error('Delete error:', error)
      }
      setShowDeletePopup(false)
      dispatch(fetchBrand())
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditMode(false)
    setCurrentBrand(null)
    setName('')
    setDescription('')
    setActive(true)
  }

  return (
    <div className="max-w-full pt-2 mx-auto mt-5 mb-6 bg-white rounded-lg">
      <div className="flex justify-center md:justify-start">
        <div>
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
              className="px-4 py-2 mt-3 text-white rounded-md bg-add-btn"
            >
              + Add Brand
            </button>
          )}
        </div>
      </div>


      {showForm && (
        <div className="p-4 mb-4 rounded ">
          <h2 className="mb-4 text-2xl font-bold text-center text-add-label">
            {editMode ? 'Edit Brand' : 'Add Brand'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium">Brand Name</label>
              <input
                type="text"
                value={name}
                maxLength={25}
                onChange={(e) => {
                  setName(e.target.value)
                  setFormErrors((prev) => ({ ...prev, name: '' }))
                }}
                placeholder="Enter Brand Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E34] mt-2"
              />
              {formErrors.name && (
                <p className="text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>

            {/* {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>} */}

            <div>
              <label className="block font-medium">Brand Description</label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  setFormErrors((prev) => ({ ...prev, description: '' }))
                }}
                placeholder="Enter Brand Description"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E34] mt-2"
              />
              {formErrors.description && (
                <p className="text-sm text-red-500">{formErrors.description}</p>
              )}
            </div>

            {/* {formErrors.description && <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>} */}

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
            data={brand}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            title={'Brand'}
            loading={loading}
          />
        </>
      )}
      <DeletePopup
        show={showDeletePopup}
        type="brand"
        name={brandToDelete?.name}
        onCancel={() => setShowDeletePopup(false)}
        onConfirm={handleDeleteConfirm}
      />

    </div>
  )
}

export default Brand
