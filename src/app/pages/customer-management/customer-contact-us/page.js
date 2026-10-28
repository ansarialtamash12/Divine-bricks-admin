'use client'
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerContactUs } from '@/app/redux/customerOrderSlice';
import Table from '@/app/common/datatable';
import { columns } from '@/app/constants/customerOrder-constant';

const CustomerContactUs = () => {
  const dispatch = useDispatch();
  const { contactList, loading, error } = useSelector((state) => state.customerOrder);

  useEffect(() => {
    dispatch(fetchCustomerContactUs());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full mt-5 mb-6">
        <h1 className="text-3xl font-semibold text-slate-500">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full mt-5 mb-6">
        <h1 className="text-3xl font-semibold text-rose-600">Error: {error}</h1>
      </div>
    );
  }

  return (
    <div className="p-4 mt-5 mb-6">
      <div className='flex'>
        <div className='w-full text-center'>
        </div>
      </div>
      
      <Table 
        columns={columns} 
        data={contactList} 
        loading={loading} 
        title="Contact Messages"
        emptyMessage="No contact messages found"
      />
    </div>
  );
};

export default CustomerContactUs;