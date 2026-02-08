import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import SearchBar from "./SearchBar";
import CartDrawer from "../layout/CartDrawer";
import { useSelector } from "react-redux";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const startY = useRef(null);

  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const cartItemCount = (cart?.products ?? []).reduce(
    (total, product) => total + (product?.quantity || 0),
    0
  );

  const toggleNavDrawer = () => setNavDrawerOpen((prev) => !prev);
  const toggleCartDrawer = () => setDrawerOpen((prev) => !prev);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= SWIPE TO CLOSE ================= */
  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (!startY.current) return;
    const diff = e.touches[0].clientY - startY.current;
    if (diff > 90) {
      setNavDrawerOpen(false);
      startY.current = null;
    }
  };

  return (
    <>
      {/* ================= TOPBAR (UNCHANGED) ================= */}
      <div className="bg-black text-white fixed top-0 left-0 w-full z-50 h-8">
        <div className="container mx-auto flex justify-between items-center h-full px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center space-x-3 text-gray-400">
            <TbBrandMeta className="h-4 w-4 hover:text-white transition" />
            <IoLogoInstagram className="h-4 w-4 hover:text-white transition" />
            <RiTwitterXLine className="h-3 w-3 hover:text-white transition" />
          </div>

          <div className="text-xs sm:text-sm text-center flex-grow font-medium tracking-wide">
            <span className="text-gray-200">Upto 20% off on </span>
            <span className="text-orange-400 font-bold uppercase">
              new arrivals!
            </span>
          </div>

          <div className="hidden md:block text-xs text-gray-400">
            Need help?{" "}
            <span className="hover:text-white font-semibold transition">
              +1 (234) 567 - 890
            </span>
          </div>
        </div>
      </div>

      {/* ================= NAVBAR (UNCHANGED DESKTOP) ================= */}
      <header
        className={`fixed top-[32px] left-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-lg shadow-md"
            : "bg-white shadow-sm"
        } h-14`}
      >
        <nav className="container mx-auto flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex flex-col items-center group">
            <span className="font-['Montserrat'] font-thin text-base tracking-[3px] text-gray-800 group-hover:text-orange-500 transition">
              AARYAN
            </span>
            <span className="font-['Montserrat'] font-bold text-sm tracking-[6px] text-orange-500 group-hover:text-gray-800 transition">
              PRINTS
            </span>
          </Link>

          {/* Desktop Links */}
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
                <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-orange-500 transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4 min-w-fit">
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="border border-red-300 text-red-500 px-2 py-1 text-xs rounded-md font-semibold hover:bg-red-500 hover:text-white transition whitespace-nowrap"
              >
                Admin
              </Link>
            )}

            <Link to="/profile" className="hover:scale-110 transition-transform">
              <HiOutlineUser className="h-6 w-6 text-orange-500" />
            </Link>

            <button
              onClick={toggleCartDrawer}
              className="relative hover:scale-110 transition-transform"
            >
              <HiOutlineShoppingBag className="h-6 w-6 text-orange-500" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#ea2e0e] text-white text-[10px] font-semibold rounded-full px-[6px] py-[1px] shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </button>

            <div className="hidden sm:block">
              <SearchBar />
            </div>

            <button onClick={toggleNavDrawer} className="md:hidden">
              <HiBars3BottomRight className="h-6 w-6 text-orange-500" />
            </button>
          </div>
        </nav>
      </header>

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* ================= MOBILE iOS BOTTOM SHEET ================= */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${
          navDrawerOpen ? "visible" : "invisible"
        }`}
        onClick={toggleNavDrawer}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        {/* Bottom Sheet */}
        <div
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className={`absolute bottom-0 left-0 w-full h-[75%]
          bg-white/70 backdrop-blur-xl rounded-t-3xl shadow-2xl
          transform transition-transform duration-300 ease-out
          ${navDrawerOpen ? "translate-y-0" : "translate-y-full"}`}
        >
          {/* Handle */}
          <div className="flex justify-center py-3">
            <div className="w-12 h-1.5 rounded-full bg-gray-300" />
          </div>

          {/* Menu */}
          <nav className="px-6">
            {[
              ["Shop", "/collections/all"],
              ["Services", "/services"],
              ["About Us", "/about"],
              ["Contact Us", "/contactus"],
            ].map(([label, path]) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={label}
                  to={path}
                  onClick={toggleNavDrawer}
                  className={`block py-4 uppercase text-sm font-medium ${
                    active
                      ? "text-orange-500"
                      : "text-gray-800 active:opacity-60"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Search */}
          <div className="px-6 mt-4">
            <SearchBar />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
