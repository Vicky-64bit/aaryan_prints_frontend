import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiEye, FiShoppingCart } from "react-icons/fi";

const BestSellerProduct = ({ product }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  // Intersection Observer for fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
  }, []);

  if (!product) return null;

  const fallbackImage =
    "https://placehold.co/500x600/EEE/999?text=No+Image+Available";

  return (
    <div
      ref={ref}
      className={`relative py-12 transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Blurred Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-200 to-pink-200 opacity-20 rounded-3xl blur-3xl z-0"></div>

      {/* Floating Card */}
      <div className="relative max-w-5xl mx-auto rounded-3xl shadow-2xl overflow-hidden bg-white flex flex-col lg:flex-row items-center gap-10 p-6 sm:p-10 transform transition-transform duration-700 hover:-translate-y-2 hover:shadow-3xl z-10">
        {/* Product Image */}
        <div className="relative w-full lg:w-1/2 group flex justify-center">
          <img
            src={product.images[0].url || fallbackImage}
            alt={product.title || "Best Seller"}
            className="w-full max-h-[450px] sm:max-h-[400px] lg:max-h-[450px] object-cover rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-105"
          />

          {/* Offer Badge */}
          {/* {product.offer && ( */}
            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md z-20">
              {product.offer || "30% off"}
            </div>
          {/* )} */}

          {/* Hover Overlay Icons */}
          <div className="absolute inset-0 flex justify-center items-center gap-4 bg-black/20 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 z-20">
            <button className="p-3 bg-white rounded-full shadow-lg hover:bg-orange-500 hover:text-white transition-all duration-300">
              <FiEye className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all duration-300">
              <FiHeart className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white rounded-full shadow-lg hover:bg-green-500 hover:text-white transition-all duration-300">
              <FiShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between text-center lg:text-left gap-6">
          <div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-orange-500 mb-3">
              {product.brand}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">{product.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-between gap-4 mt-4">
            <div className="text-center sm:text-left">
              {product.originalPrice && (
                <span className="text-gray-400 line-through mr-2">{product.originalPrice}</span>
              )}
              <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                {product.price}
              </span>
            </div>

            <Link
              to={`/product/${product._id}`}
              className="mt-2 sm:mt-0 inline-block bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg hover:from-orange-500 hover:to-orange-600 hover:shadow-xl transition-all duration-300"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestSellerProduct;
