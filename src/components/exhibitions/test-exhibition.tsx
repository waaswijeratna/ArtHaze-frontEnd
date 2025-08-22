"use client";

import React, { useEffect, useState } from "react";
import { getExhibitionDetailsById } from "@/services/exhibitionService"; // adjust path to your service file

interface Exhibition {
  _id: string;
  name: string;
  gallery: {
    _id: string;
    modelUrl: string;
  };
  artImages: string[];
}

const TestExhibition: React.FC = () => {
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // 👉 replace "68a83ee67d8fb10fbfe42e18" with the id you want to test
        const data = await getExhibitionDetailsById("68a83ee67d8fb10fbfe42e18");
        setExhibition(data);
      } catch (err) {
        console.error("Failed to load exhibition details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (!exhibition) {
    return <p className="text-center text-red-500">No exhibition found</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-2xl">
      {/* Exhibition name */}
      <h1 className="text-2xl font-bold mb-4">{exhibition.name}</h1>

      {/* Gallery model path */}
      <div className="mb-4">
        <h2 className="font-semibold">3D Model Path:</h2>
        <p className="text-sm text-gray-600">{exhibition.gallery.modelUrl}</p>
      </div>

      {/* Art images */}
      <div>
        <h2 className="font-semibold mb-2">Artworks:</h2>
        <div className="grid grid-cols-2 gap-4">
          {exhibition.artImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Artwork ${idx + 1}`}
              className="w-full h-40 object-cover rounded-lg shadow-sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestExhibition;
