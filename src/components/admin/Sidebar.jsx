import React from 'react';
import { Link } from 'react-router-dom';
import { SIDEBAR_ITEMS } from './utils/constants';

const Sidebar = ({ view, setView, themeDark }) => {
  return (
    <aside
      className={`w-64 border-r p-4 fixed md:relative h-screen z-50 transition-colors ${
        themeDark 
          ? "bg-gray-900 text-gray-100 border-gray-700" 
          : "bg-gray-50 text-gray-900 border-gray-200"
      }`}
    >
      <Link to="/" className="flex flex-col items-center mb-8">
        <span className="font-thin text-base tracking-[3px]">AARYAN</span>
        <span className="font-bold text-sm tracking-[6px] text-orange-500">
          PRINTS
        </span>
      </Link>
      
      <nav className="space-y-1">
        {SIDEBAR_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
              view === item.id
                ? "bg-gradient-to-br from-pink-500 to-orange-400 text-white shadow-md"
                : `hover:bg-gray-200 ${
                    themeDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                  }`
            }`}
            onClick={() => setView(item.id)}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;