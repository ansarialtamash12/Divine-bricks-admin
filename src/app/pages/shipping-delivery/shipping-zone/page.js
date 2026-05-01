'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/shippingPinCodeMethod-constant'
import { addShippingPinCodeMethod, deleteShippingPinCodeMethod, fetchShippingPinCodeMethod, updateShippingPinCodeMethod } from '@/app/redux/shippingPinCodeMethodSlice'
import Select from 'react-select'
import { fetchShippingMethod } from '@/app/redux/shippingMethodSlice'
import DeletePopup from '@/app/common/utils/delete-popup'
import { toast } from 'react-toastify'
import { isOnlyDigits, validateRequiredField, validateRequiredSelect } from '@/app/common/utils/validationHelpers'

const PinCodeShipping = () => {
    const dispatch = useDispatch()
    const { shippingMethodData } = useSelector((state) => state.shippingZone ?? {});
    const { shippingMethod = [] } = useSelector((state) => state?.shippingMethod ?? []);
    const [showForm, setShowForm] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [selectedShippingMethod, setSelectedShippingMethod] = useState(null)
    const [shippingPinCodeNumber, setShippingPinCodeNumber] = useState('')
    const [active, setActive] = useState(false)
    const [showDeletePopup, setShowDeletePopup] = useState(false)
    const [pinCodeToDelete, setPinCodeToDelete] = useState(null)
    const [editPinCodeShippingId, setEditPinCodeShippingId] = useState(null)
    const [errors, setErrors] = useState({
        shippingMethod: '',
        pincode: ''
    });
    const [noOfDays, setNoOfDays] = useState(0)


    const shippingMethodOptions = shippingMethod.map((method) => ({
        value: method.shippingMethodId,
        label: method.name,
    }))

    useEffect(() => {
        dispatch(fetchShippingPinCodeMethod());
        dispatch(fetchShippingMethod())
    }, [dispatch]);

    const resetForm = () => {
        setSelectedShippingMethod(null)
        setShippingPinCodeNumber('')
        setActive(false)
        setEditMode(false)
        setShowForm(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        let validationErrors = {}

        const trimmedPin = String(shippingPinCodeNumber).trim()


        const pinRequiredError = validateRequiredField(trimmedPin, "Pin Code");
        if (pinRequiredError) {
            validationErrors.pincode = pinRequiredError;
        }
        else {
            const digitOnlyError = isOnlyDigits(trimmedPin, "Pin Code");
            if (digitOnlyError) {
                validationErrors.pincode = digitOnlyError;
            } else if (trimmedPin.length !== 6) {
                validationErrors.pincode = "Pin Code must be exactly 6 digits.";
            }
        }

        const shippingMethodError = validateRequiredSelect(selectedShippingMethod, "Shipping Method Name");
        if (shippingMethodError) validationErrors.shippingMethod = shippingMethodError;

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setErrors({}) // Clear errors if valid


        if (!selectedShippingMethod || !shippingPinCodeNumber) {
            return
        }

        const shippingPinCodeData = {
            shippingMethodId: selectedShippingMethod.value,
            pincode: shippingPinCodeNumber,
            active: active,
            noOfDays: noOfDays,
            ...(editMode && { pinCodeShippingId: editPinCodeShippingId }), // Add only in edit mode
        }
        try {
            let res
            if (editMode) {
                res = await dispatch(updateShippingPinCodeMethod(shippingPinCodeData)).unwrap()
            } else {
                res = await dispatch(addShippingPinCodeMethod(shippingPinCodeData)).unwrap()
            }
            resetForm()
            dispatch(fetchShippingPinCodeMethod()) // Refresh list
            toast.success("Shipping Pin Code added successfully!")
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred while submitting the form.");
        }
    }

    const handleEdit = (shippingPinCode) => {
        const shippingMethod = shippingMethodOptions.find(
            (opt) => opt.value === shippingPinCode.shippingMethodId,
        )
        setErrors({});
        setSelectedShippingMethod(shippingMethod);
        setNoOfDays(shippingPinCode.noOfDays || 1);
        setShippingPinCodeNumber(shippingPinCode.pinCode);
        setEditPinCodeShippingId(shippingPinCode.pinCodeShippingId)
        setActive(shippingPinCode.active ?? false);
        setEditMode(true);
        setShowForm(true); // Open the form
    }


    const handleDeletePopup = (pinCodeData) => {
        const normalizedData = {
            ...pinCodeData,
            pincode: pinCodeData.pincode || pinCodeData.pinCode || 'Unknown'
        }

        setPinCodeToDelete(normalizedData)
        setShowDeletePopup(true)
    }

    const confirmDelete = async () => {
        try {
            const res = await dispatch(
                deleteShippingPinCodeMethod(pinCodeToDelete.pinCodeShippingId),
            ).unwrap()
            if (res.statusCode === 200) toast.success(res.message)
            else toast.error(res.message)
            dispatch(fetchShippingPinCodeMethod())
        } catch (error) {
            console.error('Delete Error:', error)
            toast.error('Failed to delete Shipping Pin Code')
        } finally {
            setShowDeletePopup(false)
            setPinCodeToDelete(null)
        }
    }

    return (
        <div className="max-w-full pt-8 mx-auto mt-5 mb-6 bg-white rounded-lg">
            {!showForm ? (
                <button
                    onClick={() => setShowForm(true)}
                    className="block px-4 py-2 mx-auto mt-3 text-white rounded-md bg-add-btn md:mx-0"
                >
                    + Add Shipping Pin Code
                </button>

            ) : (
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <h2 className="mb-4 text-2xl font-bold text-center text-add-label">
                        {editMode ? 'Edit Shipping Pin Code' : 'Add Shipping Pin Code'}
                    </h2>
                    <label className="block mb-3 font-medium">Shipping Method</label>
                    <Select
                        options={shippingMethodOptions}
                        value={selectedShippingMethod}
                        onChange={(option) => {
                            setSelectedShippingMethod(option);
                            if (errors.shippingMethod) {
                                setErrors((prevErrors) => ({ ...prevErrors, shippingMethod: '' }));
                            }
                        }}
                        placeholder="Select Shipping Method"
                        isClearable={!editMode}
                        isDisabled={editMode}
                    />
                    {errors.shippingMethod && (
                        <p className="text-sm text-red-500">{errors.shippingMethod}</p>
                    )}
                    <label className="block mb-3 font-medium">Shipping Pin Code</label>
                    <input
                        type="text"
                        value={shippingPinCodeNumber}
                        onChange={(e) => {
                            const digitsOnly = e.target.value.replace(/\D/g, '');
                            const limitedValue = digitsOnly.slice(0, 6);
                            setShippingPinCodeNumber(limitedValue);

                            if (errors.pincode) {
                                setErrors((prevErrors) => ({ ...prevErrors, pincode: '' }));
                            }
                        }}
                        placeholder="Enter Shipping Pin Code"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    {errors.pincode && (
                        <p className="text-sm text-red-500">{errors.pincode}</p>
                    )}

                    <label className="block mb-3 font-medium">Number of Days</label>
                    <input
                        type="number"
                        min="0"
                        max="10"
                        step="1"
                        value={noOfDays}
                        onChange={(e) => setNoOfDays(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />

                    {/* Active Checkbox */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                            className="w-5 h-5 mr-2 cursor-pointer"
                        />
                        <label className="text-sm font-medium text-gray-700">Active</label>
                    </div>

                    {/* Submit and Cancel Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="px-4 py-2 text-white rounded bg-submit-btn hover:bg-green-600"
                        >
                            {editMode ? 'Update' : 'Submit'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setErrors({});
                                setShowForm(false)
                                resetForm()
                            }}
                            className="px-4 py-2 text-white rounded bg-cancel-btn hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {!showForm && (
                <Table
                    columns={Columns}
                    data={shippingMethodData}
                    onEdit={handleEdit}
                    onDelete={(sub) => {
                        handleDeletePopup(sub);
                    }}
                    title={"Shipping Zone"}
                />
            )}
            <DeletePopup
                show={showDeletePopup}
                type="Pin Code"
                name={pinCodeToDelete?.pincode}
                onCancel={() => setShowDeletePopup(false)}
                onConfirm={confirmDelete}
            />
        </div>
    )
}

export default PinCodeShipping
