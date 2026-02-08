import React from 'react';

const Button = ({ 
  children, 
  className = "", 
  variant = "default", 
  loading = false,
  ...props 
}) => {
  const baseClasses = "px-3 py-2 rounded text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    ghost: "bg-transparent text-current hover:bg-gray-200 focus:ring-gray-500",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;