'use client'

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardData } from '@/app/redux/dashboardSlice'
import { getToken } from '@/app/pages/api/auth'
import Card from '@/app/pages/Dashboard/card/page'
import RecentActivity from '@/app/pages/Dashboard/recent-activity/page'
import { chartData } from '@/app/constants/chartData-constant'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, } from 'recharts'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { loading, stats, transactions, error } = useSelector(
    (state) => state.dashboard,
  )
  const token = getToken()

  useEffect(() => {
    if (token) {
      dispatch(fetchDashboardData())
    }
  }, [token, dispatch])

  return (
    <div className="min-h-screen p-4 mt-6 space-y-4 text-[#062c21] bg-[#faf9f6] md:p-6 md:space-y-6">
      <div className="w-full mt-4 overflow-hidden bg-white border border-slate-200 shadow-lg md:mt-6 rounded-xl">
        <Card stats={stats} loading={loading} error={error} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="md:col-span-1">
          <StatCard />
        </div>

        <div className="p-4 bg-white border border-slate-200 shadow-lg rounded-xl md:col-span-2">
          <h2 className="mb-2 text-lg font-semibold text-[#062c21]">Orders</h2>
          <div className="h-[200px] position-relative z-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#062c21"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="p-4 bg-white border border-slate-200 shadow-lg rounded-xl">
          <MiniChartCard
            title="Total Order Completed"
            value={stats?.totalOrder ?? 0}
            data={chartData}
          />
        </div>

        <div className="p-4 bg-rose-50 border border-rose-200 shadow-lg rounded-xl">
          <MiniChartCard
            title="Total Order Returns"
            value={stats?.returnOrder ?? 0}
            data={chartData}
            stroke="#e11d48"
          />
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 shadow-lg rounded-xl">
          <h2 className="mb-2 text-lg font-semibold text-[#062c21]">Inventory Alert</h2>
          <ul className="pl-5 space-y-1 text-sm list-disc text-slate-700">
            <li>
              Low-Stock Products:{' '}
              <span className="font-semibold text-[#062c21]">{stats?.lowProduct ?? 0}</span>
            </li>
            <li>
              Out of Stock Products:{' '}
              <span className="font-semibold text-[#062c21]">{stats?.outOfStock ?? 0}</span>
            </li>
            <li>
              Last Week Users:{' '}
              <span className="font-semibold text-[#062c21]">{stats?.lastWeekUsers ?? 0}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Recent Activity - Full width always */}
      <div className="w-full mt-4 bg-white border border-slate-200 shadow-lg md:mt-6 rounded-xl">
        <RecentActivity transactions={transactions} loading={loading} />
      </div>
    </div>
  )
}


function Cards({ title, value }) {
  return (
    <div className="p-3 bg-white border border-slate-200 shadow-lg md:p-4 rounded-xl">
      <p className="mb-1 text-sm text-slate-500">{title}</p>
      <p className="text-lg font-bold md:text-xl text-[#062c21]">{value}</p>
    </div>
  )
}

function StatCard() {
  const stats = useSelector((state) => state.dashboard.stats)

  if (!stats) {
    return <div className="p-4 bg-white border border-slate-200 shadow-lg rounded-xl">Loading...</div>
  }

  return (
    <div className="h-full p-3 bg-white border border-slate-200 shadow-lg md:p-4 rounded-xl">
      <h2 className="mb-2 text-base font-semibold md:text-lg text-[#062c21]">Order Stats</h2>
      <div className="space-y-1 md:space-y-2">
        <p className="text-xs md:text-sm">
          Total Order Completed: <span className="font-semibold text-[#062c21]">{stats.totalOrder}</span>
        </p>
        <p className="text-xs md:text-sm">
          Total Users: <span className="font-semibold text-[#062c21]">{stats.totalUsers}</span>
        </p>
        <p className="text-xs md:text-sm">
          Total Order Returns: <span className="font-semibold text-[#062c21]">{stats.returnOrder}</span>
        </p>
        <p className="text-xs md:text-sm">
          Total Revenue: <span className="font-semibold text-[#062c21]">{stats.totalRevenue}</span>
        </p>
        <p className="text-xs md:text-sm">
          Total Products: <span className="font-semibold text-[#062c21]">{stats.totalProduct}</span>
        </p>
      </div>
    </div>
  )
}

function MiniChartCard({ title, value, data, stroke = "#062c21" }) {
  return (
    <div className="h-full p-3 bg-white border border-slate-200 shadow-lg md:p-4 rounded-xl">
      <p className="text-xs text-slate-500 md:text-sm">{title}</p>
      <p className="text-base font-bold md:text-lg text-[#062c21]">{value}</p>
      <div className="w-full h-10 mt-2 md:h-12">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={stroke}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Dashboard