'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Columns } from '@/app/constants/returnAcceptedOrder-constant';
import SuccessOrderTable from '@/app/common/successOrderTable';
import { fetchReturnAccepted, updateReturnAccepted } from '@/app/redux/returnAcceptedSlice';

const ReturnAccepted = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.allOrder ?? {});
  const [showOrdeClosedPopup, setShowOrderClosedPopup] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [selectedOrderNumbers, setSelectedOrderNumbers] = useState([]);

  useEffect(() => {
    dispatch(fetchReturnAccepted());
  }, [dispatch]);

  const handleShipConfirm = async () => {
    if (selectedOrderIds.length === 0) {
      alert('Please select at least one order to close.');
      return;
    }

    const payload = {
      orderIds: selectedOrderIds,
      status: 'Return Order Completed',
    };

    try {
      await dispatch(updateReturnAccepted(payload)).unwrap();
      setShowOrderClosedPopup(false);
      setSelectedOrderIds([]);
      setSelectedOrderNumbers([]);
      dispatch(fetchReturnAccepted());
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  return (
    <div className='mt-10 mb-6'>
      <div className="flex justify-center px-4 mt-6 md:justify-end">
        <button
          onClick={() => {
            if (selectedOrderIds.length === 0) {
              alert('Please select at least one order to close.');
              return;
            }
            setShowOrderClosedPopup(true);
          }}
          className="px-4 py-2 mt-6 text-white bg-blue-600 rounded md:w-auto"
        >
          Close Order
        </button>
      </div>

      {/* Orders Table */}
      <div className="p-4">
        <SuccessOrderTable
          columns={Columns}
          data={data}
          title="Return Accepted"
          onSelectionChange={(selectedRows) => {
            const orderIds = selectedRows.map((row) => row.orderId); 
            const orderNos = selectedRows.map((row) => row.orderNo); 
            setSelectedOrderIds(orderIds);
            setSelectedOrderNumbers(orderNos);
          }}
        />

        {/* Popup */}
        {showOrdeClosedPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-lg font-semibold">
                Are you sure you want to change status to <b>Order Closed</b> for the following orders?
              </h2>
              <ul className="mb-4 text-sm text-gray-700 list-disc list-inside">
                {selectedOrderNumbers.map((orderNo, idx) => (
                  <li key={idx}>Order No: <b>{orderNo}</b></li>
                ))}
              </ul>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowOrderClosedPopup(false)}
                  className="px-4 py-2 text-white bg-gray-400 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShipConfirm}
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

export default ReturnAccepted;