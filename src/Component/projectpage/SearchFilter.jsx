import React, { useState } from "react";

const SearchFilter = ({ view, setView }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col lg:flex-row justify-between items-center border-b border-gray-300 py-4 px-4 lg:px-10 bg-white">
      {/* Search Input Section */}
      <div className="w-full lg:w-1/3 mb-4 lg:mb-0">
        <div className="relative">
          <input
            type="text"
            className="w-full lg:w-120 border border-gray-300 rounded-lg py-2 pl-2 pr-4 text-sm outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter + View Buttons */}
      <div className="flex items-center gap-3">
        {/* List View Button */}
        <button
          className={`p-2 rounded-lg ${
            view === "list"
              ? "text-white bg-[#FF4713]"
              : "text-black border border-gray-300 bg-white"
          } hover:bg-orange-600 transition-all`}
          title="List View"
          onClick={() => setView("list")}
        >
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 4.5h10a2 2 0 012 2v3a2 2 0 01-2 2H3a2 2 0 01-2-2v-3a2 2 0 012-2zm0 1a1 1 0 00-1 1v3a1 1 0 001 1h10a1 1 0 001-1v-3a1 1 0 00-1-1H3zM1 2a.5.5 0 01.5-.5h13a.5.5 0 010 1h-13A.5.5 0 011 2zm0 12a.5.5 0 01.5-.5h13a.5.5 0 010 1h-13A.5.5 0 011 14z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Grid View Button */}
        <button
          className={`p-2 rounded-lg ${
            view === "grid"
              ? "text-white bg-[#FF4713]"
              : "text-black border border-gray-300 bg-white"
          } hover:bg-orange-600 transition-all`}
          title="Grid View"
          onClick={() => setView("grid")}
        >
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zM2.5 2a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zm6.5.5A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm1.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zM1 10.5A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm1.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zm6.5.5A1.5 1.5 0 0110.5 9h3a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 13.5v-3zm1.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;
