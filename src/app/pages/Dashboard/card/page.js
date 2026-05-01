'use client'
import { useSelector } from 'react-redux'

const Card = ({ loading, error = null }) => {
  const stats = useSelector((state) => state.dashboard.stats)
  if (loading) return <p>Loading...</p>

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold text-black">Dashboard</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-xl shadow-lg text-center">
            <div className="text-sm text-gray-500">Total Users</div>
            <div className="text-2xl font-bold mt-2">{stats.totalUsers}</div>
          </div>

          <div className="bg-green-50 p-4 rounded-xl shadow-lg text-center">
            <div className="text-sm text-gray-500">Today Orders</div>
            <div className="text-2xl font-bold mt-2">{stats.todayOrder}</div>
          </div>

          <div className="bg-orange-50 p-4 rounded-xl shadow-lg text-center">
            <div className="text-sm text-gray-500">Pending Orders</div>
            <div className="text-2xl font-bold mt-2">{stats.pendingOrder}</div>
          </div>

          <div className="bg-teal-50 p-4 rounded-xl shadow-lg text-center">
            <div className="text-sm text-gray-500">Today Revenue</div>
            <div className="text-2xl font-bold mt-2">₹{stats.todayRevenue}</div>
          </div>

          <div className="bg-red-50 p-4 rounded-xl shadow-lg text-center">
            <div className="text-sm text-gray-500">Return Orders</div>
            <div className="text-2xl font-bold mt-2">{stats.returnOrder}</div>
          </div>

          <div className="bg-purple-50 p-4 rounded-xl shadow-lg text-center">
            <div className="text-sm text-gray-500">Low Stock Products</div>
            <div className="text-2xl font-bold mt-2">{stats.lowProduct}</div>
          </div>

          <div className="bg-gray-100 p-4 rounded-xl shadow-lg text-center">
            <div className="text-sm text-gray-500">Out of Stock</div>
            <div className="text-2xl font-bold mt-2">{stats.outOfStock}</div>
          </div>

 
          <div className="bg-indigo-50 p-4 rounded-xl shadow-lg text-center">
            <div className="text-sm text-gray-500">Total Products</div>
            <div className="text-2xl font-bold mt-2">{stats.totalProduct}</div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-xl shadow-lg text-center">
            <div className="text-sm text-gray-500">Total Orders</div>
            <div className="text-2xl font-bold mt-2">{stats.totalOrder}</div>
          </div>

          <div className="bg-pink-50 p-4 rounded-xl shadow-lg text-center">
            <div className="text-sm text-gray-500">Cancel Orders</div>
            <div className="text-2xl font-bold mt-2">{stats.cancelOrder}</div>
          </div>

          <div className="bg-lime-50 p-4 rounded-xl shadow-lg text-center">
            <div className="text-sm text-gray-500">Total Revenue</div>
            <div className="text-2xl font-bold mt-2">₹{stats.totalRevenue}</div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl shadow-lg text-center">
            <div className="text-sm text-gray-500">Last Week Users</div>
            <div className="text-2xl font-bold mt-2">{stats.lastWeekUsers}</div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No data available</p>
      )}
    </div>
  )
}

export default Card