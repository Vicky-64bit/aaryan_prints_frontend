import React, { useEffect, useState } from 'react';
import OrderDetails from './OrderDetails';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from '../../redux/slice/orderSlice';

const MyOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleBackToOrders = () => {
    setSelectedOrder(null);
  };

  if (selectedOrder) {
    return <OrderDetails
  orderId={selectedOrder._id}
  onBack={handleBackToOrders} // optional back handler
/>
;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-gray-200 p-6 rounded-2xl shadow-sm">
      <div className="mb-4 p-4 sm:p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              onClick={() => handleOrderClick(order)}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex-1 mb-4 sm:mb-0">
                <span className="text-sm font-semibold text-gray-600">
                  Order ID: {order._id}
                </span>
                <div className="mt-1 text-sm text-gray-500">
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p>
                    Status:{' '}
                    <span className="text-green-600 font-medium">
                      {order.paymentStatus || 'Paid'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex -space-x-2">
                  {order.orderItems?.slice(0, 3).map((item) => (
                    <img
                      key={item._id}
                      className="w-12 h-12 rounded-full border-2 border-white object-cover"
                      src={item.image}
                      alt={item.name}
                    />
                  ))}
                  {order.orderItems?.length > 3 && (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 border-2 border-white">
                      +{order.orderItems.length - 3}
                    </div>
                  )}
                </div>
                <div className="text-right font-bold text-lg text-gray-800">
                  ₹{order.totalPrice?.toFixed(2)}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
