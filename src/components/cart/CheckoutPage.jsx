import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { createCheckout } from "../../redux/slice/checkoutSlice";
import axios from "axios";
 import { clearCart } from "../../redux/slice/cartSlice";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const bagTotal = cart?.products?.length
    ? cart.products.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  const shippingCharge = bagTotal >= 1000 ? 0 : 100;
  const totalPayableAmount = bagTotal + shippingCharge;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  // MARK CHECKOUT AS PAID
  const handlePaymentSuccess = async (paymentDetails, checkoutIdParam) => {
    const checkoutIdToUse = checkoutIdParam || checkoutId; 
  try {
    // ✅ Mark checkout as paid
    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutIdToUse}/pay`,
      { paymentStatus: "paid", paymentDetails },
      { headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` } }
    );

    // ✅ Finalize checkout → creates order & clears cart
    const { data: finalOrder } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutIdToUse}/finalize`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` } }
    );

    // ✅ Redirect to order confirmation page
    navigate(`/order-confirmation/${finalOrder._id}`);
    dispatch(clearCart());   

  } catch (error) {
    console.error("Payment/finalize error:", error);
  }
};

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    if (!cart?.products?.length) return;

    try {
      const token = localStorage.getItem("usertoken");
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
        {
          checkoutItems: cart.products,
          shippingAddress:{
            ...shippingAddress,
             name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
             mobile: shippingAddress.phone,
          },
          paymentMethod: "Razorpay",
          totalPrice: totalPayableAmount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { checkout, razorpayOrder } = data;
      setCheckoutId(checkout._id);

      if (razorpayOrder) {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: "INR",
          name: "Your Shop",
          order_id: razorpayOrder.id,
          handler: function (response) {
            handlePaymentSuccess(response, checkout._id);
          },
          prefill: {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            contact: shippingAddress.phone,
          },
          theme: { color: "#F97316" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error("Checkout creation error:", error);
    }
  };

  if (loading)
    return <div className="text-center p-10 font-medium">Loading cart...</div>;
  if (error)
    return <div className="text-center p-10 text-red-600 font-medium">Error: {error}</div>;
  if (!cart?.products?.length)
    return (
      <div className="text-center p-10 font-medium">
        Your cart is empty.{" "}
        <Link to="/" className="text-orange-500 hover:underline">
          Continue shopping
        </Link>
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      {/* Left: Shipping & Delivery */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {/* Shipping Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-3">
              SHIPPING ADDRESS
            </h2>
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["firstName","lastName","phone","address","city","postalCode","country"].map(field => (
                <input
                  key={field}
                  type={field==="phone"?"tel":"text"}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={shippingAddress[field]}
                  onChange={handleAddressChange}
                  required
                  className="col-span-1 sm:col-span-2 p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              ))}
            </form>
          </div>

          {/* Delivery Estimates */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-4">DELIVERY ESTIMATES</h2>
            {cart.products.map((item, idx) => (
              <div key={item._id || idx} className="flex items-start space-x-4 border-b border-gray-100 pb-4 mb-4 last:border-none last:pb-0 last:mb-0">
                <div className="w-24 h-32 md:w-28 md:h-36 bg-gray-100 rounded-md overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 font-medium text-sm md:text-base">{item.name}</h3>
                  <p className="mt-1 text-gray-600 text-xs md:text-sm">Qty: {item.quantity}</p>
                  <p className="mt-1 text-gray-800 text-sm font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  <div className="mt-3">
                    <div className="p-3 border-2 border-orange-500 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <input type="radio" name={`delivery_${idx}`} id={`standard_${idx}`} className="text-orange-500 h-4 w-4" defaultChecked/>
                        <label htmlFor={`standard_${idx}`} className="font-medium text-sm">Standard Delivery</label>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 ml-6">Delivery by {deliveryDate.toDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-sm h-fit md:sticky md:top-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary ({cart.products.length} items)</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-gray-700"><span>Bag Total</span><span>₹{bagTotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-700"><span>Shipping Charges*</span><span className="text-green-500">{shippingCharge===0?"FREE":`₹${shippingCharge.toFixed(2)}`}</span></div>
            <hr className="border-gray-200"/>
            <div className="flex justify-between text-lg font-bold text-gray-800"><span>Total Payable Amount</span><span>₹{totalPayableAmount.toFixed(2)}</span></div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">(including tax)</p>
            <button
              onClick={handleCreateCheckout}
              disabled={!cart?.products?.length || !shippingAddress.firstName}
              className="w-full py-3 text-white bg-orange-500 hover:bg-orange-600 rounded-md font-semibold transition-colors duration-200"
            >
              PROCEED TO PAY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
