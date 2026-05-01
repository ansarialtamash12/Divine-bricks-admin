'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/pushNotification-constant'
import { toast } from 'react-toastify';
import { addPushNotification, deletePushNotification, fetchPushNotification, updatePushNotification } from '@/app/redux/pushNotificationSlice'
import DeletePopup from '@/app/common/utils/delete-popup'
import { limitToCharacters, validateRequiredField } from '@/app/common/utils/validationHelpers'

const PushNotification = () => {
    const dispatch = useDispatch()
    const { loading, NotificationData } = useSelector((state) => state.pushNotification ?? {});
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [active, setActive] = useState(false);
    const [editNotificationId, setEditNotificationId] = useState(null);
    const [errors, setErrors] = useState({});
    const [pushNotificationToDelete, setPushNotificationToDelete] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);

    useEffect(() => {
        dispatch(fetchPushNotification());
    }, [dispatch]);

    const validateForm = () => {
        const newErrors = {};

        const titleError = validateRequiredField(title, "Notification name");
        if (titleError) newErrors.title = titleError;
              
        const descriptionError = validateRequiredField(description, "Notification description");
        if (descriptionError) newErrors.description = descriptionError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const notificationData = {
            title,
            description,
            active
        };
        try {
            let response;
            if (editMode) {
                notificationData.notificationId = editNotificationId;
                response = await dispatch(updatePushNotification(notificationData)).unwrap();
            } 
            else {
                response = await dispatch(addPushNotification(notificationData)).unwrap();
            }
             if (response?.statusCode === 200) toast.success(response.message);
                  else if (response?.statusCode === 417) toast.warn(response.message);
                  else toast.error(response.message);

            setTitle('');
            setDescription('');
            setEditMode(false);
            setActive(false);
            setShowForm(false);
            setErrors({});
            dispatch(fetchPushNotification());
        } catch (error) {
            console.error("Error:", error);
        }
    };
    
    const handleEdit = (notification) => {
        setErrors({});
        setTitle(notification.title);
        setDescription(notification.description);
        setEditNotificationId(notification.notificationId);
        setEditMode(true);
        setShowForm(true);
        setActive(notification.active);
    };

    const handleDelete = (notification) => {
        setPushNotificationToDelete(notification);
        setShowDeletePopup(true);
    };

    const confirmDelete = async () => {
        try {
            const res = await dispatch(deletePushNotification(pushNotificationToDelete.notificationId)).unwrap();
            if (res.statusCode === 200) toast.success(res.message);
            else toast.error(res.message);
            dispatch(fetchPushNotification());
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error("Failed to delete Notification");
        } finally {
            setShowDeletePopup(false);
            setPushNotificationToDelete(null);
        }
    };

    return (
        <div className="max-w-full pt-8 mx-auto mt-5 mb-6 bg-white rounded-lgnpm ru dev">
            <div className='flex'>
                <div className='w-full md:w-[45%] flex justify-center md:justify-start mb-4'>
                    {!showForm && (
                        <button
                            onClick={() => {
                                setErrors({});
                                setShowForm(true);
                                setEditMode(false);
                                setTitle('');
                                setDescription('');
                                setActive(false);
                            }}
                            className="px-4 py-2 mt-3 text-white rounded-md bg-add-btn">
                            + Add Notification
                        </button>
                    )}
                </div>
            </div>
            {showForm &&
                (
                    <div className="p-4 mb-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h2 className="mb-4 text-2xl font-bold text-center text-add-label">
                                {editMode ? 'Edit Push Notification' : 'Add Push Notification'}
                            </h2>
                            <label className="block mb-3 font-medium">Notification Name</label>
                            <input
                                type="text"
                                placeholder="Notification Name"
                                value={title}
                                onChange={(e) => {
                                    const limitedValue = limitToCharacters(e.target.value);
                                    setTitle(limitedValue);
                                    if (errors.title) {
                                      setErrors((prevErrors) => ({ ...prevErrors, title: '' }));
                                    }
                                  }}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E34]" />
                            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                            <label className="block mb-3 font-medium">Notification Description</label>
                            <input
                                type="text"
                                placeholder="Notification Description"
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    if (errors.description) {
                                      setErrors((prevErrors) => ({ ...prevErrors, description: '' }));
                                    }
                                  }}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E34]" />
                            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
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
                                        setTitle('');
                                        setDescription('');
                                        setActive(false);
                                    }}
                                    className="px-4 py-2 text-white rounded-md bg-cancel-btn hover:bg-gray-600">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            {!showForm && (
                <Table
                    columns={Columns}
                    data={NotificationData}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                    title={'Push Notification'}
                />
            )}
            <DeletePopup
                show={showDeletePopup}
                type="notification"
                name={pushNotificationToDelete?.title}
                onCancel={() => setShowDeletePopup(false)}
                onConfirm={confirmDelete}
            />

        </div>
    )
}
export default PushNotification