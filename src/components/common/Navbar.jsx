import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import SearchBar from "./SearchBar";
import CartDrawer from "../layout/CartDrawer";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const cartItemCount = (cart?.products ?? []).reduce(
    (total, product) => total + (product?.quantity || 0),
    0
  );

  const toggleNavDrawer = () => setNavDrawerOpen(!navDrawerOpen);
  const toggleCartDrawer = () => setDrawerOpen(!drawerOpen);

  // Detect scroll for sticky header effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-lg shadow-md"
            : "bg-white shadow-sm"
        }`}
      >
        <nav className="container mx-auto flex items-center justify-between py-3 px-4 sm:px-6 lg:px-8">
          {/* Left - Logo */}
          <Link to="/" className="text-2xl font-medium text-orange-500">
            <div className="flex flex-col items-center">
              <span className="font-['Montserrat'] font-thin text-base tracking-[3px] text-gray-800">
                AARYAN
              </span>
              <span className="font-['Montserrat'] font-bold text-sm tracking-[6px] text-orange-500">
                PRINTS
              </span>
            </div>
          </Link>

          {/* Center - Links */}
          <div className="hidden md:flex space-x-8">
            {["Shop", "Services", "About Us", "Contact Us"].map((item) => (
              <Link
                key={item}
                to={
                  item === "Shop"
                    ? "/collections/all"
                    : item === "Services"
                    ? "/services"
                    : item === "About Us"
                    ? "/about"
                    : "/contactus"
                }
                className="relative text-gray-700 hover:text-black text-sm font-medium uppercase group"
              >
                {item}
                <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-orange-500 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Right - Icons */}
          <div className="flex items-center space-x-4">
            {user && user.role === "admin" && (
              <Link
                to="/admin"
                className="border border-red-300 text-red-500 px-2 py-1 text-xs rounded-md font-semibold hover:bg-red-500 hover:text-white transition-all"
              >
                Admin
              </Link>
            )}

            {/* Profile */}
            <Link to="/profile" className="hover:scale-110 transition-transform">
              <HiOutlineUser className="h-6 w-6 text-orange-500" />
            </Link>

            {/* Cart */}
            <button
              onClick={toggleCartDrawer}
              className="relative hover:scale-110 transition-transform"
              aria-label="Open Cart"
            >
              <HiOutlineShoppingBag className="h-6 w-6 text-orange-500" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#ea2e0e] text-white text-[10px] font-semibold rounded-full px-[6px] py-[1px] shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Search */}
            <div className="hidden sm:block overflow-hidden">
              <SearchBar />
            </div>

            {/* Hamburger (Mobile) */}
            <button
              onClick={toggleNavDrawer}
              className="md:hidden focus:outline-none"
              aria-label="Toggle Menu"
            >
              <HiBars3BottomRight className="h-6 w-6 text-orange-500" />
            </button>
          </div>
        </nav>
      </header>

      {/* Cart Drawer */}
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          navDrawerOpen ? "visible bg-black/40" : "invisible bg-transparent"
        }`}
        onClick={toggleNavDrawer}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 ${
            navDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button onClick={toggleNavDrawer}>
              <IoMdClose className="h-6 w-6 text-orange-500" />
            </button>
             
          </div>

          <nav className="p-6 space-y-4 text-gray-700 font-medium">
            <Link
              to="/collections/all"
              onClick={toggleNavDrawer}
              className="block hover:text-orange-500 transition-colors"
            >
              Shop
            </Link>
            <Link
              to="/services"
              onClick={toggleNavDrawer}
              className="block hover:text-orange-500 transition-colors"
            >
              Services
            </Link>
            <Link
              to="/about"
              onClick={toggleNavDrawer}
              className="block hover:text-orange-500 transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/contactus"
              onClick={toggleNavDrawer}
              className="block hover:text-orange-500 transition-colors"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
