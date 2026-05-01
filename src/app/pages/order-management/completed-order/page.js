'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/completedOrder-constant'
import { fetchCompletedOrder } from '@/app/redux/completedOrderSlice'

const CompletedOrder = () => {

  const dispatch = useDispatch()
  const { loading, data } = useSelector((state) => state.allOrder ?? {});

  useEffect(() => {
    dispatch(fetchCompletedOrder());
  }, [dispatch]);

  return (
    <div className="p-4 mt-5 mb-6">
      <Table
        columns={Columns}
        data={data}
        loading={loading}
        title={"Completed Orders"}
      />
    </div>
  )
}

export default CompletedOrder