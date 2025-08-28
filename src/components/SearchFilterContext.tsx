"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

type FilterState = {
  search: string;
  sortBy: "time" | "name" | null;
  order: "asc" | "desc" | null;
  sortUser: string;
};

type ContextType = {
  filters: FilterState; // Applied filters
  tempFilters: FilterState; // Temporary filters (for editing)
  setTempFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  applyFilters: (filtersToApply?: FilterState) => void;
  clearFilters: () => void;
  resetAllFilters: () => void; // New method for section changes
};

const SearchFilterContext = createContext<ContextType | undefined>(undefined);

export function SearchFilterProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Get current route
  
  const initialState: FilterState = {
    search: "",
    sortBy: null,
    order: null,
    sortUser: "",
  };

  const [filters, setFilters] = useState<FilterState>(initialState);
  const [tempFilters, setTempFilters] = useState<FilterState>(initialState);

  // Clear filters when route changes
  useEffect(() => {
    const clearedState = {
      search: "",
      sortBy: null,
      order: null,
      sortUser: "",
    };
    setTempFilters(clearedState);
    setFilters(clearedState);
  }, [pathname]); // Runs whenever pathname changes

  const applyFilters = (filtersToApply?: FilterState) => {
    const finalFilters = filtersToApply || tempFilters;
    setFilters({ ...finalFilters });
    console.log("Applied Filters:", finalFilters);
  };

  const clearFilters = () => {
    const clearedState = {
      search: "",
      sortBy: null,
      order: null,
      sortUser: "",
    };
    setTempFilters(clearedState);
    setFilters(clearedState);
  };

  const resetAllFilters = () => {
    const clearedState = {
      search: "",
      sortBy: null,
      order: null,
      sortUser: "",
    };
    setTempFilters(clearedState);
    setFilters(clearedState);
  };

  return (
    <SearchFilterContext.Provider 
      value={{ 
        filters, 
        tempFilters, 
        setTempFilters, 
        applyFilters, 
        clearFilters,
        resetAllFilters 
      }}
    >
      {children}
    </SearchFilterContext.Provider>
  );
}

export function useSearchFilters() {
  const context = useContext(SearchFilterContext);
  if (!context) throw new Error("useSearchFilters must be used within SearchFilterProvider");
  return context;
}