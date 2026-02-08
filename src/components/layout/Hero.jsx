import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchNewArrivalsProducts } from "../../redux/slice/productSlice";

const Hero = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { newArrivals, loading } = useSelector((state) => state.products);

  // ✅ Single source of truth for slider index
  const [currentIndex, setCurrentIndex] = useState(0);

  /* ============================
     FETCH PRODUCTS
  ============================ */
  useEffect(() => {
    dispatch(fetchNewArrivalsProducts());
  }, [dispatch]);

  /* ============================
     LIMIT TO 5 PRODUCTS (HERO ONLY)
  ============================ */
  const heroProducts = newArrivals?.slice(0, 5);

  /* ============================
     AUTO SLIDE
  ============================ */
  useEffect(() => {
    if (!heroProducts?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === heroProducts.length - 1 ? 0 : prev + 1
      );
    }, 8000);

    return () => clearInterval(interval);
  }, [heroProducts]);

  /* ============================
     LOADING STATE
  ============================ */
  if (loading || !heroProducts?.length) {
    return (
      <div className="w-full h-[85vh] flex items-center justify-center bg-gray-200">
        <p className="text-gray-600 text-lg">Loading fresh styles…</p>
      </div>
    );
  }

  /* ============================
     CURRENT PRODUCT
  ============================ */
  const currentProduct = heroProducts[currentIndex];
  const backgroundImage =
  currentProduct?.images?.[0]?.url ||
  "https://via.placeholder.com/1600x900?text=No+Image";

  /* ============================
     NAVIGATION HANDLERS
  ============================ */
  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? heroProducts.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === heroProducts.length - 1 ? 0 : prev + 1
    );
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden mt-12">
      {/* Background Image */}
      <img
        src={backgroundImage}
        alt={currentProduct?.name || "Hero Product"}
        className="w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out animate-fadeIn  pointer-events-none"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://via.placeholder.com/1600x900?text=Image+Unavailable";
        }}
      />

      {/* Fade Animation */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0.7; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Hero Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white bg-black/30 pointer-events-none">
        <div className="p-6 rounded-xl border border-white/20 text-center shadow-2xl max-w-lg mx-auto backdrop-blur-sm">
          <p className="text-sm font-semibold tracking-widest uppercase mb-2 text-orange-300">
            New Collection
          </p>

          <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 drop-shadow-lg leading-tight">
            Elevate Your <span className="text-orange-500">Style</span>
          </h1>

          <button
             onClick={() => navigate("/collections/all?sortBy=newest")}
            className="group mt-4 bg-orange-500 text-white px-10 py-3 rounded-full font-bold uppercase text-sm 
                       shadow-xl hover:bg-white hover:text-orange-600 transition-all duration-300 
                       transform hover:scale-[1.03] pointer-events-auto cursor-pointer"
          >
            SHOP FRESH STYLES
            <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 w-full flex justify-between items-center px-4 md:px-8">
        <button
          onClick={handlePrev}
          className="p-3 bg-white/20 text-white rounded-full hover:bg-white/40 backdrop-blur-sm"
          aria-label="Previous"
        >
          ‹
        </button>

        <button
          onClick={handleNext}
          className="p-3 bg-white/20 text-white rounded-full hover:bg-white/40 backdrop-blur-sm"
          aria-label="Next"
        >
          ›
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 p-2 rounded-full bg-black/30 backdrop-blur-sm">
        {heroProducts.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-orange-500 w-6"
                : "bg-gray-300/80 hover:bg-white"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;