'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/cancelledOrder-constant'
import { fetchCancelledOrder } from '@/app/redux/cancelledOrderSlice'

const CancelledOrder = () => {

  const dispatch = useDispatch()
  const {loading, data } = useSelector((state) => state.allOrder ?? {});

  useEffect(() => {
    dispatch(fetchCancelledOrder());
  }, [dispatch]);

  return (
    <div className="p-4 mt-5 mb-6">
      <Table
        columns={Columns}
        data={data}
        loading={loading}
        title={"Cancelled Orders"}
      />
    </div>
  )
}

export default CancelledOrder