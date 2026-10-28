'use client'
import React from 'react'

const DeletePopup = ({
  show,
  title,
  name = '',
  type = 'item', 
  onCancel,
  onConfirm
}) => {
  if (!show) return null;

  const displayTitle = title || `Are you sure you want to delete this ${type}?`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#062c21]/80 z-[9999]">
      <div className="p-6 bg-white shadow-lg border border-slate-200 rounded-xl w-[90%] sm:w-auto">
        <p className="mb-4 text-lg text-center text-[#062c21]">
          {displayTitle}{" "}
          <span className="block font-semibold text-center text-rose-600">{name}</span>
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-white bg-rose-600 rounded-lg hover:bg-rose-700 font-semibold transition"
          >
            Yes, Delete
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-2 text-[#062c21] bg-slate-200 rounded-lg hover:bg-slate-300 font-medium transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;