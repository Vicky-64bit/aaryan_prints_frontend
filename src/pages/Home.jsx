import React, { useEffect } from "react";
import Hero from "../components/layout/Hero";
import NewArrivals from "../components/products/NewArrivals";
import Recommendations from "../components/products/Recommendations";
import { useDispatch, useSelector } from "react-redux";
import ProductGrid from "../components/products/ProductGrid";
import BestSellerProduct from "../components/products/BestSellerProduct";
import { fetchProductsByFilters, fetchBestSellerProduct } from "../redux/slice/productSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error, bestSeller } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    // Fetch products for a specific collection
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 12,
      })
    );

    // Fetch the best seller product
    dispatch(fetchBestSellerProduct());
  }, [dispatch]);

  return (
    <div className="pt-4 space-y-20">

      {/* Hero Section - Full Width */}
      <section className="w-full">
        <Hero />
      </section>

      {/* New Arrivals - Centered */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewArrivals />
      </section>

      {/* Recommendations Carousel - Full Width */}
      <section className="w-full bg-gray-50 py-10">
        <Recommendations />
      </section>

      {/* Best Seller - Highlighted, Slightly Narrower */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-3xl font-extrabold text-center mb-2">Best Seller</h2>
          <p className="text-center text-gray-500 mb-6">
            Our most loved product by customers
          </p>
          {bestSeller ? (
            <BestSellerProduct product={bestSeller} />
          ) : (
            <p className="text-center text-gray-600">Loading best seller product...</p>
          )}
        </div>
      </section>

      {/* You May Also Like - Centered Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-center mb-2">You May Also Like</h2>
          <p className="text-center text-gray-500 mb-4">
            Products picked just for you
          </p>
          <ProductGrid products={products.slice(0, 8)} loading={loading} error={error} />
        </div>
      </section>

      {/* More Like This - Centered Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-center mb-2">More Like This</h2>
          <p className="text-center text-gray-500 mb-4">
            Similar products you might like
          </p>
          <ProductGrid products={products.slice(2, 10)} loading={loading} error={error} />
        </div>
      </section>

      {/* Frequently Bought Together - Centered Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-center mb-2">Frequently Bought Together</h2>
          <p className="text-center text-gray-500 mb-4">
            Popular combinations our customers love
          </p>
          <ProductGrid products={products.slice(4, 12)} loading={loading} error={error} />
        </div>
      </section>

    </div>
  );
};

export default Home;