'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/steps-constant'
import { toast } from 'react-toastify';
import DeletePopup from '@/app/common/utils/delete-popup'
import { addSteps, deleteSteps, fetchSteps, updateSteps } from '@/app/redux/stepsSlice'
import { limitToCharacters, validateRequiredField } from '@/app/common/utils/validationHelpers'

const Steps = () => {
  const dispatch = useDispatch()
  const {
    steps = [],
    loading,
    error,
  } = useSelector((state) => state.steps ?? {})

  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentStep, setCurrentSteps] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [active, setActive] = useState(true)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [stepToDelete, setStepsToDelete] = useState(null)
  const [formErrors, setFormErrors] = useState({
    name: '',
    description: '',
  })

  useEffect(() => {
    dispatch(fetchSteps())
  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = {
      name: '',
      description: '',
    }

    const nameError = validateRequiredField(name, "Step Name");
    if (nameError) errors.name = nameError;

    const descriptionError = validateRequiredField(description, "Step Description");
    if (descriptionError) errors.description = descriptionError;

    setFormErrors(errors)
    if (!name.trim() || !description.trim()) return
    try {
      if (editMode && currentStep) {
        const response = await dispatch(
          updateSteps({
            stepsId: currentStep.stepsId,
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
          addSteps({ name, description }),
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
      setCurrentSteps(null)
      setName('')
      setDescription('')
      setActive(true)
      setFormErrors({ name: '', description: '' })
      dispatch(fetchSteps())
    } catch (error) {
      console.error('Error saving step:', error)
    }
  }

  const handleEdit = (step) => {
    setEditMode(true)
    setCurrentSteps(step)
    setName(step.name)
    setDescription(step.description)
    setActive(step.active)
    setFormErrors({ name: '', description: '' })
    setShowForm(true)
  }

  const handleDeleteClick = (step) => {
    setStepsToDelete(step)
    setShowDeletePopup(true)
  }

  const handleDeleteConfirm = async () => {
    if (stepToDelete) {
      try {
        const response = await dispatch(
          deleteSteps({ stepsId: stepToDelete.stepsId }),
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
      dispatch(fetchSteps())
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditMode(false)
    setCurrentSteps(null)
    setName('')
    setDescription('')
    setActive(true)
  }

  return (
    <div className="max-w-full pt-8 mx-auto mt-5 mb-6 bg-white rounded-lg">
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
            className="px-4 py-2 mx-auto mt-3 text-white rounded-md bg-add-btn lg:mx-0"
          >
            + Add Step
          </button>
        )}
      </div>
      


      {showForm && (
        <div className="p-4 mb-4 rounded ">
          <h2 className="mb-4 text-2xl font-bold text-center text-add-label">
            {editMode ? 'Edit Step' : 'Add Step'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium">Step Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  const limitedValue = limitToCharacters(e.target.value);
                  setName(limitedValue)
                  setFormErrors((prev) => ({ ...prev, name: '' }))
                }}
                placeholder="Enter Steps Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E34] mt-2"
              />
              {formErrors.name && (
                <p className="text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>

            {/* {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>} */}

            <div>
              <label className="block font-medium">Step Description</label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  setFormErrors((prev) => ({ ...prev, description: '' }))
                }}
                placeholder="Enter Steps Description"
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
            data={steps}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            title='Steps'
            loading={loading}
          />
        </>
      )}
      <DeletePopup
        show={showDeletePopup}
        type="step"
        name={stepToDelete?.name}
        onCancel={() => setShowDeletePopup(false)}
        onConfirm={handleDeleteConfirm}
      />

    </div>
  )
}

export default Steps
