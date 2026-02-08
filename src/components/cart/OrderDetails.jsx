import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetails } from "../../redux/slice/orderSlice";
import { useNavigate } from "react-router-dom";

const OrderDetails = ({ orderId, onBack }) => {
  // const [order, setOrder] = useState(null);
  // const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);
  useEffect(() => {
    dispatch(fetchOrderDetails(orderId));
  }, [dispatch, orderId]);

  // ✅ Fetch order details when orderId changes
  //  useEffect(() => {
  //   if (!orderId) return;

  //   const fetchOrder = async () => {
  //     try {
  //       const { data } = await axios.get(
  //         `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
  //           },
  //         }
  //       );
  //       setOrder(data);
  //     } catch (error) {
  //       console.error("Error fetching order:", error);
  //       toast.error("Failed to load order details.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchOrder();
  // }, [orderId]);

  // // ✅ Cancel Order
  // const handleCancel = async () => {
  //   try {
  //     const { data } = await axios.put(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/cancel`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
  //         },
  //       }
  //     );
  //     setOrder(data);
  //     toast.success("Order has been cancelled successfully.");
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to cancel order.");
  //   }
  // };

  // // ✅ Return Order
  // const handleReturn = async () => {
  //   try {
  //     const { data } = await axios.put(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/return`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
  //         },
  //       }
  //     );
  //     setOrder(data);
  //     toast.success("Return request placed successfully.");
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to request return.");
  //   }
  // };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-gray-500 animate-pulse">Loading order details...</p>
      </div>
    );

  if (!orderDetails)
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <p className="text-red-500 font-medium">Order not found.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 text-white bg-gray-800 rounded-md hover:bg-gray-700"
        >
          Go Back
        </button>
      </div>
    );

  const isCancellable =
    orderDetails.status === "Processing" || orderDetails.status === "Shipped";
  const isReturnable = orderDetails.status === "Delivered";

  return (
    <div className="max-w-4xl mx-auto mb-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
      </div>

      {/* Order Info */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-700">
            Order ID: <span className="text-gray-900">{orderDetails._id}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-gray-600">Order Date</p>
              <p className="text-gray-800">
                {new Date(orderDetails.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-600">Status</p>
              <p
                className={`font-medium ${
                  orderDetails.status === "Delivered"
                    ? "text-green-600"
                    : orderDetails.status === "Cancelled"
                    ? "text-red-600"
                    : "text-orange-600"
                }`}
              >
                {orderDetails.status}
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-600">Total</p>
              <p className="text-gray-800">
                ₹{orderDetails.totalPrice.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-600">Payment</p>
              <p className="text-gray-800">{orderDetails.paymentMethod}</p>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-700">
            Shipping Address
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {orderDetails.shippingAddress?.address}, <br/>
            {orderDetails.shippingAddress?.city} <br />
            {orderDetails.shippingAddress?.postalCode}  <br/>
            {orderDetails.shippingAddress?.country} <br />
          </p>
        </div>

        {/* Products */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-700">
            Products in Order
          </h3>
          <div className="space-y-4">
            {orderDetails.orderItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center space-x-4 border-b pb-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-24 rounded-md object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm text-gray-800 mt-1">
                    ₹{item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex justify-end space-x-4">
        {isCancellable && (
          <button className="py-2 px-4 border border-red-500 text-red-500 rounded-md font-medium hover:bg-red-50 transition-colors">
            Cancel Order
          </button>
        )}
        {isReturnable && (
          <button className="py-2 px-4 border border-orange-500 text-orange-500 rounded-md font-medium hover:bg-orange-50 transition-colors">
            Return Order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
