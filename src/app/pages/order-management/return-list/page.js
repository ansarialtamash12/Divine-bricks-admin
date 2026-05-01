'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Columns } from '@/app/constants/returnList-constant';
import SuccessOrderTable from '@/app/common/successOrderTable';
import { fetchReturnOrder, updateReturnOrder } from '@/app/redux/returnListSlice';

const ReturnList = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.allOrder ?? {});
  const [showReturnAcceptedPopup, setShowReturnAcceptedPopup] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [selectedOrderNumbers, setSelectedOrderNumbers] = useState([]);

  useEffect(() => {
    dispatch(fetchReturnOrder());
  }, [dispatch]);

  const handleReturnAccptedConfirm = async () => {
    if (selectedOrderIds.length === 0) {
      alert('Please select at least one order to Accept.');
      return;
    }

    const payload = {
      orderIds: selectedOrderIds,
      status: 'Return order Accepted',
    };

    try {
      await dispatch(updateReturnOrder(payload)).unwrap();
      setShowReturnAcceptedPopup(false);
      setSelectedOrderIds([]);
      setSelectedOrderNumbers([]);
      dispatch(fetchReturnOrder());
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  return (
    <div className='mt-5 mb-6'>
      <div className="flex justify-center px-4 mt-6 md:justify-end">
        <button
          onClick={() => {
            if (selectedOrderIds.length === 0) {
              alert('Please select at least one order to accepted.');
              return;
            }
            setShowReturnAcceptedPopup(true);
          }}
          className="px-4 py-2 mt-6 text-white bg-blue-600 rounded md:w-auto"
        >
          Return Accepted
        </button>
      </div>

      {/* Orders Table */}
      <div className="p-4">
        <SuccessOrderTable
          columns={Columns}
          data={data}
          title="Return Order"
          onSelectionChange={(selectedRows) => {
            const orderIds = selectedRows.map((row) => row.orderId); // For API
            const orderNos = selectedRows.map((row) => row.orderNo); // For display
            setSelectedOrderIds(orderIds);
            setSelectedOrderNumbers(orderNos);
          }}
        />

        {/* Popup */}
        {showReturnAcceptedPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-[85%] sm:w-auto">
              <h2 className="mb-4 text-lg font-semibold">
                Are you sure you want to change status to <b>Return order Accepted</b> for the following orders?
              </h2>
              <ul className="mb-4 text-sm text-gray-700 list-disc list-inside">
                {selectedOrderNumbers.map((orderNo, idx) => (
                  <li key={idx}>Order No: <b>{orderNo}</b></li>
                ))}
              </ul>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowReturnAcceptedPopup(false)}
                  className="px-4 py-2 text-white bg-gray-400 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReturnAccptedConfirm}
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

export default ReturnList;