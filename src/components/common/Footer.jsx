import React, { useState } from "react";
import axios from "axios";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { FiPhoneCall } from "react-icons/fi";
import { FaTshirt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const ACCENT_COLOR_CLASS = "text-indigo-600 hover:text-indigo-700";

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/subscribe`,
        { email }
      );

      setSubscribed(true);
      setEmail("");
      setMessage(res.data.message);

      setTimeout(() => {
        setSubscribed(false);
        setMessage("");
      }, 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="w-[95%] mx-auto mt-4 bg-gradient-to-r from-indigo-50 via-white to-pink-50 rounded-3xl p-8 shadow-xl relative overflow-hidden">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 px-4 lg:px-0">

        {/* Brand & Newsletter */}
        <div>
          <div className="flex items-center text-xl font-bold text-gray-900 mb-6 drop-shadow-sm">
            <FaTshirt className={`mr-2 h-6 w-6 ${ACCENT_COLOR_CLASS}`} />
            <span>Aaryan Prints</span>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Crafting fashion with passion & style. Stay updated with our latest collections and offers!
          </p>

          <form onSubmit={handleSubscribe} className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 w-full text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 text-sm rounded-r-lg font-medium hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
              disabled={loading || subscribed}
            >
              {loading ? "Subscribing..." : subscribed ? "Subscribed!" : "Subscribe"}
            </button>
          </form>

          {message && (
            <p
              className={`mt-2 text-sm font-medium animate-fadeIn ${
                subscribed ? "text-green-600" : "text-red-600"
              }`}
            >
              {subscribed ? "🎉 " : "⚠️ "} {message}
            </p>
          )}
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4 font-semibold">Shop</h3>
          <ul className="space-y-3 text-gray-600">
            <li><Link to="/collections/all?gender=Men" className={`${ACCENT_COLOR_CLASS}`}>Men's Top Wear</Link></li>
            <li><Link to="/collections/all?gender=Women" className={`${ACCENT_COLOR_CLASS}`}>Women's Top Wear</Link></li>
            <li><Link to="/collections/all?gender=Men" className={`${ACCENT_COLOR_CLASS}`}>Men's Bottom Wear</Link></li>
            <li><Link to="/collections/all?gender=Women" className={`${ACCENT_COLOR_CLASS}`}>Women's Bottom Wear</Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4 font-semibold">Support</h3>
          <ul className="space-y-3 text-gray-600">
            <li><Link to="/contactus" className={`${ACCENT_COLOR_CLASS}`}>Contact Us</Link></li>
            <li><Link to="/about" className={`${ACCENT_COLOR_CLASS}`}>About Us</Link></li>
            <li><Link to="/faq" className={`${ACCENT_COLOR_CLASS}`}>FAQ's</Link></li>
            <li><Link to="/services" className={`${ACCENT_COLOR_CLASS}`}>Services</Link></li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4 font-semibold">Follow Us</h3>
          <div className="flex items-center space-x-4 mb-4">
            <a href="https://www.facebook.com/aaryanprints" target="_blank" rel="noopener noreferrer">
              <TbBrandMeta className="h-6 w-6 text-gray-600 hover:text-blue-700" />
            </a>
            <a href="https://www.instagram.com/aaryanprints" target="_blank" rel="noopener noreferrer">
              <IoLogoInstagram className="h-6 w-6 text-gray-600 hover:text-pink-600" />
            </a>
            <a href="https://www.twitter.com/aaryanprints" target="_blank" rel="noopener noreferrer">
              <RiTwitterXLine className="h-5 w-5 text-gray-600 hover:text-black" />
            </a>
          </div>

          <p className="text-gray-500 mb-2 text-sm font-medium">Call Us Anytime</p>
          <a
            href="tel:0123-456-789"
            className={`inline-flex items-center text-lg font-bold ${ACCENT_COLOR_CLASS}`}
          >
            <FiPhoneCall className="mr-2 h-5 w-5" />
            0123-456-789
          </a>
        </div>
      </div>

      <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-300 pt-6 text-center">
        <p className="text-gray-500 text-xs tracking-wide">
          © {new Date().getFullYear()}, Aaryan Prints. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
