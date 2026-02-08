import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slice/authSlice";
import {mergeCart} from "../redux/slice/cartSlice";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {user, guestId} = useSelector((state)=> state.auth);
  const {cart} = useSelector((state)=> state.cart);

  //Get redirect parameter and check if it's checkout o something
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(()=>{
    if(user){
      if(cart?.products.length > 0 && guestId){
        dispatch(mergeCart({guestId, user})).then(() => {
          navigate(isCheckoutRedirect ? "/checkout": "/");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout": "/");
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  const { loading } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate("/profile");
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 relative">
      {/* Background */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-no-repeat opacity-60"
        style={{ backgroundImage: 'url("https://pagedone.io/asset/uploads/1702362010.png")' }}
      ></div>

      {/* Login Card */}
      <div className="relative w-full max-w-sm mx-auto p-8 bg-white rounded-2xl shadow-lg z-10">
        {/* Discount Box */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-4/5 bg-orange-500 text-white text-xs font-semibold rounded-lg p-2 text-center shadow-lg">
          <p className="text-sm">Enjoy an Extra 10% Off on Your 1st Order!</p>
          <p className="mt-1">Web: Minimum ₹1599 purchase (Code: PTWELCOME10)</p>
          <p>App: No minimum purchase (Code: APPONLY)</p>
        </div>

        {/* Header */}
        <div className="text-center mt-12 mb-8">
          <h2 className="text-xl font-light italic text-gray-700">Login/Register</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            required
          />

          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 mt-4">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
          >
            {loading ? "Logging in..." : "LOGIN"}

          </button>
        </form>
                <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to={`/register?redirect=${encodeURIComponent(redirect)}`} // Passes the current redirect parameter
            className="font-medium text-orange-600 hover:text-orange-500 transition duration-150 ease-in-out"
          >
             Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
