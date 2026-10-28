'use client'
import { useSelector } from 'react-redux'

const Card = ({ loading, error = null }) => {
  const stats = useSelector((state) => state.dashboard.stats)
  if (loading) return <p>Loading...</p>

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold text-[#062c21]">Dashboard</h2>

      {loading ? (
        <p className="text-center text-slate-500">Loading...</p>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-lg text-center">
            <div className="text-sm text-slate-500">Total Users</div>
            <div className="text-2xl font-bold mt-2 text-[#062c21]">{stats.totalUsers}</div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-lg text-center">
            <div className="text-sm text-slate-500">Today Orders</div>
            <div className="text-2xl font-bold mt-2 text-[#062c21]">{stats.todayOrder}</div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl shadow-lg text-center">
            <div className="text-sm text-amber-700">Pending Orders</div>
            <div className="text-2xl font-bold mt-2 text-[#062c21]">{stats.pendingOrder}</div>
          </div>

          <div className="bg-[#062c21] border border-[#062c21] p-4 rounded-xl shadow-lg text-center">
            <div className="text-sm text-amber-200/80">Today Revenue</div>
            <div className="text-2xl font-bold mt-2 text-amber-300">₹{stats.todayRevenue}</div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-lg text-center">
            <div className="text-sm text-slate-500">Return Orders</div>
            <div className="text-2xl font-bold mt-2 text-[#062c21]">{stats.returnOrder}</div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl shadow-lg text-center">
            <div className="text-sm text-amber-700">Low Stock Products</div>
            <div className="text-2xl font-bold mt-2 text-[#062c21]">{stats.lowProduct}</div>
          </div>

          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl shadow-lg text-center">
            <div className="text-sm text-rose-600">Out of Stock</div>
            <div className="text-2xl font-bold mt-2 text-rose-900">{stats.outOfStock}</div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-lg text-center">
            <div className="text-sm text-slate-500">Total Products</div>
            <div className="text-2xl font-bold mt-2 text-[#062c21]">{stats.totalProduct}</div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-lg text-center">
            <div className="text-sm text-slate-500">Total Orders</div>
            <div className="text-2xl font-bold mt-2 text-[#062c21]">{stats.totalOrder}</div>
          </div>

          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl shadow-lg text-center">
            <div className="text-sm text-rose-600">Cancel Orders</div>
            <div className="text-2xl font-bold mt-2 text-rose-900">{stats.cancelOrder}</div>
          </div>

          <div className="bg-[#062c21] border border-[#062c21] p-4 rounded-xl shadow-lg text-center">
            <div className="text-sm text-amber-200/80">Total Revenue</div>
            <div className="text-2xl font-bold mt-2 text-amber-300">₹{stats.totalRevenue}</div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-lg text-center">
            <div className="text-sm text-slate-500">Last Week Users</div>
            <div className="text-2xl font-bold mt-2 text-[#062c21]">{stats.lastWeekUsers}</div>
          </div>
        </div>
      ) : (
        <p className="text-center text-slate-500">No data available</p>
      )}
    </div>
  )
}

export default Card