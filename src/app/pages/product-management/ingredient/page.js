'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/ingredient-constant'
import {
  addIngredient,
  deleteIngredient,
  fetchIngredient,
  updateIngredient,
} from '@/app/redux/ingredientSlice'
import { toast } from 'react-toastify'
import DeletePopup from '@/app/common/utils/delete-popup'
import { limitToCharacters, validateRequiredField } from '@/app/common/utils/validationHelpers'

const Ingredient = () => {
  const dispatch = useDispatch()
  const { loading, IngredientData } = useSelector(
    (state) => state.ingredient ?? {},
  )
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [active, setActive] = useState(false)
  const [editIngredientId, setEditIngredientModeId] = useState(null)
  const [errors, setErrors] = useState({})
  const [ingredientToDelete, setIngredientToDelete] = useState(null)
  const [showDeletePopup, setShowDeletePopup] = useState(false)

  useEffect(() => {
    dispatch(fetchIngredient())
  }, [dispatch])

  const validateForm = () => {
    const newErrors = {}

        const nameError = validateRequiredField(name, "Ingredient Name");
        if (nameError) newErrors.name = nameError;
        
        const descriptionError = validateRequiredField(description, "Ingredient Description");
        if (descriptionError) newErrors.description = descriptionError;

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return
    setErrors(errors)
    const ingredientData = {
      name,
      description,
      active,
    }

    try {
      let response;
      if (editMode) {
        ingredientData.ingredientId = editIngredientId
        response = await dispatch(updateIngredient(ingredientData)).unwrap()
      } else {
        response = await dispatch(addIngredient(ingredientData)).unwrap()
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
      setErrors({ name: '', description: '' })
      dispatch(fetchIngredient())
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleEdit = (ingredient) => {
    setName(ingredient.name)
    setDescription(ingredient.description)
    setEditIngredientModeId(ingredient.ingredientId)
    setEditMode(true)
    setShowForm(true)
    setErrors({ name: '', description: '' })
    setActive(ingredient.active)
  }

  const handleDelete = (ingredient) => {
    setIngredientToDelete(ingredient)
    setShowDeletePopup(true)
  }

  const confirmDelete = async () => {
    try {
      const res = await dispatch(
        deleteIngredient(ingredientToDelete.ingredientId),
      ).unwrap()
      
      if (res.statusCode === 200) toast.success(res.message)
      else toast.error(res.message)
      dispatch(fetchIngredient())
    } catch (error) {
      console.error('Delete Error:', error)
      toast.error('Failed to delete Ingredient')
    } finally {
      setShowDeletePopup(false)
      setIngredientToDelete(null)
    }
  }

  return (
    <div className="max-w-full pt-8 mx-auto mt-5 mb-6 bg-white rounded-lg">
      <div className="flex">
        <div className="w-full md:w-[45%] flex justify-center md:justify-start">
          {!showForm && (
            <button
              onClick={() => {
                setShowForm(true)
                setEditMode(false)
                setName('')
                setDescription('')
                setErrors({ name: '', description: '' })
                setActive(false)
              }}
              className="px-4 py-2 mt-3 text-white rounded-md bg-add-btn"
            >
              + Add Ingredient
            </button>
          )}
        </div>
        {!showForm && (
          <>
            <h2 className="mb-4 text-2xl font-bold text-center text-add-label"></h2>
          </>
        )}
      </div>

      {/* Form for Adding/Editing Ingredient */}

      {showForm && (
        <div className="p-4 mb-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="mb-4 text-2xl font-bold text-center text-add-label">
              {editMode ? 'Edit Ingredient' : 'Add Ingredient'}
            </h2>
            <div>
              <label className="block font-medium">Ingredient Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  const limitedValue = limitToCharacters(e.target.value);
                  setName(limitedValue)
                  setErrors((prev) => ({ ...prev, name: '' }))
                }}
                placeholder="Enter Ingredient Name"
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
                  setErrors({ name: '', description: '' })
                  setActive(false)
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
        <Table
          columns={Columns}
          data={IngredientData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          title={'Ingredient'}
        />
      )}

      <DeletePopup
            show={showDeletePopup}
            type="ingredient"
            name={ingredientToDelete?.name}
            onCancel={() => setShowDeletePopup(false)}
            onConfirm={confirmDelete}
        />
    </div>
  )
}

export default Ingredient
