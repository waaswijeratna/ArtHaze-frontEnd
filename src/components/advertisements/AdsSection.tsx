import React, { useEffect, useState } from "react";
import AdCard from "./AdCard";
import { getAllAds } from "@/services/advertisementsService"; // Assuming this function fetches all ads
import { Advertisements } from "@/types";

export default function AdsSection() {
  const [ads, setAds] = useState<Advertisements[]>([]);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    const allAds = await getAllAds(); // Fetching all ads
    if (allAds) {
      setAds(allAds);
    }
  };

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
