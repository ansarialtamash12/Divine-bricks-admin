'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/paymentMethod-constant'
import { addPaymentMethod, deletePaymentMode, fetchAllPaymentMethod, updatePaymentMethod } from '@/app/redux/paymentMethodSlice'
import DeletePopup from '@/app/common/utils/delete-popup'
import { toast } from 'react-toastify';
import { limitToCharacters, validateRequiredField } from '@/app/common/utils/validationHelpers'

const PaymentMethod = () => {

    const dispatch = useDispatch()
    const { loading, paymentMethodData } = useSelector((state) => state.paymentMethod ?? {});
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [active, setActive] = useState(false);
    const [paymentName, setPaymentName] = useState('');
    const [editPaymentModeId, setEditPaymentModeId] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [selectedPaymentModeId, setSelectedPaymentModeId] = useState(null);
    const [errors, setErrors] = useState({});
    const [paymentMethodToDelete, setPaymentMethodToDelete] = useState(null)

    useEffect(() => {
        dispatch(fetchAllPaymentMethod());
    }, [dispatch]);

    const validateForm = () => {
        const newErrors = {};

        const paymentNameError = validateRequiredField(paymentName, "Payment Name");
        if (paymentNameError) newErrors.paymentName = paymentNameError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return;

        const paymentMethodData = {
            paymentName,
            active
        };

        try {
            let response;
            if (editMode) {
                paymentMethodData.paymentModeId = editPaymentModeId;
                response = await dispatch(updatePaymentMethod(paymentMethodData)).unwrap();
            } else {
                response = await dispatch(addPaymentMethod(paymentMethodData)).unwrap();
            }

            if (response?.statusCode === 200) toast.success(response.message);
            else if (response?.statusCode === 417) toast.warn(response.message);
            else toast.error(response.message);

            setPaymentName('');
            setEditMode(false);
            setActive(false);
            setShowForm(false);
            setErrors({})
            dispatch(fetchAllPaymentMethod());
        } catch { }
    };

    const handleEdit = (paymentMethod) => {
        setErrors({});
        setPaymentName(paymentMethod.paymentName);
        setEditPaymentModeId(paymentMethod.paymentModeId);
        setEditMode(true);
        setShowForm(true);
        setActive(paymentMethod.active);
    };

    const handleDeletePopup = (paymentMethod) => {
        setSelectedPaymentModeId(paymentMethod.paymentModeId);
        setPaymentMethodToDelete(paymentMethod); // <-- store the full object
        setShowDeletePopup(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const res = await dispatch(deletePaymentMode(selectedPaymentModeId)).unwrap();
            if (res.statusCode === 200) toast.success(res.message);
            else toast.error(res.message);
        } finally {
            setShowDeletePopup(false);
            setSelectedPaymentModeId(null);
            dispatch(fetchAllPaymentMethod());
            setPaymentMethodToDelete()
        }
    };

    return (
        <div className="max-w-full pt-8 mx-auto mt-5 mb-6 bg-white rounded-lg">
            <div className='flex'>
                <div className="flex justify-center w-full md:justify-start">
                    {!showForm && (
                        <button
                            onClick={() => {
                                setErrors({});
                                setShowForm(true);
                                setEditMode(false);
                                setPaymentName('');
                                setActive(false);
                            }}
                            className="px-4 py-2 mt-3 text-white rounded-md bg-add-btn">
                            + Add Payment Method
                        </button>
                    )}
                </div>

            </div>


            {showForm && (
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <h2 className="mb-4 text-2xl font-bold text-center text-add-label">
                        {editMode ? 'Edit Payment Method' : 'Add Payment Method'}
                    </h2>
                    <label className="block font-medium">Payment Method Name</label>
                    <input
                        type="text"
                        placeholder="Payment Method Name"
                        value={paymentName}
                        onChange={(e) => {
                            const limitedValue = limitToCharacters(e.target.value);
                            setPaymentName(limitedValue);
                            if (errors.paymentName) {
                                setErrors((prevErrors) => ({ ...prevErrors, paymentName: '' }));
                            }
                        }}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E34]" />

                    {errors.paymentName && <p className="mt-1 text-sm text-red-500">{errors.paymentName}</p>}

                    {/* Active Checkbox */}
                    {editMode && (
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={active}
                                onChange={(e) => setActive(e.target.checked)}
                                className="w-5 h-5 mr-2 cursor-pointer" />
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
                            disabled={loading}>
                            {editMode ? 'Update' : 'Submit'}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setErrors({});
                                setShowForm(false);
                                setEditMode(false);
                                setPaymentName('');
                                setActive(false);
                            }}
                            className="px-4 py-2 text-white rounded-md bg-cancel-btn hover:bg-gray-600">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {!showForm && (

                <Table
                    columns={Columns}
                    data={paymentMethodData}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={(paymentMethod) => paymentMethod.active ? handleDeletePopup(paymentMethod) : null}
                    title={'Payment Method'}
                />
            )}
            <DeletePopup
                show={showDeletePopup}
                type="payment method"
                name={paymentMethodToDelete?.paymentName}
                onCancel={() => setShowDeletePopup(false)}
                onConfirm={handleConfirmDelete}
            />

        </div>
    )
}

export default PaymentMethod
