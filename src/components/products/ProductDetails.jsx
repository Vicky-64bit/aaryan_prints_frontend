import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import ProductGrid from "./ProductGrid";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails, fetchSimilarProducts } from "../../redux/slice/productSlice";
import { addToCart } from "../../redux/slice/cartSlice";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct, loading, error, similarProducts } = useSelector((state) => state.products);
  const { user, guestId } = useSelector((state) => state.auth);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showCharacteristics, setShowCharacteristics] = useState(false);

  // Magnifier state
  const [isZoomed, setIsZoomed] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);
  const lensRef = useRef(null);

  const productFetchId = productId || id;

  const recommendedRef = useRef(null);
  const moreLikeRef = useRef(null);
  const comboRef = useRef(null);

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) setMainImage(selectedProduct.images[0].url);
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity((prev) => prev + 1);
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color before adding to cart.", { duration: 1000 });
      return;
    }
    setIsButtonDisabled(true);

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      })
    )
      .then(() => toast.success("Product added to cart", { duration: 1000 }))
      .finally(() => setIsButtonDisabled(false));
  };

  const handleGoBack = () => navigate(-1);

  // Magnifier
  const handleMouseMove = (e) => {
    const img = imgRef.current;
    const lens = lensRef.current;
    if (!img || !lens) return;

    const rect = img.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Clamp to image
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));

    setLensPos({ x, y });
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-20">Error: {error}</p>;
  if (!selectedProduct) return <p className="text-center text-red-500 mt-20 text-xl">⚠️ Product not found</p>;

  return (
    <div className="space-y-20 mt-28">
      <div className="max-w-6xl mx-auto bg-white p-6 md:p-10 rounded-2xl shadow-lg relative">
        <button
          onClick={handleGoBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span className="font-semibold text-sm">Back to Products</span>
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Thumbnails */}
          <div className="hidden md:flex flex-col gap-4 z-20">
            {selectedProduct.images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={img.altText || `Thumbnail ${idx}`}
                onClick={() => setMainImage(img.url)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${
                  mainImage === img.url ? "border-orange-500 ring-1 ring-orange-400" : "border-gray-300"
                } hover:scale-105`}
              />
            ))}
          </div>

          {/* Main Image with Lens */}
          <div className="md:w-1/2 relative z-30">
            <img
              src={mainImage}
              alt={selectedProduct.name}
              ref={imgRef}
              className="w-full h-[580px] object-cover rounded-xl shadow-md cursor-zoom-in transition-transform duration-200 hover:scale-105"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            />
            {isZoomed && (
              <div
                ref={lensRef}
                className="absolute w-40 h-40 rounded-full border-2 border-gray-300 shadow-lg pointer-events-none z-50"
                style={{
                  top: `${lensPos.y - 80}px`,
                  left: `${lensPos.x - 80}px`,
                  backgroundImage: `url(${mainImage})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: `${imgRef.current.width * 2}px ${imgRef.current.height * 2}px`,
                  backgroundPosition: `-${lensPos.x * 2 - 80}px -${lensPos.y * 2 - 80}px`,
                }}
              />
            )}
          </div>

          {/* Mobile Thumbnails */}
          <div className="flex md:hidden gap-4 overflow-x-auto py-2 z-20">
            {selectedProduct.images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={img.altText || `Thumbnail ${idx}`}
                onClick={() => setMainImage(img.url)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${
                  mainImage === img.url ? "border-orange-500" : "border-gray-300"
                } hover:scale-105`}
              />
            ))}
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 flex flex-col justify-between z-30">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{selectedProduct.name}</h1>
              <p className="text-xl md:text-2xl font-semibold text-gray-500 mb-4">
                ₹{selectedProduct.price}{" "}
                {selectedProduct.originalPrice && (
                  <span className="text-gray-400 line-through text-sm ml-2">{selectedProduct.originalPrice}</span>
                )}
              </p>
              <p className="text-gray-600 mb-6">{selectedProduct.description}</p>

              {/* Color Selector */}
              <div className="mb-6 relative z-30">
                <p className="font-semibold mb-2">Color:</p>
                <div className="flex gap-3">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${
                        selectedColor === color ? "border-orange-500 ring-1 ring-orange-400" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.toLowerCase(), filter: "brightness(0.85)" }}
                    ></button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mb-6 relative z-30">
                <p className="font-semibold mb-2">Size:</p>
                <div className="flex gap-3 flex-wrap">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2 rounded-md border-2 font-medium text-sm hover:scale-105 transition ${
                        selectedSize === size ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-700 border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6 flex items-center gap-4 z-30">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange("minus")}
                    className="w-10 h-10 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("plus")}
                    className="w-10 h-10 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4 mt-4 z-30">
              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className={`flex-1 py-3 px-6 rounded-md font-bold text-lg transition-colors ${
                  isButtonDisabled ? "bg-gray-400 cursor-not-allowed text-gray-100" : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
              >
                ADD TO CART
              </button>

             

              {/* {selectedProduct.flipkartUrl && ( */}
                  <button
                    onClick={() => window.open(selectedProduct.flipkartUrl, "_blank")}
                    className="flex-1 py-3 px-6 rounded-md font-bold text-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    BUY ON FLIPKART
                  </button>
              {/* )} */}
            </div>

            {/* Product Characteristics */}
            <div className="mt-8 text-gray-700 relative z-30">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowCharacteristics((prev) => !prev)}>
                <h3 className="text-xl font-bold mb-2">Characteristics</h3>
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${showCharacteristics ? "rotate-180" : "rotate-0"}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>

              {showCharacteristics && (
                <table className="w-full text-left text-sm md:text-base mt-2">
                  <tbody>
                    <tr>
                      <td className="py-2 font-semibold">Brand</td>
                      <td className="py-2">{selectedProduct.brand}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold">Material</td>
                      <td className="py-2">{selectedProduct.material}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Recommended */}
        <div className="bg-gray-50 rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-center mb-6">
            <span className="px-4 py-1 bg-orange-100 text-orange-600 font-semibold rounded-full text-sm">Recommended</span>
          </div>
          <h2 className="text-3xl font-bold text-center mb-4">You May Also Like</h2>
          <p className="text-center text-gray-500 mb-6">Products picked just for you</p>
          <ProductGrid products={similarProducts} loading={loading} error={error} ref={recommendedRef} />
        </div>

        {/* More Like This */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-center mb-6">
            <span className="px-4 py-1 bg-blue-100 text-blue-600 font-semibold rounded-full text-sm">Similar</span>
          </div>
          <h2 className="text-3xl font-bold text-center mb-4">More Like This</h2>
          <p className="text-center text-gray-500 mb-6">Similar products you might like</p>
          <ProductGrid products={similarProducts} loading={loading} error={error} ref={moreLikeRef} />
        </div>

        {/* Frequently Bought Together */}
        <div className="bg-gray-50 rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-center mb-6">
            <span className="px-4 py-1 bg-green-100 text-green-600 font-semibold rounded-full text-sm">Popular Combo</span>
          </div>
          <h2 className="text-3xl font-bold text-center mb-4">Frequently Bought Together</h2>
          <p className="text-center text-gray-500 mb-6">Popular combinations our customers love</p>
          <ProductGrid products={similarProducts} loading={loading} error={error} ref={comboRef} />
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
