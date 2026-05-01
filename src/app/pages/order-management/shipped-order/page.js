
'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Columns } from '@/app/constants/shippedOrder-constant';
import SuccessOrderTable from '@/app/common/successOrderTable';
import { fetchShippedOrder, updateShippingOrder } from '@/app/redux/shippedOrderSlice';

const ShippingOrder = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.allOrder ?? {});
  const [showShipPopup, setShowShipPopup] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [selectedOrderNumbers, setSelectedOrderNumbers] = useState([]);
  const [arrivedTo, setArrivedTo] = useState('');

  useEffect(() => {
    dispatch(fetchShippedOrder());
  }, [dispatch]);

  const handleShipConfirm = async () => {
    if (selectedOrderIds.length === 0) {
      alert('Please select at least one order to ship.');
      return;
    }

    if (!arrivedTo.trim()) {
      alert('Please enter Arrival To information.');
      return;
    }

    const payload = {
      orderIds: selectedOrderIds,
      arrivedTo: arrivedTo.trim(),
      status: 'ArrivedTo',
    };

    try {
      await dispatch(updateShippingOrder(payload)).unwrap();
      setShowShipPopup(false);
      setSelectedOrderIds([]);
      setSelectedOrderNumbers([]);
      setArrivedTo('');
      dispatch(fetchShippedOrder());
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  return (
    <div className='mt-10 mb-6'>
      {/* Top Arrival Button and Input */}
      <div className="flex flex-col items-center gap-4 px-4 mt-20">
        <div className="max-w-2xl w-80">
          <input
            type="text"
            placeholder="Arrived To"
            value={arrivedTo}
            onChange={(e) => setArrivedTo(e.target.value)}
            className="w-full px-4 py-3 text-lg border rounded"
          />
        </div>
        <button
          onClick={() => {
            if (selectedOrderIds.length === 0) {
              alert('Please select at least one order to ship.');
              return;
            }
            if (!arrivedTo.trim()) {
              alert('Please enter Arrival To information.');
              return;
            }
            setShowShipPopup(true);
          }}
          className="px-6 py-3 text-lg text-white bg-blue-600 rounded"
        >
          Arrival
        </button>
      </div>

      {/* Orders Table */}
      <div className="p-4">
        <SuccessOrderTable
          columns={Columns}
          data={data}
          title="Shipped Orders"
          onSelectionChange={(selectedRows) => {
            const orderIds = selectedRows.map((row) => row.orderId);
            const orderNos = selectedRows.map((row) => row.orderNo);
            setSelectedOrderIds(orderIds);
            setSelectedOrderNumbers(orderNos);
          }}
        />

        {/* Popup */}
        {showShipPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="max-w-md p-6 bg-white rounded-lg shadow-md w-[85%] sm:w-auto">
              <h2 className="mb-4 text-lg font-semibold">
                Are you sure you want to change status to <b>Arrival Successfull</b> for the following orders?
              </h2>
              <div className="mb-2">
                <p className="text-sm font-medium">Arrival To: <b>{arrivedTo}</b></p>
              </div>
              <ul className="mb-4 text-sm text-gray-700 list-disc list-inside">
                {selectedOrderNumbers.map((orderNo, idx) => (
                  <li key={idx}>Order No: <b>{orderNo}</b></li>
                ))}
              </ul>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowShipPopup(false)}
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

export default ShippingOrder;