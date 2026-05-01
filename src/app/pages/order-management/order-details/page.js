'use client';

import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { fetchOrderDetails } from '@/app/redux/orderDetailsSlice';
import Image from 'next/image';
import { IMAGE_BASE_URL } from '../../api/auth';
const OrderDetails = () => {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('username');
  const [orderId, setOrderId] = useState(orderIdParam || '');
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.orderDetails);

  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSearch = useCallback(() => {
    if (orderId.trim()) {
      dispatch(fetchOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  useEffect(() => {
    const orderIdFromUrl = searchParams.get('orderId');
    if (orderIdFromUrl) {
      setOrderId(orderIdFromUrl);
      dispatch(fetchOrderDetails(orderIdFromUrl));
    }
  }, [searchParams, dispatch]);

  return (
    <div className={`p-6 ${showModal ? 'overflow-hidden h-screen' : ''} mt-5 mb-6`}>
      <h2 className="mt-5 mb-4 text-xl font-bold text-center">Order Details</h2>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter Order Id"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {data?.length > 0 ? (
        <div className="space-y-8">
          {data.map((order, index) => (
            <div
              key={index}
              className="p-6 border border-gray-200 shadow-md bg-gradient-to-br from-white to-gray-50 rounded-2xl"
            >
              <h3 className="pb-2 mb-6 text-xl font-bold text-gray-800 border-b">
                Order #{order.orderNo}
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-500">S.No.</label>
                  <span className="font-semibold text-gray-800">{index + 1}</span>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-500">User Name</label>
                  <span className="font-semibold text-gray-800">{order.username}</span>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-500">Billing Address</label>
                  <span className="font-semibold text-gray-800">{order.billingAddress}</span>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-500">Seller Name</label>
                  <span className="font-semibold text-gray-800">{order.sellerName}</span>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-500">Seller Address</label>
                  <span className="font-semibold text-gray-800">{order.sellerAddress}</span>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-500">Total Amount</label>
                  <span className="font-semibold text-green-700">₹{order.products[0].totalAmount}</span>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-500">Price</label>
                  <span className="font-semibold text-gray-800">₹{order.products[0].price}</span>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-500">Discount Price</label>
                  <span className="font-semibold text-red-600">₹{order.products[0].discountPrice}</span>
                </div>
                <div className="flex flex-col md:col-span-2 lg:col-span-1">
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${order.status === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : order.status === 'Pending'
                        ? 'bg-yellow-200 text-yellow-700'
                        : 'bg-gray-200 text-gray-700'
                      }`}
                  >
                    {order.status}
                  </span>
                </div>
      
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-500">Image</label>
                  <div
                    className="relative w-24 h-24 mt-1 cursor-pointer"
                    onClick={() => {
                      setSelectedImage(`${IMAGE_BASE_URL}/${order.images}`);
                      setShowModal(true);
                    }}
                  >
                    <Image
                      src={`${IMAGE_BASE_URL}/${order.images}`}
                      alt="Product Image"
                      layout="fill"
                      objectFit="cover"
                      className="border rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No order details found.</p>
      )}

      <div className="flex justify-end mt-4">
        <button className='bg-[green] text-white px-4 py-2 rounded-md' onClick={() => window.history.back()}>
          Go back
        </button>
      </div>

      {showModal && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative w-full max-w-3xl p-4 bg-white rounded-lg shadow-lg">
            <button
              className="absolute text-2xl text-gray-600 top-2 right-2 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <div className="w-full h-[70vh] relative">
              <Image
                src={selectedImage}
                alt="Full Image"
                layout="fill"
                objectFit="contain"
                className="rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const WrappedOrderDetails = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <OrderDetails />
  </Suspense>
);

export default WrappedOrderDetails;
