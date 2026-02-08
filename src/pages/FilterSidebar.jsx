import React, { useState } from "react";

const FilterSidebar = ({ filterData, selectedFilters, handleFilterChange, clearAllFilters }) => {
  // const filterData = {
  //   CATEGORY: ["Shirts", "T-Shirts", "Jeans", "Dresses"],
  //   GENDER: ["Men", "Women", "Unisex"],
  //   COLOR: ["Red", "Blue", "Green", "Black", "White"],
  //   SIZE: ["S", "M", "L", "XL", "XXL"],
  //   PRICE: ["Under 500", "500 - 1000", "1000 - 2000", "2000+"],
  // };

  const [openSections, setOpenSections] = useState({
    CATEGORY: true, GENDER: false, COLOR: false, SIZE: false, PRICE: false
  });

  const toggleSection = (name) => setOpenSections(prev => ({ ...prev, [name]: !prev[name] }));

  return (
    <div className="w-full">
      <div className="hidden lg:flex justify-between items-center mb-6">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Filter By</h2>
        <button onClick={clearAllFilters} className="text-[10px] font-bold text-gray-400 hover:text-black transition-colors underline underline-offset-4">RESET ALL</button>
      </div>

      {Object.entries(filterData).map(([filterName, options]) => (
        <div key={filterName} className="border-b border-gray-100 last:border-none">
          <button
            onClick={() => toggleSection(filterName)}
            className="w-full flex justify-between items-center py-4 group"
          >
            <span className="text-[10px] font-bold text-black uppercase tracking-[0.15em]">
              {filterName}
              {selectedFilters[filterName] && (
                <span className="ml-2 text-orange-500 text-[8px]">•</span>
              )}
            </span>
            <svg className={`w-3 h-3 text-gray-300 transition-transform duration-300 ${openSections[filterName] ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
          </button>

          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSections[filterName] ? "max-h-80 pb-4 opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="flex flex-col gap-3">
              {options.map((option) => {
                const isChecked = selectedFilters[filterName]?.includes(option);
                return (
                  <label key={option} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isChecked || false}
                      onChange={() => handleFilterChange(filterName, option)}
                      className="w-3.5 h-3.5 rounded-none border-gray-300 text-black focus:ring-0 accent-black"
                    />
                    <span className={`text-[11px] tracking-wide uppercase transition-colors ${isChecked ? "text-black font-bold" : "text-gray-400 group-hover:text-black"}`}>
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilterSidebar;