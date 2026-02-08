import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slice/authSlice";
import { mergeCart } from "../redux/slice/cartSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, guestId, loading } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const {
    firstName,
    lastName,
    gender,
    mobile,
    email,
    password,
    confirmPassword,
  } = formData;

  useEffect(() => {
    if (user) {
      if (cart?.products?.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : redirect);
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : redirect);
      }
    }
  }, [user, guestId, cart, navigate, dispatch, redirect, isCheckoutRedirect]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await dispatch(
        registerUser({
          firstName,
          lastName,
          gender,
          mobile,
          email,
          password,
        })
      ).unwrap();
    } catch (error) {
      alert(error?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 relative">
      {/* Background */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-no-repeat opacity-60"
        style={{
          backgroundImage:
            'url("https://pagedone.io/asset/uploads/1702362010.png")',
        }}
      ></div>

      {/* Card */}
      <div className="relative w-full max-w-sm mx-auto p-8 bg-white rounded-2xl shadow-lg z-10">
        <div className="text-center mb-8">
          <h2 className="text-xl font-light italic text-gray-700">
            Create Account
          </h2>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name *"
            value={firstName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />

          <select
            name="gender"
            value={gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number *"
            value={mobile}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />

          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password *"
              value={password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password *"
              value={confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 py-2 rounded-full text-white text-sm font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {loading ? "Creating Account..." : "REGISTER"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="font-medium text-orange-600 hover:text-orange-500"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;