'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/orderClosed-constant'
import { fetchReturnClosedOrder } from '@/app/redux/orderClosedSlice'

const ReturnClosed = () => {

  const dispatch = useDispatch()
  const {loading, data } = useSelector((state) => state.allOrder?? {});
  

  useEffect(() => {
      dispatch(fetchReturnClosedOrder());
    }, [dispatch]);

  return (
    <div className="p-4 mt-5 mb-6">
      <Table
        columns={Columns}
        data={data}
        title={"Orders Closed "}
        loading={loading}
      />
    </div>
  )
}

export default ReturnClosed