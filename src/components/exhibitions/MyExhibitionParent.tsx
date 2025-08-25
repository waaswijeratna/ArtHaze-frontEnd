/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import ExhibitionCards from "@/components/exhibitions/MyExhibitionCards";
import MyExhibitionForm from "@/components/exhibitions/ExhibitionForm";

export default function MyExhibitionsParent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editExhibition, setEditExhibition] = useState<any | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateClick = () => {
    setEditExhibition(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (exhibition: any) => {
    setEditExhibition(exhibition);
    setIsModalOpen(true);
  };

  const handleSubmitSuccess = () => {
    // close modal, clear edit, and refresh list
    setIsModalOpen(false);
    setEditExhibition(null);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="">
      {/* Create Exhibition Button */}
      <div className="flex mb-2">
        <button
          onClick={handleCreateClick}
          className="px-4 py-2 bg-secondary text-black rounded hover:bg-primary hover:text-white duration-300 my-2 cursor-pointer"
        >
          Create Exhibition
        </button>
      </div>

      {/* Cards (refetch when refreshKey changes) */}
      <ExhibitionCards onEdit={handleEditClick} refreshKey={refreshKey} />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur z-50">
          <div className=" rounded-2xl  w-full max-w-lg relative ">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-white"
              aria-label="Close"
              title="Close"
            >
              ✕
            </button>

            <MyExhibitionForm
              initialData={editExhibition}
              onSubmitSuccess={handleSubmitSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}
