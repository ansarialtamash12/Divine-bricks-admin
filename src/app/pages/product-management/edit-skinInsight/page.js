'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSkinInsightProduct, updateProductSkinInsight, deleteProductSkinInsight } from '@/app/redux/skinInsightSlice';
import { toast } from 'react-toastify';

const EditSkinInsight = ({ productId }) => {
  const dispatch = useDispatch();
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ age: '', gender: '', skintype: '', skinSensitive: '', status: '' });
  const { skinProductId, loading, error } = useSelector((state) => state.skinInsight);

  useEffect(() => {
    if (productId) {
      dispatch(fetchSkinInsightProduct(productId));
    } else {
      console.warn('No productId provided to EditSkinInsight component');
    }
  }, [dispatch, productId]);

  const handleEditClick = (skinInsight) => {
    if (!skinInsight || !skinInsight.skininsightproductId) {
      console.warn('Invalid skinInsight object:', skinInsight);
      return;
    }
    setEditItem(skinInsight.skininsightproductId);
    setFormData({
      age: skinInsight.age || '',
      gender: skinInsight.gender || '',
      skintype: skinInsight.skintype || '',
      skinSensitive: skinInsight.skinSensitive ? 'Yes' : 'No',
      status: skinInsight.status ? 'Active' : 'Inactive',
    });
  };

  const handleDeleteClick = async (skinInsight) => {
    const result = await dispatch(deleteProductSkinInsight(skinInsight));

    if (deleteProductSkinInsight.fulfilled.match(result)) {
      toast.success('FAQ deleted successfully!');
      dispatch(fetchSkinInsightProduct(productId));
    } else {
      toast.error(result.payload || 'Failed to delete FAQ');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedSkinInsight = {
        skininsightproductId: editItem,
        productId: productId,
        age: formData.age,
        gender: formData.gender,
        skintype: formData.skintype,
        skinSensitive: formData.skinSensitive,
        active: formData.status === 'Active' ? true : false,
      };

      const Action = await dispatch(updateProductSkinInsight(updatedSkinInsight));

      if (updateProductSkinInsight.fulfilled.match(Action)) {
        toast.success('Skin Insight updated successfully!');
        setEditItem(null);
        dispatch(fetchSkinInsightProduct(productId));
      } else {
        toast.error(Action.payload || 'Failed to update Skin Insight');
      }
    } catch (error) {
      console.error('Error updating Skin Insight:', error);
      toast.error('An unexpected error occurred while updating.');
    }
  };

  if (loading) return <p className="text-gray-600">Loading Skin Insight...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="w-full p-4 md:p-6">
      <div className="grid grid-cols-1 gap-6 md:gap-8">
        <div className="p-4 bg-white rounded-lg shadow-md md:p-6 md:rounded-xl">
          <h3 className="mb-4 text-xl font-bold text-center text-gray-800 md:mb-6 md:text-2xl">Skin Insight</h3>

          {Array.isArray(skinProductId) && skinProductId.length > 0 ? (
            <div className="overflow-x-auto">
              {/* Desktop Table */}
              <table className="hidden w-full bg-white border border-gray-200 rounded-lg md:table">
                <thead>
                  <tr className="bg-green-100">
                    <th className="w-40 px-4 py-2 text-center border">Actions</th>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 border-b">Age</th>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 border-b">Gender</th>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 border-b">Skin Type</th>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 border-b">Sensitive Skin</th>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {skinProductId.map((skinInsight) => (
                    <tr key={skinInsight.id} className="transition hover:bg-gray-50">
                      <td className="px-4 py-2 border">
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                            onClick={() => handleEditClick(skinInsight)}
                          >
                            Edit
                          </button>
                          <button
                            className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                            onClick={() => handleDeleteClick(skinInsight)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-800 border-b">{skinInsight.age}</td>
                      <td className="px-6 py-4 text-gray-800 border-b">{skinInsight.gender}</td>
                      <td className="px-6 py-4 text-gray-800 border-b">{skinInsight.skintype}</td>
                      <td className="px-6 py-4 text-gray-800 border-b">{skinInsight.skinSensitive}</td>
                      <td className="px-6 py-4 text-gray-800 border-b">{skinInsight.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="space-y-4 md:hidden">
                {skinProductId.map((skinInsight) => (
                  <div key={skinInsight.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500">Age</p>
                        <p className="text-gray-800">{skinInsight.age}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Gender</p>
                        <p className="text-gray-800">{skinInsight.gender}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Skin Type</p>
                        <p className="text-gray-800">{skinInsight.skintype}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Sensitive</p>
                        <p className="text-gray-800">{skinInsight.skinSensitive}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Status</p>
                        <p className="text-gray-800">{skinInsight.status}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="flex-1 px-3 py-1 text-sm text-white bg-yellow-500 rounded hover:bg-yellow-600"
                        onClick={() => handleEditClick(skinInsight)}
                      >
                        Edit
                      </button>
                      <button
                        className="flex-1 px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                        onClick={() => handleDeleteClick(skinInsight)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No Skin Insight data available.</p>
          )}
        </div>

        {editItem && (
          <div className="p-4 mt-4 border rounded-lg bg-gray-50 md:p-6 md:mt-6 md:rounded-xl">
            <h3 className="mb-3 text-lg font-semibold text-gray-800 md:mb-4 md:text-xl">Edit Skin Insight</h3>

            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Age</label>
                <select
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border rounded md:text-base"
                >
                  <option value="Below 18">Below 18</option>
                  <option value="18 to 24">18 to 24</option>
                  <option value="25 to 30">25 to 30</option>
                  <option value="31 to 34">31 to 34</option>
                  <option value="35 to 40">35 to 40</option>
                  <option value="Above 40">Above 40</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border rounded md:text-base"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Skin Type</label>
                <select
                  name="skintype"
                  value={formData.skintype}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border rounded md:text-base"
                >
                  <option value="Normal">Normal</option>
                  <option value="Dry">Dry</option>
                  <option value="Oily">Oily</option>
                  <option value="Combination">Combination</option>
                  <option value="Sensitive">Sensitive</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Skin Sensitive</label>
                <select
                  name="skinSensitive"
                  value={formData.skinSensitive}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border rounded md:text-base"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.status === 'Active'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.checked ? 'Active' : 'Inactive',
                    }))
                  }
                  className="w-4 h-4 mr-2 text-blue-600"
                />
                <span className="text-sm">Active</span>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700 md:text-base"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="flex-1 px-4 py-2 text-sm text-white bg-gray-500 rounded hover:bg-gray-600 md:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditSkinInsight;