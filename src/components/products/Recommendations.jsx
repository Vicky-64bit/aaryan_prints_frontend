import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendedProducts } from "../../redux/slice/productSlice";

const Recommendations = () => {
  const scrollRef = useRef(null);
  const dispatch = useDispatch();

  const { recommendedProducts: products, loading } = useSelector(
    (state) => state.products
  );

  // Fetch recommended products
  useEffect(() => {
    if (!products.length) {
      dispatch(fetchRecommendedProducts({ limit: 12 }));
    }
  }, [dispatch, products.length]);

  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollPrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -scrollRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  if (loading && !products.length) return null;

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900">
              Recommended For You
            </h2>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Popular picks customers love
            </p>
          </div>

          <Link
            to="/collections/all"
            className="hidden sm:inline-block bg-gradient-to-r from-orange-400 to-orange-500 text-white px-5 py-2 rounded-full font-semibold text-sm hover:from-orange-500 hover:to-orange-600 transition"
          >
            View All
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-none scroll-smooth snap-x snap-mandatory -mx-3"
          >
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="flex-shrink-0 px-3 w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4 snap-start"
              >
                <div className="bg-white rounded-3xl shadow-md hover:shadow-2xl border border-gray-100 overflow-hidden group transition-all duration-500">
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={product.images?.[0]?.url}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Badge */}
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      POPULAR
                    </div>
                  </div>

                  <div className="p-4 text-center">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-orange-500">
                      {product.brand || "AARYAN PRINTS"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-700 truncate">
                      {product.name}
                    </p>
                    <p className="mt-2 text-lg sm:text-xl font-extrabold text-gray-900">
                      ₹{product.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop arrows */}
          <button
            onClick={scrollPrev}
            className="hidden sm:flex absolute top-1/2 left-0 -translate-y-1/2 z-20 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
          >
            <svg
              className="w-5 h-5 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={scrollNext}
            className="hidden sm:flex absolute top-1/2 right-0 -translate-y-1/2 z-20 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
          >
            <svg
              className="w-5 h-5 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
