import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

// Icon for the confirmation header (mimicking lucide-react)
const CheckCircle = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <path d="M9 11l3 3L22 4"></path>
  </svg>
);

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` } }
        );
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);
 

  // Loading State UI
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
          <span className="text-gray-600 font-medium">Loading order details...</span>
        </div>
      </div>
    </div>
  );

  // Not Found State UI
  if (!order) return (
    <div className="p-10 text-center bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-red-500">Order Not Found</h1>
        <p className="mt-2 text-gray-600">We could not retrieve the details for this order ID.</p>
        <Link to="/" className="mt-4 inline-block text-orange-600 hover:text-orange-700 font-medium transition duration-150">
          Go to Homepage
        </Link>
      </div>
    </div>
  );

   // Calculate pricing components for a detailed breakdown
  const totalItemsPrice = order.orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  // Calculate shipping fee based on the difference (or 0 if total is less than items price, though unlikely in e-commerce)
  const shippingFee = Math.max(0, order.totalPrice - totalItemsPrice);
  const isShippingCharged = shippingFee > 0.01;

  return (
     <div className="min-h-screen bg-gray-50 font-['Inter'] flex items-start justify-center p-4 sm:p-8">
      {/* Confirmation Card - Responsive width and shadow */}
      <div className="w-full max-w-4xl bg-white p-6 sm:p-10 mt-8 mb-8 rounded-3xl shadow-2xl transition-all duration-300">
        
        {/* Header and Confirmation Icon */}
        <div className="text-center mb-10 border-b pb-6">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4 animate-bounce" />
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-500">
            Thank you for your purchase. Your order is being processed.
          </p>
        </div>

        {/* Order Details Grid - Responsive 1 or 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Shipping Details Block - Updated */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Shipping Details</h2>
            
            {/* Order ID remains */}
            <p className="text-gray-600 text-sm sm:text-base">
              <span className="font-medium text-gray-800">Order ID:</span> 
              <span className="ml-2 font-mono text-indigo-600">{order._id}</span>
            </p>

            {/* Replaced Customer/Mobile with Shipping Address */}
            <div className="text-gray-600 text-sm sm:text-base pt-1">
              <span className="font-medium text-gray-800 block mb-1">Shipping Address:</span> 
              <p className="whitespace-pre-wrap leading-relaxed">
                {order.shippingAddress?.address || "Address not available"}
              </p>
              <p className="whitespace-pre-wrap leading-relaxed">
                {order.shippingAddress?.city || "Address not available"}
              </p>
              <p className="whitespace-pre-wrap leading-relaxed">
                {order.shippingAddress?.postalCode || "Address not available"}
              </p>
              <p className="whitespace-pre-wrap leading-relaxed">
                {order.shippingAddress?.country || "Address not available"}
              </p>
            </div>
          </div>

          {/* Total Price Block - Highlighted */}
          <div className="space-y-3 p-4 bg-orange-50 rounded-xl shadow-sm border border-orange-200">
            <h2 className="text-xl font-semibold text-orange-700 border-b pb-2">Order Summary</h2>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-800">Payment Status:</span> 
              <span className="font-bold text-green-600">{order.paymentStatus || "Paid"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-800">Est. Delivery:</span> 
              <span className="text-gray-600">{order.deliveryEstimate || "3-7 Business Days"}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-orange-300">
              <span className="font-extrabold text-lg text-gray-800">Total Paid:</span> 
              <span className="text-3xl font-extrabold text-orange-600">₹{order.totalPrice?.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
       {/* Products Summary Section */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Items Ordered</h2>
        <div className="space-y-4 border border-gray-200 p-4 rounded-xl shadow-inner">
          
          {/* Item List - Updated to include images */}
          {order.orderItems?.map((item) => (
            <div key={item._id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
              
              {/* Product Image and Details */}
              <div className="flex items-center space-x-4">
                <img 
                  src={item?.image} 
                  alt={item.name} 
                  className="w-14 h-14 object-cover rounded-lg flex-shrink-0 border border-gray-200"
                  // Fallback in case placeholder fails
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/60x60/e0e0e0/555555?text=Item"; }} 
                />
                <div className="text-gray-700 font-medium">
                  {item.name}
                  <span className="ml-2 text-sm text-gray-500 font-normal">
                    (Qty: {item.quantity})
                  </span>
                </div>
              </div>
              
              {/* Price */}
              <div className="text-lg font-semibold text-gray-800 mt-1 sm:mt-0">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}

          {/* Pricing breakdown */}
          <div className="pt-4 space-y-2 text-right text-gray-700">
            <div className="flex justify-between">
                <span className="text-sm">Subtotal (Products):</span>
                <span className="font-medium">₹{totalItemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-sm">Shipping & Handling:</span>
                <span className="font-medium text-green-600">
                    {isShippingCharged ? `₹${shippingFee.toFixed(2)}` : 'FREE'}
                </span>
            </div>
            {/* Final Total (Repeating for emphasis) */}
            <div className="flex justify-between text-xl font-bold text-orange-600 border-t-2 border-dashed border-gray-200 pt-3 mt-3">
                <span>TOTAL PAID:</span>
                <span>₹{order.totalPrice?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-10">
          <Link 
            to="/" 
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-full shadow-lg text-white bg-orange-500 hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-[1.02] active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmationPage;
