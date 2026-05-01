'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Columns } from '@/app/constants/arrivalOrder-constant';
import SuccessOrderTable from '@/app/common/successOrderTable';
import { fetchArrivalOrder ,updateArrivalOrder } from '@/app/redux/arrivalOrderSlice';

const ArrivalOrder = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.ArrivalOrder);
  const [showArrivalPopup, setShowArrivalPopup] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [selectedOrderNumbers, setSelectedOrderNumbers] = useState([]);
  const [arrivedTo, setArrivedTo] = useState('');

  useEffect(() => {
    dispatch(fetchArrivalOrder());
  }, [dispatch]);

  const handleArrivalConfirm = async () => {
    if (selectedOrderIds.length === 0) {
      alert('Please select at least one order.');
      return;
    }

    const payload = {
      orderIds: selectedOrderIds,
      status: 'Delivery Successfull',
    };

    try {
      await dispatch(updateArrivalOrder(payload)).unwrap();
      setShowArrivalPopup(false);
      setSelectedOrderIds([]);
      setSelectedOrderNumbers([]);
      setArrivedTo('');
      dispatch(fetchArrivalOrder());
    } catch (error) {
      console.error('API Error:', error);
      alert(`Failed to update orders: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full mt-5 mb-6">
        <h1 className="text-3xl font-semibold text-gray-700">Loading arrival orders...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full mt-5 mb-6">
        <h1 className="text-3xl font-semibold text-red-500">Error: {error}</h1>
      </div>
    );
  }

  return (
    <div className='mt-10 mb-6'>
      
      <div className="flex flex-col items-center px-4 mt-6 md:flex-row md:justify-between">
        <div className="w-full mb-4 md:w-auto md:mb-0 md:flex-1"></div>
        
        <div className="flex items-center justify-center w-full mb-4 md:w-auto md:mb-0">
           <button
          onClick={() => {
            if (selectedOrderIds.length === 0) {
              alert('Please select at least one order to ship.');
              return;
            }
            setShowArrivalPopup(true);
          }}
          className="px-4 py-2 mt-6 text-white bg-blue-600 rounded md:w-auto"
        >
          Deliver
        </button>
        </div>
        
        <div className="w-full md:w-auto md:flex-1"></div> 
      </div>

      {/* Orders Table */}
      <div className="p-4">
        <SuccessOrderTable
          columns={Columns}
          data={data}
          title="Arrival Orders"
          onSelectionChange={(selectedRows) => {
            const orderIds = selectedRows.map((row) => row.orderId); 
            const orderNos = selectedRows.map((row) => row.orderNo); 
            setSelectedOrderIds(orderIds);
            setSelectedOrderNumbers(orderNos);
          }}
        />

        {/* Popup */}
        {showArrivalPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="max-w-md p-6 bg-white rounded-lg shadow-md w-[85%] sm:w-auto">
              <h2 className="mb-4 text-lg font-semibold">
                 Are you sure you want to change status to <b>Delivery Successfull</b> for the following orders?
              </h2>
              <ul className="mb-4 text-sm text-gray-700 list-disc list-inside">
                {selectedOrderNumbers.map((orderNo, idx) => (
                  <li key={idx}>Order No: <b>{orderNo}</b></li>
                ))}
              </ul>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowArrivalPopup(false)}
                  className="px-4 py-2 text-white bg-gray-400 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleArrivalConfirm}
                  className="px-4 py-2 text-white bg-blue-600 rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArrivalOrder;