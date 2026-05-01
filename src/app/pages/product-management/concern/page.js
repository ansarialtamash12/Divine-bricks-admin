'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/concern-constant'
import {
  addConcern,
  deleteConcern,
  fetchConcern,
  updateConcern,
} from '@/app/redux/concernSlice'
import { toast } from 'react-toastify'
import DeletePopup from '@/app/common/utils/delete-popup'
import { CloudCog } from 'lucide-react'
import { limitToCharacters, validateRequiredField } from '@/app/common/utils/validationHelpers'


const Concern = () => {
  const dispatch = useDispatch()
  const { loading, ConcernData } = useSelector((state) => state.concern ?? {})
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [active, setActive] = useState(false)
  const [editConcernId, setEditConcernModeId] = useState(null)
  const [errors, setErrors] = useState({})
  const [concernToDelete, setConcernToDelete] = useState(null)
  const [showDeletePopup, setShowDeletePopup] = useState(false)

  useEffect(() => {
    dispatch(fetchConcern())
  }, [dispatch])

  const validateForm = () => {
    const newErrors = {}

    const nameError = validateRequiredField(name, "Concern Name");
    if (nameError) newErrors.name = nameError;

    const descriptionError = validateRequiredField(description, "Concern Description");
    if (descriptionError) newErrors.description = descriptionError;

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setErrors(errors)
    const concernData = {
      name,
      description,
      active,
    }

    try {
      let response;
      if (editMode) {
        concernData.concernId = editConcernId
        response = await dispatch(updateConcern(concernData)).unwrap()
      } else {
        response = await dispatch(addConcern(concernData)).unwrap()
      }
      if (response.statusCode === 200) toast.success(response.message);
      else if (response.statusCode === 417) toast.warn(response.message);
      else toast.error(response.message);

      setName('')
      setDescription('')
      setEditMode(false)
      setActive(false)
      setShowForm(false)
      setErrors({})
      dispatch(fetchConcern())
      setErrors({ name: '', description: '' })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleEdit = (concern) => {
    setName(concern.name)
    setDescription(concern.description)
    setEditConcernModeId(concern.concernId)
    setEditMode(true)
    setShowForm(true)
    setActive(concern.active)
    setErrors({ name: '', description: '' })
  }

  const handleDelete = (concern) => {
    setConcernToDelete(concern)
    setShowDeletePopup(true)
  }

  const confirmDelete = async () => {
    try {
      const res = await dispatch(
        deleteConcern(concernToDelete.concernId),
      ).unwrap()
      if (res.statusCode === 200) {
        toast.success(res.message)
      }
      else {
        toast.error(res.message)
      }

    } catch (error) {
      console.error('Delete Error:', error)
    } finally {
      setShowDeletePopup(false)
      setConcernToDelete(null)
    }

    await dispatch(fetchConcern())
  }

  return (
    <div className="max-w-full pt-8 mx-auto mt-5 mb-6 bg-white rounded-lg">
      <div className="flex justify-center w-full md:justify-start">
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true)
              setEditMode(false)
              setName('')
              setDescription('')
              setActive(false)
              setErrors({ name: '', description: '' })
            }}
            className="px-4 py-2 mt-3 text-white rounded-md bg-add-btn"
          >
            + Add Concern
          </button>
        )}
      </div>



      {showForm && (
        <div className="p-4 mb-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="mb-4 text-2xl font-bold text-center text-add-label">
              {editMode ? 'Edit Concern' : 'Add Concern'}
            </h2>
            <div>
              <label className="block font-medium">Concern Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  const limitedValue = limitToCharacters(e.target.value);
                  setName(limitedValue)
                  setErrors((prev) => ({ ...prev, name: '' }))
                }}
                placeholder="Enter Concern Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E34] mt-2"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block font-medium">Description Name</label>
              <input
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  setErrors((prev) => ({ ...prev, description: '' }))
                }}
                placeholder="Enter Description Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E34] mt-2"
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>
            {/* Active Checkbox */}
            {editMode && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-5 h-5 mr-2 cursor-pointer"
                />
                <label className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 text-white rounded-md bg-submit-btn hover:bg-green-700"
                disabled={loading}
              >
                {editMode ? 'Update' : 'Submit'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditMode(false)
                  setName('')
                  setDescription('')
                  setActive(false)
                  setErrors({ name: '', description: '' })
                }}
                className="px-4 py-2 text-white rounded-md bg-cancel-btn hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <>
          <Table
            columns={Columns}
            data={ConcernData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
            title={'Concern'}
          />
        </>
      )}

      <DeletePopup
        show={showDeletePopup}
        type="concern"
        name={concernToDelete?.name}
        onCancel={() => setShowDeletePopup(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default Concern
