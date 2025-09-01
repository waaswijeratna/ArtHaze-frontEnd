/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getExhibitionsByUserId } from "@/services/exhibitionService";
import UserProfileCard from "@/components/UserProfileCard";
import { useSearchFilters } from "@/components/SearchFilterContext";

interface ExhibitionCardData {
  _id: string;
  name: string;
  userId: string;
  date: string;
  time: string;
  artImages: string[];
  gallery: {
    _id: string;
    name: string;
    image: string;
    modelUrl?: string;
    maxArts?: number;
  };
}

interface UserExhibitionCardsProps {
  userId: string;
}

export default function UserExhibitionCards({ userId }: UserExhibitionCardsProps) {
  const router = useRouter();
  const [exhibitions, setExhibitions] = useState<ExhibitionCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const { filters } = useSearchFilters();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getExhibitionsByUserId(userId, filters);
        setExhibitions(data);
      } catch (error) {
        console.error("Failed to load exhibitions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, filters]);

  const handleCardClick = (id: string) => {
    router.push(`/exhibitionsGallery?id=${id}`);
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
