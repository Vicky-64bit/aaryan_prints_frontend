// MyProfileContent.jsx
import React from "react";
import { useSelector } from "react-redux";

const MyProfileContent = ({ onEditProfile }) => {
  const { user } = useSelector((state) => state.auth);
  

  if (!user) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
        <p className="text-gray-500">No user data available. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h3 className="text-lg sm:text-xl font-medium mb-6 italic">
        Profile Details
      </h3>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
        {/* Avatar */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
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

        {/* User Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-sm text-center sm:text-left">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-medium">{user.firstName || "N/A"}</p>
          </div>

          <div>
            <p className="text-gray-500">Gender</p>
            <p className="font-medium">{user.gender || "N/A"}</p>
          </div>

          <div>
            <p className="text-gray-500">Email Address</p>
            <p className="font-medium">{user.email || "N/A"}</p>
          </div>

          <div>
            <p className="text-gray-500">Mobile Number</p>
            <p className="font-medium">{user.mobile || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Button */}
      <button
        onClick={onEditProfile}
        className="px-6 py-2 bg-orange-500 text-white font-medium rounded-full shadow hover:bg-orange-600 transition-colors"
      >
        Edit Profile
      </button>
    </div>
  );
};

export default MyProfileContent;
