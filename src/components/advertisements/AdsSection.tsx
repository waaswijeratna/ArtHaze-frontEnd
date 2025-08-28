import React, { useEffect, useState, useCallback } from "react";
import AdCard from "./AdCard";
import { getAllAds } from "@/services/advertisementsService";
import { Advertisements } from "@/types";
import { useSearchFilters } from "@/components/SearchFilterContext";

export default function AdsSection() {
  const [ads, setAds] = useState<Advertisements[]>([]);
  const { filters } = useSearchFilters();

  const fetchAds = useCallback(async () => {
    const allAds = await getAllAds(filters);
    if (allAds) {
      setAds(allAds);
    }
  }, [filters]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  return (
    <div className="h-full w-full overflow-auto scrollbar-hide">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {ads.map((ad) => (
          <AdCard key={ad.id} ad={ad} onEdit={() => {}} onDelete={() => {}} myAds={false} />
        ))}
      </div>
    </div>
  );
}
