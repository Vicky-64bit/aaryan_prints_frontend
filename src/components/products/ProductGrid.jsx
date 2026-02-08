import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiEye, FiShoppingCart, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useSwipeable } from "react-swipeable";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slice/cartSlice";
import { toast } from "sonner";

const ProductGrid = ({ products, loading, error }) => {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Responsive items per page
  useEffect(() => {
    const updateItems = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 768) setItemsPerPage(2);
      else if (window.innerWidth < 1024) setItemsPerPage(3);
      else setItemsPerPage(4);
    };
    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, []);

  const scrollNext = () => {
    if (containerRef.current) {
      const scrollWidth = containerRef.current.offsetWidth;
      containerRef.current.scrollBy({ left: scrollWidth, behavior: "smooth" });
    }
  };

  const scrollPrev = () => {
    if (containerRef.current) {
      const scrollWidth = containerRef.current.offsetWidth;
      containerRef.current.scrollBy({ left: -scrollWidth, behavior: "smooth" });
    }
  };

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: scrollNext,
    onSwipedRight: scrollPrev,
    trackMouse: true,
  });

  //MALFUNCTION
const handleAddToCart = async (product) => {
  try {
    await dispatch(
      addToCart({
        productId: product._id,
        quantity: 1,
        color: product.colors?.[0] || null,
        size: product.sizes?.[0] || null,
        guestId: localStorage.getItem("guestId") || null,
        userId: localStorage.getItem("userId") || null,
      })
    ).unwrap(); // ensures proper success handling

    toast.success("Product added to cart", { duration: 1000 });
  } catch (err) {
    toast.error(err?.message || "Failed to add to cart");
  }
};

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error: {error}</p>;
  if (!products || products.length === 0) return <p className="text-center py-10">No Products Found</p>;

  return (
    <div className="relative w-full max-w-[95%] mx-auto my-8">
      {/* Prev Button */}
      <button
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 bg-white rounded-full shadow-xl hover:shadow-2xl hover:bg-orange-500 hover:text-white transition-all hidden sm:flex items-center justify-center"
      >
        <FiChevronLeft className="w-6 h-6" />
      </button>

      {/* Next Button */}
      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 bg-white rounded-full shadow-xl hover:shadow-2xl hover:bg-orange-500 hover:text-white transition-all hidden sm:flex items-center justify-center"
      >
        <FiChevronRight className="w-6 h-6" />
      </button>

      {/* Product Cards */}
      <div
        {...handlers}
        ref={containerRef}
        className="flex overflow-x-auto gap-4 scroll-smooth pb-4 px-2"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="group relative flex-shrink-0 w-[80%] sm:w-1/2 md:w-1/3 lg:w-1/4 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-transform duration-300 transform hover:scale-105"
            style={{ scrollSnapAlign: "start" }}
          >
            {/* Product Image */}
            <div className="relative h-[280px] sm:h-[300px] md:h-[320px] overflow-hidden rounded-t-2xl">
              <img
                src={product.images?.[0]?.url || "https://placehold.co/300x400?text=No+Image"}
                alt={product.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Offer Badge */}
              {product.offer && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {product.offer}
                </span>
              )}

              {/* Action Icons */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="p-2 bg-white rounded-full shadow hover:bg-orange-500 hover:text-white transition" >
                  <FiEye className="w-4 h-4" />
                </button>
                {/* <button className="p-2 bg-white rounded-full shadow hover:bg-red-500 hover:text-white transition">
                  <FiHeart className="w-4 h-4" />
                </button> */}
                <button className="p-2 bg-white rounded-full shadow hover:bg-green-500 hover:text-white transition" onClick={() => handleAddToCart(product)}>
                  <FiShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4 text-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-orange-500">
                {product.brand || "AARYAN PRINTS"}
              </h3>
              <p className="mt-1 text-sm text-gray-700 truncate">{product.description}</p>
              <p className="mt-2 text-xl font-extrabold text-gray-900">₹{product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
