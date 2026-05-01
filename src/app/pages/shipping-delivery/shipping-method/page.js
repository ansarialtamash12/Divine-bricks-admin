'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchShippingMethod,
  addShippingMethod,
  updateShippingMethod,
  deleteShippingMethod,
} from '@/app/redux/shippingMethodSlice'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/shippingMethod-constant'
import DeletePopup from '@/app/common/utils/delete-popup'
import { toast } from 'react-toastify'
import { isOnlyLetters, isValidUrl, validateRequiredField } from '@/app/common/utils/validationHelpers'

const INITIAL_FORM_DATA = {
  name: '',
  courier: '',
  shippingZone: '',
  baseCost: '',
  costPerKg: '',
  maxWeightLimit: '',
  minOrderValue: '',
  trackingURL: '',
  active: true,
}

const ShippingMethod = () => {
  const dispatch = useDispatch()
  const {
    shippingMethod = [],
    loading,
    error,
  } = useSelector((state) => state.shippingMethod ?? {})

  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentShippingMethod, setCurrentShippingMethod] = useState(null)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState({})
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [shippingMethodToDelete, setShippingMethodToDelete] = useState(null)

  useEffect(() => {
    dispatch(fetchShippingMethod())
  }, [dispatch])

  const validateForm = () => {
    let newErrors = {};

    const { name, baseCost, costPerKg, maxWeightLimit, minOrderValue, courier, trackingURL, shippingZone } = formData;

    const nameError = validateRequiredField(name, "Name") || isOnlyLetters(name, "Name");

    if (nameError) {
      newErrors.name = nameError;
    }

    const baseCostError = validateRequiredField(baseCost, "Base Cost");
    if (baseCostError) {
      newErrors.baseCost = baseCostError;
    }

    const costPerKgError = validateRequiredField(costPerKg, "Cost Per Kg");
    if (costPerKgError) {
      newErrors.costPerKg = costPerKgError;
    }

    const maxWeightError = validateRequiredField(maxWeightLimit, "Max Weight Limit");
    if (maxWeightError) {
      newErrors.maxWeightLimit = maxWeightError;
    }

    const minOrderValueError = validateRequiredField(minOrderValue, "Min Order Value");
    if (minOrderValueError) {
      newErrors.minOrderValue = minOrderValueError;
    }

    const courierError = validateRequiredField(courier, "Courier");
    if (courierError) {
      newErrors.courier = courierError;
    }

    const urlError = validateRequiredField(trackingURL, "Tracking URL");
    if (urlError) {
      newErrors.trackingURL = urlError;
    } else {
      const urlFormatError = isValidUrl(trackingURL);
      if (urlFormatError) {
        newErrors.trackingURL = urlFormatError;
      }
    }

    const zoneError = validateRequiredField(shippingZone, "Shipping Zone");
    if (zoneError) {
      newErrors.shippingZone = zoneError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (
      (name === 'baseCost' ||
        name === 'costPerKg' ||
        name === 'maxWeightLimit' ||
        name === 'minOrderValue') &&
      (!/^[0-9.]*$/.test(value) || value.length > 10)
    ) {
      return
    }

    if (
      (name === 'name' || name === 'courier' || name === 'shippingZone') &&
      (!/^[A-Za-z0-9s]*$/.test(value) || value.length > 50)
    ) {
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    // Remove the error for this field if the user provides a valid input
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors }
      if (value.trim()) {
        delete newErrors[name] // Delete the error for this field
      }
      return newErrors
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      let response
      if (editMode && currentShippingMethod) {
        response = await dispatch(
          updateShippingMethod({
            shippingMethodId: currentShippingMethod.shippingMethodId,
            ...formData,
          }),
        )
        if (response.type === "shippingMethod/update/fulfilled") {
          toast.success('Updated successfully');
        } else if (response.statusCode === 417) {
          toast.warn('Something to review');
        } else {
          toast.error(response.message || 'Unexpected error');
        }
      } else {
        response = await dispatch(addShippingMethod(formData))
        if (response.type === "shippingMethod/add/fulfilled") {
          toast.success('Added successfully');
        } else if (response.statusCode === 417) {
          toast.warn('Something to review');
        } else {
          toast.error(response.message || 'Unexpected error');
        }
      }
      resetForm()
      setErrors({}) // 👈 Clear errors after successful submit
      dispatch(fetchShippingMethod())
    } catch (error) {
      console.error('Error saving shipping method:', error)
    }
  }

  const handleEdit = (shippingMethod) => {
    setEditMode(true)
    setCurrentShippingMethod(shippingMethod)
    setFormData({ ...shippingMethod })
    setErrors({}) // 👈 Add this line
    setShowForm(true)
  }

  const handleDeleteClick = (shippingMethod) => {
    setShippingMethodToDelete(shippingMethod)
    setShowDeletePopup(true)
  }

  const handleDeleteConfirm = async () => {
    if (!shippingMethodToDelete) return;

    try {
      const res = await dispatch(
        deleteShippingMethod({
          shippingMethodId: shippingMethodToDelete.shippingMethodId,
        })
      ).unwrap();

      if (res.statusCode === 200) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }

      dispatch(fetchShippingMethod());
    } catch (error) {
      console.error('Delete Error:', error);
      toast.error('Failed to delete shipping method');
    } finally {
      setShowDeletePopup(false);
      setShippingMethodToDelete(null);
    }
  };


  const resetForm = () => {
    setShowForm(false)
    setEditMode(false)
    setCurrentShippingMethod(null)
    setFormData(INITIAL_FORM_DATA)
  }

  return (
    <div className="w-full px-4 pt-8 mx-auto mt-5 mb-6 overflow-x-hidden bg-white rounded-lg">
      <div className='flex justify-center md:justify-start'>
        <div className='flex items-center justify-start w-full md:justify-between'>
          {!showForm && (
            <button
              onClick={() => {
                setShowForm(true)
                setEditMode(false)
                setFormData(INITIAL_FORM_DATA)
              }}
              className="px-4 py-2 mx-auto mt-3 text-white rounded-md bg-add-btn md:mx-0"
            >
              + Add Shipping Method
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-4 mb-4"
        >
          <h2 className="mb-10 text-2xl font-bold text-center text-add-label">
            {editMode ? 'Edit Shipping Method' : 'Add New Shipping Method'}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Object.keys(INITIAL_FORM_DATA).map((key) => (
              <div key={key}>
                <label className="block font-medium capitalize">{key}</label>
                {key === 'active' ? (
                  <div className="flex items-center mt-4 space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="active"
                      checked={formData.active}
                      onChange={handleChange}
                      className="w-5 h-5"
                    />
                    <label htmlFor="isActive" className="font-medium">
                      Active
                    </label>
                  </div>
                ) : (
                  <input
                    type="text"
                    name={key}
                    className="w-full p-2 mt-2 border rounded focus:ring-2 focus:ring-blue-400"
                    value={formData[key]}
                    onChange={handleChange}
                  />
                )}
                {errors[key] && <p className="text-red-500">{errors[key]}</p>}
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="px-4 py-2 text-white rounded bg-submit-btn hover:bg-green-600"
            >
              {editMode ? 'Update' : 'Submit'}
            </button>
            <button
              type="button"
              className="px-4 py-2 text-white rounded bg-cancel-btn hover:bg-gray-600"
              onClick={resetForm}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {!showForm && (
        <>
          {error && <p className="text-red-500">Error: {error}</p>}
          <Table
            columns={Columns}
            data={shippingMethod}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            title={"Shipping Methods"}
          />
        </>
      )}

      <DeletePopup
        show={showDeletePopup}
        type="shipping method"
        name={shippingMethodToDelete?.name}
        onCancel={() => setShowDeletePopup(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

export default ShippingMethod
