
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

    if (loading) return <p className="text-gray-600">Loading FAQs...</p>;
    if (error) return <p className="text-red-600">Error: {error}</p>;

    return (
        <div className="mt-4">
            {/* FAQ Table */}
            <div className="p-6 bg-white shadow-md rounded-xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">FAQ</h3>
                    {!editItem && (
                        <button
                            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
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
                            <table className="min-w-full border border-gray-200 table-auto">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="w-40 px-4 py-2 text-center border">Actions</th>
                                        <th className="px-4 py-2 text-center border">Title</th>
                                        <th className="px-4 py-2 text-center border">Description</th>
                                        <th className="px-4 py-2 text-center border">Faq Type</th>
                                        <th className="px-4 py-2 text-center border">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {faqProductId.map((faq) => (
                                        <tr key={faq.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-4 py-2 border">
                                                <div className="flex gap-2">
                                                     <button
                                                    className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-blue-600"
                                                    onClick={() => handleEditClick(faq)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                                                    onClick={() => handleDeleteClick(faq)}
                                                >
                                                    Delete
                                                </button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 font-medium text-center border">{faq.title}</td>
                                            <td className="px-4 py-2 text-sm text-center border">
                                                <div dangerouslySetInnerHTML={{ __html: faq.description }} />
                                            </td>
                                            <td className="px-4 py-2 text-center border">{faq.faqType}</td>
                                            <td className="px-4 py-2 text-center border">{faq.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="space-y-4 md:hidden">
  {faqProductId.map((faq) => (
    <div key={faq.id} className="p-4 bg-white border rounded-lg shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase">Title</h4>
          <p className="font-medium text-gray-800">{faq.title}</p>
        </div>
        <div className="flex gap-2">
          <button
            className="px-2 py-1 text-xs text-white bg-yellow-500 rounded hover:bg-yellow-600"
            onClick={() => handleEditClick(faq)}
          >
            Edit
          </button>
          <button
            className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
            onClick={() => handleDeleteClick(faq)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mb-3">
        <h4 className="text-xs font-semibold text-gray-500 uppercase">Description</h4>
        <div className="mt-1 text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: faq.description }} />
      </div>

      <div className="flex justify-between">
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase">FAQ Type</h4>
          <p className="text-sm text-gray-700">{faq.faqType}</p>
        </div>
        <div className='mt-2'>
          <span className={`px-2 py-1 text-sm rounded ${faq.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {faq.status}
          </span>
        </div>
      </div>
    </div>
  ))}
</div>
                    </>
                ) : (
                    <p className="text-gray-500">No FAQs found for this product.</p>
                )}
            </div>

            {/* Add FAQ Form */}
            {showAddForm && (
                <div className="w-full p-6 mt-6 mb-6 bg-white border shadow rounded-xl">
                    <h3 className="mb-4 text-xl font-bold">Add New FAQ</h3>
                    <form onSubmit={handleAddFaqSubmit} className="space-y-5">
                        <div>
                            <label className="block mb-1 text-sm font-medium">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={addFormData.title}
                                onChange={handleAddInputChange}
                                className="w-full px-3 py-2 border rounded"
                                placeholder="Enter FAQ title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Description</label>
                            <RichTextEditor
                                value={addFormData.description}
                                onChange={(value) => setAddFormData({ ...addFormData, description: value })}
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">FAQ Type</label>
                            <div className="flex flex-wrap gap-4">
                                {['Ingredient', 'WithProduct', 'Faq'].map((type) => (
                                    <label key={type} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="faqType"
                                            value={type}
                                            checked={addFormData.faqType === type}
                                            onChange={handleAddInputChange}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                            >
                                Add FAQ
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Edit FAQ Form */}
            {editItem && (
                <div className="p-4 mt-6 space-y-4 border rounded bg-gray-50">
                    <h3 className="text-xl font-semibold">Edit FAQ</h3>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Description</label>
                        <RichTextEditor
                            value={formData.description}
                            onChange={(value) => setFormData({ ...formData, description: value })}
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">FAQ Type</label>
                        <div className="flex flex-wrap gap-4">
                            {['Ingredient', 'WithProduct', 'Faq'].map((type) => (
                                <label key={type} className="flex items-center">
                                    <input
                                        type="radio"
                                        name="faqType"
                                        value={type}
                                        checked={formData.faqType === type}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{type}</span>
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
                                className="w-4 h-4 mr-2 text-blue-600 bg-white border-gray-300 rounded"
                            />
                            <span className="text-sm">Active</span>
                        </label>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                        >
                            Update
                        </button>
                        <button
                            onClick={() => setEditItem(null)}
                            className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
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