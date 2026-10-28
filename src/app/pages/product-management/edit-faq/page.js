'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductFaq, updateProductFaq, deleteProductFaq, addProductFaq } from '@/app/redux/faqSlice';
import RichTextEditor from '../../../common/text-editor/page';
import { toast } from 'react-toastify';

const EditFaq = ({ productId, createdBy }) => {
    const dispatch = useDispatch();
    const { faqProductId, loading, error } = useSelector((state) => state.faq);
    const [editItem, setEditItem] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', faqType: '', status: '' });
    const [addFormData, setAddFormData] = useState({ title: '', description: '', faqType: '' });

    useEffect(() => {
        if (productId) {
            dispatch(fetchProductFaq(productId));
        }
    }, [dispatch, productId]);

    const handleEditClick = (faq) => {
        setEditItem(faq.productFaqid);
        setFormData({
            title: faq.title,
            description: faq.description,
            faqType: faq.faqType,
            status: faq.status,
        });
    };

    const handleDeleteClick = async (faq) => {
        const result = await dispatch(deleteProductFaq(faq));

        if (deleteProductFaq.fulfilled.match(result)) {
            toast.success('FAQ deleted successfully!');
            dispatch(fetchProductFaq(productId));
        } else {
            toast.error(result.payload || 'Failed to delete FAQ');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const updatedFaq = {
                productFaqid: editItem,
                productId,
                title: formData.title,
                description: formData.description,
                faqType: formData.faqType,
                active: formData.status === 'Active',
            };

            const result = await dispatch(updateProductFaq(updatedFaq));

            if (updateProductFaq.fulfilled.match(result)) {
                toast.success('FAQ updated successfully!');
                setEditItem(null);
                dispatch(fetchProductFaq(productId));
            } else {
                toast.error(result.payload || 'Failed to update FAQ');
            }
        } catch (error) {
            console.error('Error updating FAQ:', error);
            toast.error('An unexpected error occurred while updating.');
        }
    };

    const handleAddInputChange = (e) => {
        setAddFormData({ ...addFormData, [e.target.name]: e.target.value });
    };

    const handleAddFaqSubmit = async (e) => {
        e.preventDefault();

        const faqPayload = {
            productId,
            title: addFormData.title,
            description: addFormData.description,
            faqType: addFormData.faqType,
            createdBy,
        };

        const result = await dispatch(addProductFaq(faqPayload));

        if (addProductFaq.fulfilled.match(result)) {
            toast.success('FAQ added successfully!');
            setAddFormData({ title: '', description: '', faqType: '' });
            dispatch(fetchProductFaq(productId));
            setShowAddForm(false);
        } else {
            toast.error(result.payload || 'Failed to add FAQ');
        }
    };

    if (loading) return <p className="text-slate-500">Loading FAQs...</p>;
    if (error) return <p className="text-rose-600">Error: {error}</p>;

    return (
        <div className="mt-4">
            {/* FAQ Table */}
            <div className="p-6 bg-white border border-slate-200 shadow-md rounded-xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-[#062c21]">FAQ</h3>
                    {!editItem && (
                        <button
                            className="px-4 py-2 text-amber-300 bg-[#062c21] rounded hover:bg-[#093d2e] transition font-semibold"
                            onClick={() => setShowAddForm(true)}
                        >
                            Add FAQ
                        </button>
                    )}
                </div>

                {faqProductId && faqProductId.length > 0 ? (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden overflow-x-auto md:block">
                            <table className="min-w-full border border-slate-200 table-auto">
                                <thead className="bg-[#062c21] text-amber-300">
                                    <tr>
                                        <th className="w-40 px-4 py-2 text-center border border-slate-200">Actions</th>
                                        <th className="px-4 py-2 text-center border border-slate-200">Title</th>
                                        <th className="px-4 py-2 text-center border border-slate-200">Description</th>
                                        <th className="px-4 py-2 text-center border border-slate-200">Faq Type</th>
                                        <th className="px-4 py-2 text-center border border-slate-200">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {faqProductId.map((faq) => (
                                        <tr key={faq.id} className="bg-white border-b border-slate-200 hover:bg-emerald-50/60">
                                            <td className="px-4 py-2 border border-slate-200">
                                                <div className="flex gap-2">
                                                     <button
                                                    className="px-3 py-1 text-[#062c21] bg-amber-400 rounded hover:bg-amber-500 font-semibold"
                                                    onClick={() => handleEditClick(faq)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="px-3 py-1 text-white bg-rose-600 rounded hover:bg-rose-700 font-medium"
                                                    onClick={() => handleDeleteClick(faq)}
                                                >
                                                    Delete
                                                </button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 font-medium text-center border border-slate-200">{faq.title}</td>
                                            <td className="px-4 py-2 text-sm text-center border border-slate-200">
                                                <div dangerouslySetInnerHTML={{ __html: faq.description }} />
                                            </td>
                                            <td className="px-4 py-2 text-center border border-slate-200">{faq.faqType}</td>
                                            <td className="px-4 py-2 text-center border border-slate-200">{faq.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="space-y-4 md:hidden">
  {faqProductId.map((faq) => (
    <div key={faq.id} className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase">Title</h4>
          <p className="font-medium text-[#062c21]">{faq.title}</p>
        </div>
        <div className="flex gap-2">
          <button
            className="px-2 py-1 text-xs text-[#062c21] bg-amber-400 rounded hover:bg-amber-500 font-semibold"
            onClick={() => handleEditClick(faq)}
          >
            Edit
          </button>
          <button
            className="px-2 py-1 text-xs text-white bg-rose-600 rounded hover:bg-rose-700 font-medium"
            onClick={() => handleDeleteClick(faq)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mb-3">
        <h4 className="text-xs font-semibold text-slate-500 uppercase">Description</h4>
        <div className="mt-1 text-sm text-slate-600" dangerouslySetInnerHTML={{ __html: faq.description }} />
      </div>

      <div className="flex justify-between">
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase">FAQ Type</h4>
          <p className="text-sm text-slate-700">{faq.faqType}</p>
        </div>
        <div className='mt-2'>
          <span className={`px-2 py-1 text-sm rounded ${faq.status === 'Active' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
            {faq.status}
          </span>
        </div>
      </div>
    </div>
  ))}
</div>
                    </>
                ) : (
                    <p className="text-slate-500">No FAQs found for this product.</p>
                )}
            </div>

            {/* Add FAQ Form */}
            {showAddForm && (
                <div className="w-full p-6 mt-6 mb-6 bg-white border border-slate-200 shadow rounded-xl">
                    <h3 className="mb-4 text-xl font-bold text-[#062c21]">Add New FAQ</h3>
                    <form onSubmit={handleAddFaqSubmit} className="space-y-5">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-[#062c21]">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={addFormData.title}
                                onChange={handleAddInputChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#062c21]"
                                placeholder="Enter FAQ title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-[#062c21]">Description</label>
                            <RichTextEditor
                                value={addFormData.description}
                                onChange={(value) => setAddFormData({ ...addFormData, description: value })}
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-[#062c21]">FAQ Type</label>
                            <div className="flex flex-wrap gap-4">
                                {['Ingredient', 'WithProduct', 'Faq'].map((type) => (
                                    <label key={type} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="faqType"
                                            value={type}
                                            checked={addFormData.faqType === type}
                                            onChange={handleAddInputChange}
                                            className="w-4 h-4 accent-[#062c21]"
                                        />
                                        <span className="ml-2 text-sm text-slate-700">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="px-4 py-2 text-amber-300 bg-[#062c21] rounded hover:bg-[#093d2e] transition font-semibold"
                            >
                                Add FAQ
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 text-[#062c21] bg-slate-200 rounded hover:bg-slate-300 transition font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Edit FAQ Form */}
            {editItem && (
                <div className="p-4 mt-6 space-y-4 border border-slate-200 rounded bg-slate-50">
                    <h3 className="text-xl font-semibold text-[#062c21]">Edit FAQ</h3>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-[#062c21]">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#062c21]"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-[#062c21]">Description</label>
                        <RichTextEditor
                            value={formData.description}
                            onChange={(value) => setFormData({ ...formData, description: value })}
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-[#062c21]">FAQ Type</label>
                        <div className="flex flex-wrap gap-4">
                            {['Ingredient', 'WithProduct', 'Faq'].map((type) => (
                                <label key={type} className="flex items-center">
                                    <input
                                        type="radio"
                                        name="faqType"
                                        value={type}
                                        checked={formData.faqType === type}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 accent-[#062c21]"
                                    />
                                    <span className="ml-2 text-sm text-slate-700">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.status === 'Active'}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        status: e.target.checked ? 'Active' : 'Inactive',
                                    }))
                                }
                                className="w-4 h-4 mr-2 accent-[#062c21] bg-white border-slate-300 rounded"
                            />
                            <span className="text-sm text-[#062c21]">Active</span>
                        </label>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 text-amber-300 bg-[#062c21] rounded hover:bg-[#093d2e] transition font-semibold"
                        >
                            Update
                        </button>
                        <button
                            onClick={() => setEditItem(null)}
                            className="px-4 py-2 text-[#062c21] bg-slate-200 rounded hover:bg-slate-300 transition font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditFaq;