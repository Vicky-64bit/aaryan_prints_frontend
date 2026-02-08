import React from "react";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";

const Topbar = () => {
  return (
    // Outer div: Full width, background color
    <div className="bg-black text-white">
      {/* Inner container: Centers content, provides responsive padding */}
      <div className="container mx-auto flex justify-between items-center py-2 px-4 sm:px-6 lg:px-8">
        
        {/* Left - Social Icons (Visible on medium screens and up) */}
        <div className="hidden md:flex items-center space-x-3 text-gray-400">
          <a href="#" aria-label="Meta" className="hover:text-white transition duration-200">
            <TbBrandMeta className="h-4 w-4" />
          </a>

          <a href="#" aria-label="Instagram" className="hover:text-white transition duration-200">
            <IoLogoInstagram className="h-4 w-4" />
          </a>

          <a href="#" aria-label="Twitter X" className="hover:text-white transition duration-200">
            <RiTwitterXLine className="h-3 w-3" />
          </a>
        </div>
        
        {/* Center - Announcement/Offer */}
        {/* Added 'font-semibold' and 'text-orange-400' for visual pop */}
        <div className="text-xs sm:text-sm text-center flex-grow font-medium">
          <span className="text-gray-200">Upto 20% off on </span>
          <span className="text-orange-400 font-bold uppercase">new arrivals!</span>
        </div>
        
        {/* Right - Contact Info (Visible on medium screens and up) */}
        {/* Used 'text-xs' and subtle color for balance */}
        <div className="text-xs hidden md:block text-gray-400">
          <span className="mr-2">Need help?</span>
          <a href="tel:+1234567890" className="hover:text-white font-semibold transition duration-200">
            +1 (234) 567 - 890
          </a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;