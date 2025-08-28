"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react"; // 👈 added X icon
import { useSearchFilters } from "../SearchFilterContext";

export default function Filters() {
  const { tempFilters, setTempFilters, applyFilters, clearFilters } = useSearchFilters();
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = () => {
    applyFilters();
    setIsOpen(false);
  };

  const handleClear = () => {
    clearFilters();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Toggle Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-primary transition cursor-pointer"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-secondary" /> // 👈 Close icon when open
        ) : (
          <Filter className="w-5 h-5 text-secondary" /> // 👈 Filter icon when closed
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-primary text-white shadow-lg shadow-sm shadow-secondary/30 rounded-xl z-50 p-4 space-y-5">
          {/* Sort By Section */}
          <div>
            <h3 className="text-sm font-medium text-white mb-2">Sort By</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setTempFilters({ ...tempFilters, sortBy: "time", order: tempFilters.order || "asc" })}
                className={`flex-1 px-3 py-1 rounded-lg border transition cursor-pointer ${
                  tempFilters.sortBy === "time"
                    ? "bg-secondary text-fourth border-secondary"
                    : "border-gray-300 hover:bg-secondary/30"
                }`}
              >
                Time
              </button>
              <button
                onClick={() => setTempFilters({ ...tempFilters, sortBy: "name", order: tempFilters.order || "asc" })}
                className={`flex-1 px-3 py-1 rounded-lg border transition cursor-pointer ${
                  tempFilters.sortBy === "name"
                    ? "bg-secondary text-fourth border-secondary"
                    : "border-gray-300 hover:bg-secondary/30"
                }`}
              >
                Name
              </button>
            </div>
          </div>

          {/* Order Section */}
          <div>
            <h3 className="text-sm font-medium text-white mb-2">Order</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setTempFilters({ ...tempFilters, order: "asc" })}
                disabled={!tempFilters.sortBy}
                className={`flex-1 px-3 py-1 rounded-lg border transition cursor-pointer ${
                  tempFilters.order === "asc"
                    ? "bg-secondary text-fourth border-secondary"
                    : "border-gray-300 hover:bg-secondary/30"
                } ${!tempFilters.sortBy ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Asc
              </button>
              <button
                onClick={() => setTempFilters({ ...tempFilters, order: "desc" })}
                disabled={!tempFilters.sortBy}
                className={`flex-1 px-3 py-1 rounded-lg border transition cursor-pointer ${
                  tempFilters.order === "desc"
                    ? "bg-secondary text-fourth border-secondary "
                    : "border-gray-300 hover:bg-secondary/30"
                } ${!tempFilters.sortBy ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Desc
              </button>
            </div>
          </div>

          {/* User Section */}
          <div>
            <h3 className="text-sm font-medium text-white mb-2">User</h3>
            <input
              type="text"
              value={tempFilters.sortUser}
              onChange={(e) => setTempFilters({ ...tempFilters, sortUser: e.target.value })}
              placeholder="Type sortUser"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 rounded-lg bg-secondary text-fourth hover:secondary/30 transition cursor-pointer"
            >
              Apply
            </button>
            <button
              onClick={handleClear}
              className="flex-1 px-4 py-2 rounded-lg border  border-gray-300 hover:secondary/30 transition cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
