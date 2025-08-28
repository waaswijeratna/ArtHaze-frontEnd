/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteExhibition, getExhibitionsByUserId } from "@/services/exhibitionService";
import UserProfileCard from "@/components/UserProfileCard";
import { useSearchFilters } from "@/components/SearchFilterContext";
import { FaEdit, FaTrash } from "react-icons/fa";

interface ExhibitionCardData {
  _id: string;
  name: string;
  userId: string;
  date: string;       // ISO string from backend
  time: string;       // "HH:mm"
  artImages: string[];
  gallery: {
    _id: string;
    name: string;
    image: string;
    modelUrl?: string;
    maxArts?: number;
  };
}

interface ExhibitionCardsProps {
  onEdit: (exhibition: ExhibitionCardData) => void;
  refreshKey?: number; // bump from parent to refetch
}

export default function ExhibitionCards({ onEdit, refreshKey = 0 }: ExhibitionCardsProps) {
  const router = useRouter();
  const [exhibitions, setExhibitions] = useState<ExhibitionCardData[]>([]);
  const [loading, setLoading] = useState(true);

  const { filters } = useSearchFilters();

  const fetchData = async () => {
    try {
      const data = await getExhibitionsByUserId(filters);
      setExhibitions(data);
    } catch (error) {
      console.error("Failed to load exhibitions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [refreshKey, filters]);

  const handleCardClick = (id: string) => {
    router.push(`/exhibitionsGallery?id=${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this exhibition?")) return;
    try {
      await deleteExhibition(id);
      setExhibitions((prev) => prev.filter((ex) => ex._id !== id));
    } catch (error) {
      console.error("Failed to delete exhibition:", error);
    }
  };

  if (loading) {
    return <p className="text-center text-white">Loading exhibitions...</p>;
  }

  return (
    <div className="w-full h-[74vh] overflow-y-auto scrollbar-hide">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        {exhibitions.map((data) => (
          <div
            key={data._id}
            className="relative max-w-sm mx-auto bg-primary shadow-lg rounded-lg overflow-hidden"
          >
            {/* Edit/Delete Icons */}
            <div className="absolute top-2 right-2 flex gap-2 z-10">
              <button
                onClick={() => onEdit(data)}
                className="p-2 bg-secondary text-white rounded-full hover:bg-blue-700 cursor-pointer"
                aria-label="Edit exhibition"
                title="Edit"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(data._id)}
                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 cursor-pointer" 
                aria-label="Delete exhibition"
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>

            {/* Exhibition Info */}
            <div onClick={() => handleCardClick(data._id)} className="cursor-pointer">
              <div className="px-4 py-2">
                <h2 className="text-lg font-bold text-white">{data.name}</h2>
              </div>

              <div className="relative">
                <img
                  src={data.gallery?.image}
                  alt={`${data.gallery?.name || "Gallery"} cover`}
                  className="w-68 h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-2">
                  <p className="text-white font-semibold">Gallery - {data.gallery?.name}</p>
                </div>
              </div>

              <div className="px-4 py-2">
                <UserProfileCard userId={data.userId} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
