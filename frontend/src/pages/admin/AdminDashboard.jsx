import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../store/slices/adminSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, isLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAdminStats());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      icon: '👥',
      color: 'bg-blue-500',
      link: '/admin/users'
    },
    {
      title: 'Total Vendors',
      value: stats.totalVendors || 0,
      icon: '🏪',
      color: 'bg-green-500',
      link: '/admin/vendors'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts || 0,
      icon: '📦',
      color: 'bg-purple-500',
      link: '/admin/products'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders || 0,
      icon: '📋',
      color: 'bg-yellow-500',
      link: '/admin/orders'
    },
    {
      title: 'Total Revenue',
      value: `$${(stats.totalRevenue || 0).toFixed(2)}`,
      icon: '💰',
      color: 'bg-red-500',
      link: '/admin/orders'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders || 0,
      icon: '⏳',
      color: 'bg-orange-500',
      link: '/admin/orders'
    }
  ];

  const recentActivities = [
    { type: 'user', message: 'New user registered', time: '2 hours ago' },
    { type: 'vendor', message: 'Vendor application approved', time: '4 hours ago' },
    { type: 'order', message: 'New order placed', time: '6 hours ago' },
    { type: 'product', message: 'Product added by vendor', time: '8 hours ago' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the admin panel. Here's an overview of your platform.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3 text-white text-2xl mr-4`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'vendor' ? 'bg-green-100 text-green-600' :
                  activity.type === 'order' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {activity.type === 'user' ? '👤' :
                   activity.type === 'vendor' ? '🏪' :
                   activity.type === 'order' ? '📋' : '📦'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Health</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <span className="text-sm font-medium text-gray-700">Active Users</span>
              <span className="text-lg font-semibold text-green-600">
                {stats.activeUsers || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <span className="text-sm font-medium text-gray-700">Active Vendors</span>
              <span className="text-lg font-semibold text-green-600">
                {stats.activeVendors || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <span className="text-sm font-medium text-gray-700">Products in Stock</span>
              <span className="text-lg font-semibold text-blue-600">
                {stats.productsInStock || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <span className="text-sm font-medium text-gray-700">Orders Today</span>
              <span className="text-lg font-semibold text-purple-600">
                {stats.ordersToday || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/admin/users"
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-3xl mb-2">👥</div>
            <p className="font-medium text-gray-900">Manage Users</p>
          </Link>
          
          <Link
            to="/admin/vendors"
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-3xl mb-2">🏪</div>
            <p className="font-medium text-gray-900">Manage Vendors</p>
          </Link>
          
          <Link
            to="/admin/products"
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-3xl mb-2">📦</div>
            <p className="font-medium text-gray-900">Manage Products</p>
          </Link>
          
          <Link
            to="/admin/orders"
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-3xl mb-2">📋</div>
            <p className="font-medium text-gray-900">View Orders</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;