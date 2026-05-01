'use client'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPaymentList } from '@/app/redux/paymentListSlice'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/paymentList-constant'

const PaymentList = () => {

    const dispatch = useDispatch()
    const {loading, data } = useSelector((state) => state.paymentList ?? {});

    useEffect(() => {
        dispatch(fetchPaymentList());
    }, [dispatch])

    return (
        <div className="p-4 mt-5 mb-6">
            <div className='flex'>
                <div className='w-full text-center'>
                    
                    {/* Render table with order data */}
                </div>
            </div>
            <Table
                columns={Columns}
                data={data}
                loading={loading} 
                isUserNameClickable={true}
                title={"All Payment List"}
                />
        </div>
    )
}

export default PaymentList  