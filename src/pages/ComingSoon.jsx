import React from "react";
import { useNavigate } from "react-router-dom";

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-8 text-center mt-2 mb-0">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-orange-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
          Feature Coming Soon 🚧
        </h1>

        {/* Message */}
        <p className="text-gray-600 text-base md:text-lg mb-6">
          We’re currently working on order delivery, tracking, and payment
          features directly on our website.
          <br />
          <br />
          We’re really sorry for the inconvenience and appreciate your patience.
        </p>

        {/* Flipkart Suggestion */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-700 font-medium">
            👉 For now, you can safely place your order using{" "}
            <span className="font-bold">Buy on Flipkart</span>, where delivery
            and tracking are fully supported.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
          >
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-md bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;