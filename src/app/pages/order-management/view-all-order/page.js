'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllOrder } from '@/app/redux/orderSlice'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/order-constant'

const ViewAllOrder = () => {

  const dispatch = useDispatch()
  const {loading, data } = useSelector((state) => state.allOrder?? {});

  useEffect(() => {
      dispatch(fetchAllOrder());
    }, [dispatch]);

  return (
    <div className="p-4 mt-5 mb-6">
      <Table
        columns={Columns}
        data={data}
        title={"All Orders"}
        loading={loading}
      />
    </div>
  )
}

export default ViewAllOrder