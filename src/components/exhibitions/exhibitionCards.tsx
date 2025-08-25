/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getExhibitionsWithGalleryInfo } from "@/services/exhibitionService";
import UserProfileCard from "@/components/UserProfileCard";

interface ExhibitionCardData {
    _id: string;
    name: string;
    userId: string;
    gallery: {
        name: string;
        image: string;
    };
}

export default function ExhibitionCards() {
    const router = useRouter();
    const [exhibitions, setExhibitions] = useState<ExhibitionCardData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getExhibitionsWithGalleryInfo();
                setExhibitions(data);
            } catch (error) {
                console.error("Failed to load exhibitions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCardClick = (id: string) => {
        router.push(`/exhibitionsGallery?id=${id}`);
    };

    if (loading) {
        return <p className="text-center text-white">Loading exhibitions...</p>;
    }

    return (
        <div className="w-full h-[84vh] overflow-y-auto scrollbar-hide ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                {exhibitions.map((data) => (
                    <div
                        key={data._id}
                        className="max-w-sm mx-auto bg-primary shadow-lg rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => handleCardClick(data._id)}
                    >
                        {/* Exhibition Name */}
                        <div className="px-4 py-2">
                            <h2 className="text-lg font-bold text-white">{data.name}</h2>
                        </div>

                        {/* Image with Overlay */}
                        <div className="relative">
                            <img
                                src={data.gallery.image}
                                alt={data.name}
                                className="w-68 h-48 object-cover"
                            />
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-2">
                                <p className="text-white font-semibold">Gallery - {data.gallery.name}</p>
                            </div>
                        </div>

                        {/* Exhibition By */}
                        <div className="px-4 py-2">
                            <UserProfileCard userId={data.userId} />
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
