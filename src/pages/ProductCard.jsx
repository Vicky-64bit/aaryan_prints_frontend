import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Calculate discount percentage if originalPrice exists
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : null;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col h-full border border-gray-100/50">
      {/* 1. Image Container */}
      <Link to={`/product/${product._id}`} className="relative block overflow-hidden aspect-[3/4]">
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black py-1 px-2 rounded-sm z-10 tracking-tighter">
            -{discount}%
          </div>
        )}

        {/* Special Tag (e.g., "New Arrival" or "Best Seller") */}
        {product.specialPrice && !discount && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold py-1 px-2 rounded-sm z-10 uppercase tracking-widest">
            {product.specialPrice}
          </div>
        )}

        <img
          src={product.images[0]?.url || "https://placehold.co/300x400?text=No+Image"}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {/* Quick View Overlay (Visual Only) */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
          <button className="w-full py-3 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold uppercase tracking-widest rounded-xl shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            Quick View
          </button>
        </div>
      </Link>

      {/* 2. Content Section */}
      <div className="p-5 flex-1 flex flex-col bg-white">
        {/* Brand / Category Hint */}
        <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1 opacity-80">
          {product.category || "Collection"}
        </p>

        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px] leading-relaxed group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through font-medium">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Rating or Color Dots (Optional UI enhancement) */}
        <div className="mt-3 flex items-center gap-1">
          <div className="flex text-orange-400">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-3 h-3 ${i < 4 ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-[10px] text-gray-400 font-medium ml-1">(24)</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;