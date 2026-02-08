import React, { useEffect, useState, useCallback, useMemo } from "react";
import FilterSidebar from "./FilterSidebar";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slice/productSlice";
import ProductCard from "./ProductCard";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const CollectionPage = () => {
  const { collection: collectionName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.products);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "popularity");

  const queryParams = useMemo(() => Object.fromEntries([...searchParams]), [searchParams]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [sidebarOpen]);

  const handleFilterChange = useCallback((filterName, option) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      if (newFilters[filterName]?.includes(option)) {
        newFilters[filterName] = newFilters[filterName].filter((item) => item !== option);
        if (newFilters[filterName].length === 0) delete newFilters[filterName];
      } else {
        newFilters[filterName] = newFilters[filterName] ? [...newFilters[filterName], option] : [option];
      }

      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, values]) => {
        values.forEach((value) => params.append(key.toLowerCase(), value));
      });
      if (sortBy && sortBy !== "popularity") params.set("sortBy", sortBy);
      setSearchParams(params);
      return newFilters;
    });
  }, [sortBy, setSearchParams]);

  const clearAllFilters = useCallback(() => {
    setSelectedFilters({});
    const params = new URLSearchParams();
    if (sortBy && sortBy !== "popularity") params.set("sortBy", sortBy);
    setSearchParams(params);
  }, [sortBy, setSearchParams]);

  const handleSortChange = useCallback((value) => {
    setSortBy(value);
    const params = new URLSearchParams([...searchParams]);
    if (value && value !== "popularity") params.set("sortBy", value);
    else params.delete("sortBy");
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection: collectionName, ...queryParams }));
  }, [dispatch, collectionName, queryParams]);

  useEffect(() => {
    const filters = {};
    for (const [key, value] of searchParams.entries()) {
      if (key !== "sortBy") {
        filters[key] = filters[key] ? [...filters[key], value] : [value];
      }
    }
    setSelectedFilters(filters);
  }, []);
  const buildFilterData = (products) => {
  const filters = {
    CATEGORY: new Set(),
    GENDER: new Set(),
    COLOR: new Set(),
    SIZE: new Set(),
    PRICE: new Set(),
  };

  products.forEach((p) => {
    if (p.category) filters.CATEGORY.add(p.category);
    if (p.gender) filters.GENDER.add(p.gender);

     if (Array.isArray(p.colors)) {
      p.colors.forEach((c) => filters.COLOR.add(c));
    } else if (p.color) {
    if (p.color) filters.COLOR.add(p.color);
    }

    if (Array.isArray(p.sizes)) {
      p.sizes.forEach((s) => filters.SIZE.add(s));
    }

    if (p.price) {
      if (p.price < 500) filters.PRICE.add("Under 500");
      else if (p.price <= 1000) filters.PRICE.add("500 - 1000");
      else if (p.price <= 2000) filters.PRICE.add("1000 - 2000");
      else filters.PRICE.add("2000+");
    }
  });

  return Object.fromEntries(
    Object.entries(filters).map(([k, v]) => [k, [...v]])
  );
};

const filterData = useMemo(
  () => buildFilterData(products),
  [products]
);



  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="bg-white min-h-screen font-sans antialiased">
      <header className="pt-32 pb-12 text-center bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-serif font-light text-gray-900 mb-2 capitalize">
            {collectionName ? collectionName.replace(/-/g, ' ') : "Shop All"}
          </h1>
          <p className="text-gray-400 uppercase tracking-[0.2em] text-[9px] font-bold">
            Essential Collection
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR */}
          <aside className={`fixed inset-y-0 left-0 z-50 w-full sm:w-80 bg-white transform transition-transform duration-500 ease-in-out flex flex-col lg:relative lg:translate-x-0 lg:z-0 lg:w-64 lg:bg-transparent lg:block ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex lg:hidden justify-between items-center px-6 py-5 border-b">
              <span className="font-bold uppercase tracking-widest text-xs">Filter By</span>
              <button onClick={() => setSidebarOpen(false)} className="p-2">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 lg:p-0 lg:sticky lg:top-32 lg:max-h-[calc(100vh-160px)]">
              <FilterSidebar
                filterData={filterData}
                selectedFilters={selectedFilters}
                handleFilterChange={handleFilterChange}
                clearAllFilters={clearAllFilters}
              />
            </div>

            <div className="p-4 border-t bg-white lg:hidden">
                <button onClick={() => setSidebarOpen(false)} className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest text-[10px]">
                    Show Items
                </button>
            </div>
          </aside>

          {/* PRODUCT AREA */}
          <div className="flex-1">
            {/* STICKY TOOLBAR */}
            <div className="sticky top-[70px] lg:relative lg:top-0 z-30 bg-white py-3 lg:py-0 mb-6 border-b border-gray-100 lg:border-none px-2 lg:px-0">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 rounded-md font-bold text-[10px] uppercase tracking-widest"
                >
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                   Filters
                </button>

                <div className="flex-1 lg:flex-none">
                   <select
                    className="w-full lg:w-48 bg-gray-50 border-none rounded-md px-4 py-3 text-[10px] font-bold uppercase tracking-widest focus:ring-0 cursor-pointer appearance-none text-center"
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    <option value="popularity">Sort: Best Sellers</option>
                    <option value="newest">Sort: Newest</option>
                    <option value="priceAsc">Price: Low - High</option>
                    <option value="priceDesc">Price: High - Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* PRODUCT GRID: Updated for 2-column mobile */}
            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-x-3 gap-y-8 md:gap-x-8 md:gap-y-12">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-gray-400 text-xs tracking-widest uppercase">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default CollectionPage;