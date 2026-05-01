
"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {fetchAllAdminUsersList,fetchActivateAdminUser,fetchDeActivateAdminUser} from "@/app/redux/adminUserSlice";
import Loading from "@/app/common/loading";
import Table from "@/app/common/datatable";
import { Columns } from "@/app/constants/adminUser-constant";
import { toast } from "react-toastify";
import DeletePopup from "@/app/common/utils/delete-popup";

const AdminProfilePage = () => {
  const dispatch = useDispatch();
  const {allAdminListData: adminList = [],loading,error,activateStatus,deactivateStatus,} = useSelector((state) => state?.admin ?? {});

  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState(null);

  useEffect(() => {
    dispatch(fetchAllAdminUsersList());
  }, [dispatch, activateStatus, deactivateStatus]);

  const handleActivate = (admin) => {
    setEditData(admin);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditData(null);
  };

  const handleToggleActive = () => {
    if (editData) {
      setEditData({ ...editData, active: !editData.active });
    }
  };

  const handleSave = async () => {
    if (editData) {
      try {
        const res = await dispatch(fetchActivateAdminUser(editData.adminUserId)).unwrap();
        if (res.statusCode === 404) {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
        setShowForm(false);
        setEditData(null);
      } catch (error) {
        console.error("Activation error:", error);
        toast.error("Activation failed.");
      }
    }
  };

  const handleDeActivate = (admin) => {
    setUserToDeactivate(admin);
    setShowDeletePopup(true);
  };

  const confirmDeActivate = async () => {
    try {
      const res = await dispatch(fetchDeActivateAdminUser(userToDeactivate.adminUserId)).unwrap();
      if (res.statusCode === 404) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      setUserToDeactivate(null);
      setShowDeletePopup(false);
    } catch (error) {
      toast.error("Deactivation failed.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-2 bg-white">
      {showForm ? (
        <div className="p-6 bg-white rounded shadow-md">
          <h2 className="mb-4 text-xl font-bold text-add-label"> Admin User</h2>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={editData?.username}
              disabled
              className="w-full p-3 mb-2 border border-gray-300 rounded cursor-not-allowed"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              value={editData?.firstName}
              disabled
              className="w-full p-3 mb-2 border border-gray-300 rounded cursor-not-allowed"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Middle Name</label>
            <input
              type="text"
              value={editData?.middleName}
              disabled
              className="w-full p-3 mb-2 border border-gray-300 rounded cursor-not-allowed"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              value={editData?.lastName}
              disabled
              className="w-full p-3 mb-2 border border-gray-300 rounded cursor-not-allowed"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={editData?.email}
              disabled
              className="w-full p-3 mb-2 border border-gray-300 rounded cursor-not-allowed"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              value={editData?.phoneNumber}
              disabled
              className="w-full p-3 mb-2 border border-gray-300 rounded cursor-not-allowed"
            />
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={editData?.active}
              onChange={handleToggleActive}
              className="w-5 h-5 mr-2"
            />
            <label className="text-sm">Activate</label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 text-white bg-submit-btn rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-white bg-cancel-btn rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {loading && <Loading />}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <Table
              columns={Columns}
              data={adminList}
              onEdit={handleActivate}
              onDelete={handleDeActivate}
              title={"Admin Users"}
            />
          )}
        </>
      )}

      {/* Deactivate confirmation popup */}
      <DeletePopup
        show={showDeletePopup}
        type="admin user"
        name={userToDeactivate?.username}
        onCancel={() => {
          setShowDeletePopup(false);
          setUserToDeactivate(null);
        }}
        onConfirm={confirmDeActivate}
      />
    </div>
  );
};

export default AdminProfilePage;