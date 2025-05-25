import React, { useEffect, useState } from "react";
import AdCard from "./AdCard";
import { getUserAds, deleteAd } from "@/services/advertisementsService";
import { Advertisements } from "@/types";
import AdForm from "./AdForm";

export default function MyAdsSection() {
  const [ads, setAds] = useState<Advertisements[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisements | undefined>(undefined);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    const userAds = await getUserAds();
    if (userAds) {
      setAds(userAds);
    }
  };

  const handleDelete = async (id: string) => {
    if (await deleteAd(id)) {
      setAds(ads.filter((ad) => ad.id !== id));
    }
  };

  const handleEdit = (ad: Advertisements) => {
    setEditingAd(ad);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setEditingAd(undefined);
    setShowForm(false);
    fetchAds(); // Refresh ads after edit or create
  };

  return (
    <div className="h-full w-full overflow-auto scrollbar-hide">
      <button onClick={() => setShowForm(true)} className="bg-secondary hover:bg-third duration-300 cursor-pointer text-fourths px-4 py-2 rounded-md my-4">
        Create Ad
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {ads.map((ad) => (
          <AdCard key={ad.id} ad={ad} onEdit={handleEdit} onDelete={handleDelete} myAds={true}/>
        ))}
      </div>

      {showForm && <AdForm initialData={editingAd} onClose={handleFormClose} />}
    </div>
  );
}
