import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSwipeable } from "react-swipeable";
import { fetchNewArrivalsProducts } from "../../redux/slice/productSlice";


const NewArrivals = () => {
  const dispatch = useDispatch();
  const carouselRef = useRef(null);

  const { newArrivals, loading } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (!newArrivals.length) {
      dispatch(fetchNewArrivalsProducts());
    }
  }, [dispatch, newArrivals.length]);

  // SAME SCROLL LOGIC
  const scrollNext = () => {
    carouselRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const scrollPrev = () => {
    carouselRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  // Swipe only on mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => window.innerWidth < 640 && scrollNext(),
    onSwipedRight: () => window.innerWidth < 640 && scrollPrev(),
    trackMouse: false,
  });

  if (loading && !newArrivals.length) {
    return null; // or skeleton later
  }

  return (
    <div className="my-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl sm:text-4xl font-light mb-1">
              Explore New Arrivals
            </h2>
            <p className="text-sm text-gray-500">Get the latest styles</p>
          </div>
          <Link
            to="/collections/all"
            className="bg-orange-500 text-white px-6 py-2 rounded-full shadow-lg hover:bg-orange-600 transition-all text-sm sm:text-base"
          >
            View All
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            {...swipeHandlers}
            ref={carouselRef}
            className="
              flex gap-4 sm:gap-6
              overflow-x-auto sm:overflow-hidden
              snap-x snap-mandatory
              scroll-smooth
              touch-pan-x
              pb-4
              [-ms-overflow-style:none]
              [scrollbar-width:none]
            "
          >
            {newArrivals.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="
                  flex-shrink-0
                  snap-start
                  w-[85%]
                  sm:w-1/2
                  md:w-1/3
                  lg:w-1/4
                  max-w-xs
                  bg-white
                  rounded-xl
                  shadow-lg
                  hover:shadow-xl
                  transition-transform
                  hover:scale-105
                "
              >
                <img
                  src={product.images?.[0]?.url}
                  alt={product.name}
                  className="w-full h-[300px] object-cover rounded-t-xl"
                />

                <div className="p-4 text-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-orange-500">
                    {product.brand || "AARYAN PRINTS"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-700 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="mt-2 text-xl font-extrabold text-gray-900">
                    ₹{product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* DESKTOP ARROWS — SAME SIZE */}
          <button
            onClick={scrollPrev}
            aria-label="Previous"
            className="hidden sm:flex absolute top-1/2 left-0 -translate-y-1/2 z-10 p-3 sm:p-4 bg-orange-500 text-white rounded-r-full shadow-lg hover:bg-orange-600 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={scrollNext}
            aria-label="Next"
            className="hidden sm:flex absolute top-1/2 right-0 -translate-y-1/2 z-10 p-3 sm:p-4 bg-orange-500 text-white rounded-l-full shadow-lg hover:bg-orange-600 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;
