'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchColors, addColor, updateColor, deleteColor } from '@/app/redux/colorSlice'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/color-constant'
import { toast } from 'react-toastify'
import DeletePopup from '@/app/common/utils/delete-popup'

const ColorPage = () => {
  const dispatch = useDispatch()
  const { color = [], loading, error } = useSelector((state) => state.color ?? {})

  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentColor, setCurrentColor] = useState(null)
  const [name, setName] = useState('')
  const [active, setActive] = useState(true)

  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [colorToDelete, setColorToDelete] = useState(null)
  const [formErrors, setFormErrors] = useState({
    name: '',
  })

  useEffect(() => {
    dispatch(fetchColors())
  }, [dispatch])

  const resetForm = () => {
    setShowForm(false)
    setEditMode(false)
    setCurrentColor(null)
    setName('')
    setActive(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = {
      name: '',

    }

    if (!name.trim()) {
      errors.name = 'Color name is required'
    }
    setFormErrors(errors)

    if (!name.trim()) return

    try {
      let response
      if (editMode && currentColor) {
        response = await dispatch(
          updateColor({ colorId: currentColor.colorId, name, active })
        ).unwrap()
      } else {
        response = await dispatch(addColor({ name, active: true })).unwrap()
      }

      if (response.statusCode === 200) {
        toast.success(response.message)
        resetForm()
        dispatch(fetchColors())
      } else if (response.statusCode === 417) {
        toast.warn(response.message)
      } else {
        const response = await dispatch(addColor({ name, active: true })).unwrap()
        if (response.statusCode === 200) {
          toast.success(response.message);
        } else if (response.statusCode === 417) {
          toast.warn(response.message);
        } else {
          toast.error(response.message);
        }

      }

      // Reset form and refresh data
      setShowForm(false)
      setEditMode(false)
      setCurrentColor(null)
      setName('')
      setActive(true)
      setFormErrors({ name: '' })
      dispatch(fetchColors())
    } catch (error) {
      console.error('Error saving color:', error)
      toast.error('Something went wrong.')
    }
  }

  const handleEdit = (color) => {
    setEditMode(true)
    setCurrentColor(color)
    setName(color.name)
    setFormErrors({ name: '' })
    setActive(color.active)
    setShowForm(true)
  }

  const handleDeleteClick = (color) => {
    setColorToDelete(color)
    setShowDeletePopup(true)
  }

  const confirmDelete = async () => {
    if (!colorToDelete) return

    try {
      const response = await dispatch(deleteColor({ colorId: colorToDelete.colorId })).unwrap()
      if (response.statusCode === 200) {
        toast.success(response.message)
        dispatch(fetchColors())
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete color.')
    } finally {
      setShowDeletePopup(false)
    }
  }

  if (error) {
    return <p className="p-4 text-rose-600">Error: {error}</p>
  }

  return (
    <div className="p-4 mt-5 mb-6">
      {!showForm && (
        <button
          onClick={() => {
            setShowForm(true)
            setEditMode(false)
            setName('')
            setFormErrors({ name: '' })
            setActive(true)
          }}
          className="block px-4 py-2 mx-auto mt-3 text-amber-300 rounded-md bg-[#062c21] hover:bg-[#093d2e] transition font-semibold sm:mx-0"
        >
          + Add Color
        </button>

      )}

      {showForm && (
        <div className="p-4 mb-4 bg-slate-50 border border-slate-200 rounded shadow-md">
          <h2 className="mb-2 text-lg font-bold text-center text-[#062c21]">
            {editMode ? 'Edit Color' : 'Add New Color'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium text-[#062c21]">Color Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setFormErrors((prev) => ({ ...prev, name: '' }))
                }}
                placeholder="Enter Color Name"
                className="w-full p-2 mt-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#062c21]"
              />
              {formErrors.name && (
                <p className="text-sm text-rose-600">{formErrors.name}</p>
              )}
            </div>

            {editMode && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-5 h-5 accent-[#062c21]"
                />
                <label htmlFor="isActive" className="font-medium text-[#062c21]">
                  Active
                </label>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 text-amber-300 rounded bg-[#062c21] hover:bg-[#093d2e] transition font-semibold"
              >
                {editMode ? 'Update' : 'Submit'}
              </button>
              <button
                type="button"
                className="px-4 py-2 text-[#062c21] rounded bg-slate-200 hover:bg-slate-300 transition font-medium"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <>
          {color.length === 0 ? (
            <p className="text-slate-500">No colors available.</p>
          ) : (
            <Table
              columns={Columns}
              data={color}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              loading={loading}
              title={"Color"}
            />
          )}
        </>
      )}

      <DeletePopup
        show={showDeletePopup}
        type="color"
        name={colorToDelete?.name}
        onCancel={() => setShowDeletePopup(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default ColorPage