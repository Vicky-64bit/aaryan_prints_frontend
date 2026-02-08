import React, { useState, useEffect, useRef } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { FiBox } from "react-icons/fi"; // placeholder icon
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFilters } from "../../redux/slice/productSlice";

const MAX_RECENTS = 10;
const MAX_SUGGESTIONS = 5;

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sheetRef = useRef(null);

  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    setRecentSearches(stored);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (!isOpen || !sheetRef.current) return;

    let startY = 0;
    const touchStart = (e) => (startY = e.touches[0].clientY);
    const touchMove = (e) => {
      const delta = e.touches[0].clientY - startY;
      if (delta > 120) setIsOpen(false);
    };
    const el = sheetRef.current;
    el.addEventListener("touchstart", touchStart);
    el.addEventListener("touchmove", touchMove);
    return () => {
      el.removeEventListener("touchstart", touchStart);
      el.removeEventListener("touchmove", touchMove);
    };
  }, [isOpen]);

  const filteredSuggestions = searchTerm
    ? products
        .filter((p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, MAX_SUGGESTIONS)
    : [];

  const combinedSuggestions =
    searchTerm.trim() === "" ? recentSearches : filteredSuggestions;

  const handleKeyDown = (e) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < combinedSuggestions.length - 1 ? prev + 1 : 0
      );
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : combinedSuggestions.length - 1
      );
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < combinedSuggestions.length) {
        const selected = searchTerm.trim() === "" 
          ? combinedSuggestions[highlightedIndex] 
          : combinedSuggestions[highlightedIndex].name;
        handleSearch(selected);
      } else {
        handleSearch(searchTerm);
      }
    }
  };

  const handleSearch = (term) => {
    if (!term.trim()) return;

    let updated = [term, ...recentSearches.filter((t) => t !== term)];
    if (updated.length > MAX_RECENTS) updated = updated.slice(0, MAX_RECENTS);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
    setRecentSearches(updated);

    dispatch(setFilters({ search: term }));
    navigate(`/collections/all?search=${term}`);
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  const renderSuggestion = (item, idx) => {
    const name = searchTerm.trim() === "" ? item : item.name;
    const img = searchTerm.trim() === "" ? null : item.image;
    const category = searchTerm.trim() === "" ? null : item.category;

    return (
      <button
        key={idx}
        onClick={() => handleSearch(name)}
        className={`flex items-center gap-3 w-full text-left px-4 py-2 transition transform rounded hover:scale-105 hover:bg-orange-50 hover:text-orange-500 duration-150
          ${highlightedIndex === idx ? "bg-orange-50 text-orange-500 scale-105" : ""}
        `}
      >
        {img ? (
          <img
            src={img}
            alt={name}
            className="h-10 w-10 object-cover rounded-lg shadow-sm"
          />
        ) : (
          <div className="h-10 w-10 flex items-center justify-center bg-gray-200 rounded-lg">
            <FiBox className="h-6 w-6 text-gray-400" />
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
          {category && <span className="text-xs text-gray-400">{category}</span>}
        </div>
      </button>
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open Search"
        className="flex items-center justify-center hover:scale-110 transition-transform"
      >
        <HiMagnifyingGlass className="h-5 w-5 text-orange-500" />
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-md"
        >
          {/* Desktop */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="hidden md:flex w-full justify-center px-4"
          >
            <div className="w-full max-w-3xl bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 animate-fadeIn mt-[120px] relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-orange-500 transition"
              >
                <HiMiniXMark className="h-6 w-6" />
              </button>

              <div className="relative">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch(searchTerm);
                  }}
                  className="flex items-center gap-4"
                >
                  <HiMagnifyingGlass className="h-6 w-6 text-orange-500" />
                  <input
                    autoFocus
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    type="text"
                    placeholder="Search products, categories..."
                    className="w-full bg-transparent outline-none text-lg placeholder-gray-500"
                  />
                </form>

                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg max-h-80 overflow-y-auto z-50">
                  {combinedSuggestions.length === 0 && (
                    <div className="px-4 py-2 text-gray-400">No results</div>
                  )}
                  {combinedSuggestions.map(renderSuggestion)}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Sheet */}
          <div
            ref={sheetRef}
            onClick={(e) => e.stopPropagation()}
            className="md:hidden absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-2xl p-5 animate-slideUp"
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <div className="relative">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch(searchTerm);
                }}
                className="flex items-center gap-3"
              >
                <HiMagnifyingGlass className="h-5 w-5 text-orange-500" />
                <input
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  type="text"
                  placeholder="Search..."
                  className="w-full outline-none text-base"
                />
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <HiMiniXMark className="h-6 w-6" />
                </button>
              </form>

              <div className="mt-2 bg-white rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {combinedSuggestions.map(renderSuggestion)}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;
