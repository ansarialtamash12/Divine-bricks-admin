"use client"

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSkinInsightProduct } from '@/app/redux/skinInsightSlice';
import { getProductList } from '@/app/redux/productSlice';
import { toast } from 'react-toastify';

const SkinInsight = ({ productId, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.skinInsight);

  const [formData, setFormData] = useState({
    productId,
    age: '',
    gender: '',
    skintype: '',
    skinSensitive: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const ageGroups = [
    'Below 18',
    '18 to 24',
    '25 to 30',
    '31 to 34',
    '35 to 40',
    'Above 40'
  ];
  const genders = ['Male', 'Female', 'Other'];
  const skinTypes = ['Normal', 'Dry', 'Oily', 'Combination', 'Sensitive'];
  const skinSensitiveOptions = ['Yes', 'No'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      productId: formData.productId,
      age: formData.age,
      gender: formData.gender,
      skintype: formData.skintype,
      skinSensitive: formData.skinSensitive
    };

    const resultAction = await dispatch(addSkinInsightProduct(payload));
    if (addSkinInsightProduct.fulfilled.match(resultAction)) {
      toast.success('Skin insight added successfully!');
      setFormData({ age: '', gender: '', skintype: '', skinSensitive: '' });
    } else {
      toast.error(resultAction.payload || 'Failed to add skin insight');
    }
  };

  const handleCancel = async () => {
    try {
      await dispatch(getProductList());
      toast.success('Product list refreshed!');
      if (onClose) onClose();
    } catch (error) {
      toast.error('Failed to refresh product list');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        <h1 className="mb-6 text-2xl font-bold text-center text-blue-900">Skin Insight</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="age" className="block mb-1 text-sm font-medium text-gray-700">Age</label>
            <select
              name="age"
              id="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select Age Group</option>
              {ageGroups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>


          <div>
            <label htmlFor="gender" className="block mb-1 text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select Gender</option>
              {genders.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="skintype" className="block mb-1 text-sm font-medium text-gray-700">Skin Type</label>
            <select
              name="skintype"
              id="skintype"
              value={formData.skintype}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select Skin Type</option>
              {skinTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="skinSensitive" className="block mb-1 text-sm font-medium text-gray-700">Is your skin sensitive?</label>
            <select
              name="skinSensitive"
              id="skinSensitive"
              value={formData.skinSensitive}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select Option</option>
              {skinSensitiveOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 font-semibold text-white transition bg-blue-700 rounded-md hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="w-full py-2 font-semibold text-blue-700 transition border border-blue-700 rounded-md hover:bg-blue-50"
          >
            Go to Product List
          </button>
        </form>
      </div>
    </div>
  );
};

export default SkinInsight;
