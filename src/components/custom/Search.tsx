import React from "react";
import { IoSearchOutline } from "react-icons/io5";

function SearchPopUp({setShowPopup, setIsCollapsed}:{ setShowPopup: (value: boolean) => void,
  setIsCollapsed: (value: boolean) => void}) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Search</h2>
        <button
          onClick={() => {
            setShowPopup(false);
            setIsCollapsed(false);
          }}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 pl-4 focus:outline-none focus:ring-2 focus:ring-gray-600"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <button className="text-gray-400 hover:text-white">
            <IoSearchOutline className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Recent Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent</h3>
          <button className="text-blue-400 hover:text-blue-300 text-sm">
            Clear all
          </button>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-400">No recent searches.</p>
        </div>
      </div>
    </div>
  );
}

export default SearchPopUp;
