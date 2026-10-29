"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { fetchAdminUserDetails } from "@/app/redux/adminUserSlice";
import Loading from "@/app/common/loading";

const AdminProfilePage = () => {
  const dispatch = useDispatch();
  const { user: adminDetails, loading, error } = useSelector(
    (state) => state.admin
  );
  const adminUserId = Cookies.get("adminUserId");

  useEffect(() => {
    if (adminUserId) {
      dispatch(fetchAdminUserDetails({ adminUserId }));
    }
  }, [adminUserId, dispatch]);

  if (loading) return <Loading />;

  const fields = [
    { label: "Username", value: adminDetails?.username },
    { label: "Email", value: adminDetails?.email },
    { label: "Phone", value: adminDetails?.phoneNumber },
    { label: "First Name", value: adminDetails?.firstName },
    { label: "Middle Name", value: adminDetails?.middleName },
    { label: "Last Name", value: adminDetails?.lastName },
    { label: "Password", value: adminDetails?.password },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-amber-50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#062c21]">
            Admin Profile
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Your account information
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {adminDetails ? (
          <div className="divide-y divide-slate-100">
            {fields.map((field) => (
              <div
                key={field.label}
                className="flex items-center justify-between gap-4 py-3"
              >
                <span className="text-sm font-medium text-slate-500">
                  {field.label}
                </span>
                <span className="break-all text-right text-sm font-semibold text-[#062c21]">
                  {field.value || "N/A"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-slate-500">
            No user data available
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminProfilePage;