'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProductFaq, fetchProductFaq } from '@/app/redux/faqSlice';
import { toast } from 'react-toastify';
import RichTextEditor from '../../../../common/text-editor/page'



const AddFaqForm = ({ productId, createdBy, setActiveTab }) => {
  const dispatch = useDispatch();
  const { faqData, faqProductId, currentProductId } = useSelector((state) => state.faq);
  const [isFaqAdded, setIsFaqAdded] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    faqType: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const faqPayload = {
      productId,
      title: formData.title,
      description: formData.description,
      faqType: formData.faqType,
      createdBy,
    };

    const resultAction = await dispatch(addProductFaq(faqPayload));

    if (addProductFaq.fulfilled.match(resultAction)) {
      toast.success('FAQ added successfully!');
      setFormData({ title: '', description: '' });
      dispatch(fetchProductFaq(productId));
      setIsFaqAdded(true);
    } else {
      toast.error(resultAction.payload || 'Failed to add FAQ');
    }
  };

  return (
    <div className="w-full p-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="p-6 mt-3 shadow-md bg-gray-50 rounded-xl">
          <h3 className="mb-6 text-2xl font-bold text-gray-800">FAQs</h3>

          {currentProductId === productId && faqProductId.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 border-b">Title</th>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 border-b">Description</th>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 border-b">Faq Type </th>
                  </tr>
                </thead>
                <tbody>
                  {faqProductId
                    .filter((faq) => faq && faq.title && faq.description && faq.faqType)
                    .map((faq) => (
                      <tr
                        key={faq.id || faq.productFaqid}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 font-medium text-gray-800 border-b">{faq.title}</td>

                        <td
                          className="max-w-xs px-6 py-4 prose text-gray-600 border-b"
                          dangerouslySetInnerHTML={{ __html: faq.description }}
                        ></td>

                        <td className="px-6 py-4 text-gray-600 border-b">{faq.faqType}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No FAQs added yet.</p>
          )}
        </div>


        {/* Add FAQ Form Section */}
        <div className="p-6 bg-white shadow-md rounded-xl">
          <h3 className="mb-6 text-2xl font-bold text-gray-800">Add New FAQ</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter FAQ Title"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Description
              </label>

              <RichTextEditor
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
              />

            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">FAQ Type</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="faqType"
                    value="Ingredient"
                    checked={formData.faqType === 'Ingredient'}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Ingredient</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="faqType"
                    value="WithProduct"
                    checked={formData.faqType === 'WithProduct'}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">With Product</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="faqType"
                    value="Faq"
                    checked={formData.faqType === 'Faq'}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">FAQ</span>
                </label>
              </div>
            </div>


            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="w-full py-2 text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Add FAQ
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('addSkinInsight')}
                className="w-full py-2 text-blue-600 transition-all bg-white border border-blue-600 rounded-lg hover:bg-blue-50"
              >
                {isFaqAdded ? 'Next' : 'Skip to SkinInsight'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFaqForm;