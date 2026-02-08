import React, { useEffect, useState } from "react";
import {
  BiUser,
  BiHeart,
  BiMap,
  BiCreditCard,
  BiListOl,
  BiInfoCircle,
  BiSupport,
  BiLogOut,
  BiMenu,
  BiX,
} from "react-icons/bi";

import MyOrders from "../components/cart/MyOrders";
import Wishlist from "../components/cart/wishlist";
import Addresses from "./Addresses";
import AccountAndInformation from "./AccountAndInformation";
import MyProfileContent from "./MyProfileContent";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slice/cartSlice";
import { logout } from "../redux/slice/authSlice";

// Customer Care content
const CustomerCareContent = () => (
  <div className="bg-white p-6 rounded-2xl shadow-sm">
    <h3 className="text-lg sm:text-xl font-medium mb-4 italic">
      Customer Care
    </h3>
    <p className="text-gray-500 mb-2">
      How can we help you today? Please find our contact details below:
    </p>
    <div className="border rounded-lg p-4 mb-4">
      <p className="font-semibold">Email Us:</p>
      <p className="text-sm text-gray-600">support@aaryanprints.com</p>
    </div>
    <div className="border rounded-lg p-4 mb-4">
      <p className="font-semibold">Call Us:</p>
      <p className="text-sm text-gray-600">+91-9876543210</p>
    </div>
  </div>
);

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  const [activeLink, setActiveLink] = useState("My Profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const contentMap = {
    "My Profile": (
      <MyProfileContent
        onEditProfile={() => setActiveLink("Account & Information")}
      />
    ),

    "My Orders": <MyOrders />,
    // Wishlist: <Wishlist />,
    // Addresses: <Addresses />,
    "Account & Information": <AccountAndInformation />,
    "Customer Care": <CustomerCareContent />,
  };

  const navItems = [
    { name: "My Orders", icon: <BiListOl className="text-lg" /> },
    // { name: "Wishlist", icon: <BiHeart className="text-lg" /> },
    {
      name: "Account & Information",
      icon: <BiInfoCircle className="text-lg" />,
    },
    // { name: "Addresses", icon: <BiMap className="text-lg" /> },
    // { name: "Saved Cards", icon: <BiCreditCard className="text-lg" /> },
    { name: "Customer Care", icon: <BiSupport className="text-lg" /> },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-500">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 mt-20 mb-4 min-h-screen p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center p-4 sm:p-6 border-b border-gray-200">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-16 h-16 sm:w-20 sm:h-20 text-gray-500"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.85-1.76a.75.75 0 01-.437-.695z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold ml-4 text-gray-800">
            Welcome, {user?.firstName || "User"}!
          </h1>

          {/* Hamburger */}
          <button
            className="ml-auto sm:hidden text-2xl text-gray-600"
            onClick={() => setSidebarOpen(true)}
          >
            <BiMenu />
          </button>
        </div>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        <div className="flex flex-col md:flex-row relative">
          {/* Sidebar (drawer on mobile) */}
          <nav
            className={`fixed sm:static top-0 left-0 h-full w-64 bg-white z-50 sm:z-auto transform transition-transform duration-300 sm:translate-x-0 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center p-4 border-b sm:hidden">
              <h2 className="font-semibold text-gray-700">Menu</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-2xl"
              >
                <BiX />
              </button>
            </div>
            <ul className="p-4 space-y-2">
              <li
                onClick={() => {
                  setActiveLink("My Profile");
                  setSidebarOpen(false);
                }}
                className={`py-3 px-4 rounded-lg cursor-pointer ${
                  activeLink === "My Profile"
                    ? "bg-orange-50 text-orange-500 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                My Profile
              </li>
              {navItems.map((item, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setActiveLink(item.name);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center py-3 px-4 rounded-lg cursor-pointer ${
                    activeLink === item.name
                      ? "bg-orange-50 text-orange-500 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </li>
              ))}
              <li
                onClick={handleLogout}
                className="flex items-center py-3 px-4 rounded-lg cursor-pointer text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-3">
                  <BiLogOut className="text-lg" />
                </span>
                Logout
              </li>
            </ul>
          </nav>

          {/* Main Panel */}
          <main className="flex-1 p-4 sm:p-6 md:p-8 bg-gray-50 z-0">
            {contentMap[activeLink] || (
              <div className="text-gray-500">Page not found.</div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
