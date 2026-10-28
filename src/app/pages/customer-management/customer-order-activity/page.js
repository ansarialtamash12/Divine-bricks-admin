'use client'
import React, {Suspense, useEffect, useState, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerOrders } from '@/app/redux/customerOrderSlice';
import Table from '@/app/common/datatable';
import { Columns } from '@/app/constants/customerOrder-constant';
import { useSearchParams } from 'next/navigation';

const CustomerOrderPage = () => {
  const searchParams = useSearchParams();
  const usernameParam = searchParams.get('username');
  const [username, setUsername] = useState(usernameParam || '');
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.customerOrder); // Fixed state access

  const handleSearch = useCallback(() => {
    if (username.trim()) {
      dispatch(fetchCustomerOrders(username));
    }
  },[dispatch,username]);
  
  useEffect(() => {
    const usernameFromUrl = searchParams.get('username');
    if (usernameFromUrl) {
      setUsername(usernameFromUrl);
      dispatch(fetchCustomerOrders(usernameFromUrl));
    }
  }, [searchParams, dispatch]);
  

 return (
    <div className="p-4 mt-10 mb-6">
      <h2 className="mb-2 text-lg font-bold text-center text-[#062c21]">Customer Username</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#062c21]"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 text-amber-300 bg-[#062c21] rounded hover:bg-[#093d2e] transition font-semibold"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-rose-600">{error}</p>}
      
      {data?.length > 0 ? (
        <Table columns={Columns} data={data}/>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

const WrappedCustomerOrderPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <CustomerOrderPage />
  </Suspense>
);

export default WrappedCustomerOrderPage;