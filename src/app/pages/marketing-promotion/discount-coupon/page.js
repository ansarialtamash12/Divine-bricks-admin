'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/discountCoupon-constant'
import { toast } from 'react-toastify'
import DeletePopup from '@/app/common/utils/delete-popup'
import { addCoupon, deleteCoupon, fetchCoupon, updateCoupon } from '@/app/redux/discountCouponSlice'
import { isOnlyDigits, limitToCharacters, validateRequiredField } from '@/app/common/utils/validationHelpers'

const Coupon = () => {
  const dispatch = useDispatch()
  const { loading, CouponData } = useSelector((state) => state.coupon ?? {})
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [code, setCode] = useState('')
  const [details, setDetails] = useState('')
  const [amount, setAmount] = useState('')
  const [amountType, setAmountType] = useState('percent')
  const [active, setActive] = useState(false)
  const [editCouponId, setEditCouponModeId] = useState(null)
  const [errors, setErrors] = useState({})
  const [couponToDelete, setCouponToDelete] = useState(null)
  const [showDeletePopup, setShowDeletePopup] = useState(false)

  useEffect(() => {
    dispatch(fetchCoupon())
  }, [dispatch])

  const validateForm = () => {
    const newErrors = {}

    const codeError = validateRequiredField(code, "Coupon Code");
    if (codeError) newErrors.name = codeError;
  
    const detailsError = validateRequiredField(details, "Coupon Details");
    if (detailsError) newErrors.details = detailsError;
  
    const amountError = validateRequiredField(amount, "Coupon Amount");
    if (amountError) {
      newErrors.amount = amountError;
    } else {
    const digitError = isOnlyDigits(amount, "Coupon Amount");
    if (digitError) {
      newErrors.amount = digitError;
    }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setErrors(errors)
    const couponData = {
      code,
      details,
      amount,
      amountType,
      active,
    }
    try {
      let response;
      if (editMode) {
        couponData.couponId = editCouponId;
        response = await dispatch(updateCoupon(couponData)).unwrap();
        if (response?.statusCode === 200) {
          toast.success(response.message || (editMode ? 'Updated successfully' : 'Added successfully'));
        } else if (response?.statusCode === 417) {
          toast.warn(response.message || 'Something to review');
        } else {
          toast.error(response?.message || 'Unexpected error');
        }
      } else {
        response = await dispatch(addCoupon(couponData))
        if (response.type === "coupon/add/fulfilled") {
          toast.success('Added successfully');
        } else if (response.statusCode === 417) {
          toast.warn('Something to review');
        } else {
          toast.error(response.message || 'Unexpected error');
        }
      }
      setCode('')
      setDetails('')
      setAmount('')
      setAmountType('percent')
      setEditMode(false)
      setActive('')
      setShowForm(false)
      setErrors({})
      dispatch(fetchCoupon())
      setErrors({ code: '', details: '' })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleEdit = (coupon) => {
    setCode(coupon.code)
    setDetails(coupon.details)
    setAmount(coupon.amount)
    setAmountType(coupon.amountType)
    setEditCouponModeId(coupon.couponId)
    setEditMode(true)
    setShowForm(true)
    setActive(coupon.active)
    setErrors({ code: '', details: '' })
  }

  const handleDelete = (coupon) => {
    setCouponToDelete(coupon)
    setShowDeletePopup(true)
  }

  const confirmDelete = async () => {
    try {
      const res = await dispatch(
        deleteCoupon(couponToDelete.couponId),
      ).unwrap()
      if (res.statusCode === 200) toast.success(res.message)
      else toast.error(res.message)
      dispatch(fetchCoupon())
    } catch (error) {
      console.error('Delete Error:', error)
      toast.error('Failed to delete coupon')
    } finally {
      setShowDeletePopup(false)
      setCouponToDelete(null)
    }
  }

  return (
    <div className="max-w-full pt-8 mx-auto mt-5 mb-6 bg-white rounded-lg ">
      <div className="flex">
        <div className="w-full md:w-[45%] flex justify-center md:justify-start">
          {!showForm && (
            <button
              onClick={() => {
                setShowForm(true)
                setEditMode(false)
                setCode('')
                setDetails('')
                setAmount('')
                setActive(false)
                setErrors({ name: '', description: '' })
              }}
              className="px-4 py-2 mt-3 text-white rounded-md bg-add-btn"
            >
              + Add Coupon
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="p-4 mb-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="mb-4 text-2xl font-bold text-center text-add-label">
              {editMode ? 'Edit Coupon' : 'Add Coupon'}
            </h2>

            <div>
              <label className="block mb-3 font-medium">Coupon Amount Type</label>
              <select
                id="amountType"
                value={amountType}
                onChange={(e) => setAmountType(e.target.value)}
                className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E34]'
              >
                <option value="percent">Percent</option>
                <option value="Amount">Amount</option>
              </select>
            </div>

            <div>
              <label className="block mb-3 font-medium">Coupon Amount</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => {
                  const limitedValue = limitToCharacters(e.target.value);
                  setAmount(limitedValue)
                  setErrors((prev) => ({ ...prev, amount: '' }))
                }}
                placeholder="Enter Coupon Amount"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E34]"
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block mb-3 font-medium">Coupon Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  const limitedValue = limitToCharacters(e.target.value);
                  setCode(limitedValue)
                  setErrors((prev) => ({ ...prev, name: '' }))
                }}
                placeholder="Enter Coupon Code"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E34]"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block mb-3 font-medium">Coupon Details</label>
              <input
                type="text"
                value={details}
                onChange={(e) => {
                  setDetails(e.target.value)
                  setErrors((prev) => ({ ...prev, details: '' }))
                }}
                placeholder="Enter Coupon Details"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E34]"
              />
              {errors.details && (
                <p className="text-sm text-red-500">{errors.details}</p>
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
                  setCode('')
                  setDetails('')
                  setAmount('')
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
            data={CouponData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
            title={'Coupon'}
          />
        </>
      )}

      <DeletePopup
        show={showDeletePopup}
        type="coupon"
        name={couponToDelete?.code}
        onCancel={() => setShowDeletePopup(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default Coupon