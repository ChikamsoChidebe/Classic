import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVendorOrders, updateOrderStatus } from '../../store/slices/vendorSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';

const VendorOrders = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.vendor);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    const params = statusFilter !== 'all' ? { status: statusFilter } : {};
    dispatch(getVendorOrders(params));
  }, [dispatch, statusFilter]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    await dispatch(updateOrderStatus({ orderId, status: newStatus }));
    setUpdatingStatus(null);
    // Refresh orders
    const params = statusFilter !== 'all' ? { status: statusFilter } : {};
    dispatch(getVendorOrders(params));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'pending':
        return 'processing';
      case 'processing':
        return 'shipped';
      case 'shipped':
        return 'delivered';
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'processing':
        return 'Mark as Processing';
      case 'shipped':
        return 'Mark as Shipped';
      case 'delivered':
        return 'Mark as Delivered';
      default:
        return 'Update Status';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No orders found</h2>
          <p className="text-gray-600">
            {statusFilter === 'all' 
              ? "You haven't received any orders yet." 
              : `No ${statusFilter} orders found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order._id.slice(-8)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Customer: {order.user?.name || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <p className="text-lg font-semibold text-gray-900 mt-2">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t pt-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-3">Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img
                          src={item.product?.images?.[0] || 'https://via.placeholder.com/60'}
                          alt={item.product?.name || 'Product'}
                          className="w-15 h-15 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{item.product?.name || 'Product'}</h5>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                          {item.size && (
                            <p className="text-sm text-gray-500">Size: {item.size}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            ${(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="border-t pt-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                  <div className="text-sm text-gray-600">
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Actions */}
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <div className="border-t pt-4 flex justify-end space-x-3">
                    {getNextStatus(order.status) && (
                      <Button
                        onClick={() => handleStatusUpdate(order._id, getNextStatus(order.status))}
                        loading={updatingStatus === order._id}
                        size="sm"
                      >
                        {getStatusLabel(getNextStatus(order.status))}
                      </Button>
                    )}
                    
                    {order.status === 'pending' && (
                      <Button
                        onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                        loading={updatingStatus === order._id}
                        variant="danger"
                        size="sm"
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorOrders;