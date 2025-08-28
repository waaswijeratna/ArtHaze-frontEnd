// import { FaSearch } from "react-icons/fa";

// export default function SearchBar() {
//     return (
//         <div className="w-full max-w-md">
//             <div className="bg-secondary rounded-full flex items-center px-4 py-1.5 shadow-md">
//                 <input type="text" placeholder="Search..." className="bg-transparent outline-none px-3 w-full text-[#09202C]" />
//                 <FaSearch className="text-primary text-lg cursor-pointer" />
//             </div>
//         </div>
//     );
// }

"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSearchFilters } from "../SearchFilterContext";

export default function SearchBar() {
  const { tempFilters, setTempFilters, applyFilters } = useSearchFilters();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    const updatedTempFilters = { ...tempFilters, search: searchValue };
    setTempFilters(updatedTempFilters);
    applyFilters(updatedTempFilters);
    setSearchValue(""); // Clear input after search
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-secondary  rounded-full flex items-center px-4 py-1.5 shadow-md">
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="bg-transparent outline-none px-3 w-full text-[#09202C]"
        />
        <FaSearch 
          className="text-primary text-lg cursor-pointer" 
          onClick={handleSearch}
        />
      </div>
    </div>
  );
}
