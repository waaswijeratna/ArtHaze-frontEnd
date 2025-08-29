/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import ImageUploader from "../ImageUploader";
import { submitExhibitionForm, updateExhibition } from "../../services/exhibitionService";
import { fetchGalleries } from "../../services/galleriesService";
import Snackbar from "@/components/Snackbar";

interface ExhibitionFormProps {
  initialData?: any;           // data when editing
  onSubmitSuccess?: () => void; // callback to refresh parent
}

export default function ExhibitionForm({ initialData, onSubmitSuccess }: ExhibitionFormProps) {
  const isEditMode = !!initialData;

  // sync state when initialData changes (important when opening modal for different items)
  const [name, setName] = useState(initialData?.name || "");
  const [galleryList, setGalleryList] = useState<any[]>([]);
  const [selectedGalleryId, setSelectedGalleryId] = useState<string>(initialData?.gallery?._id || "");
  const [artImages, setArtImages] = useState<string[]>(initialData?.artImages || []);
  const [date, setDate] = useState(initialData?.date ? initialData.date.split("T")[0] : "");
  const [time, setTime] = useState(initialData?.time || "");

  useEffect(() => {
    setName(initialData?.name || "");
    setSelectedGalleryId(initialData?.gallery?._id || "");
    setArtImages(initialData?.artImages || []);
    setDate(initialData?.date ? initialData.date.split("T")[0] : "");
    setTime(initialData?.time || "");
  }, [initialData]);

  const [errors, setErrors] = useState({ name: "", images: "", date: "", time: "" });
  const [isValid, setIsValid] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    message: '',
    type: 'success'
  });

  const selectedGallery = galleryList.find((g) => g._id === selectedGalleryId);
  const maxArts = selectedGallery?.maxArts || 0;

  const today = new Date().toISOString().split("T")[0];
  const getCurrentTime = () => new Date().toTimeString().slice(0, 5);
  const isToday = date === today;

  useEffect(() => {
    fetchGalleries()
      .then(setGalleryList)
      .catch((err: any) => console.error("Failed to load galleries", err));
  }, []);

  useEffect(() => {
    const newErrors = {
      name: name.trim() ? "" : "Name is required.",
      images: artImages.length === 0 ? "At least one image is required." : "",
      date: !date ? "Date is required." : (new Date(date) < new Date(today) ? "Date cannot be in the past." : ""),
      time: !time ? "Time is required." : (isToday && time < getCurrentTime() ? "Time cannot be in the past." : "")
    };

    setErrors(newErrors);
    setIsValid(Object.values(newErrors).every((msg) => msg === ""));
  }, [name, artImages, date, time]);

  const handleUpload = (url: string) => {
    if (!maxArts || artImages.length < maxArts) {
      setArtImages((prev) => [...prev, url]);
    }
  };

  const handleRemove = (index: number) => {
    setArtImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const formData = {
      name,
      gallery: selectedGalleryId, // gallery is locked in edit mode but still sent for completeness
      artImages,
      date,
      time,
    };

    try {
      let response;
      if (isEditMode) {
        response = await updateExhibition(initialData._id, formData);
        setSnackbar({
          isOpen: true,
          message: "Exhibition updated successfully!",
          type: 'success'
        });
      } else {
        response = await submitExhibitionForm(formData);
        setSnackbar({
          isOpen: true,
          message: "Exhibition created successfully!",
          type: 'success'
        });
      }
      setTimeout(() => {
        onSubmitSuccess?.();
      }, 1500);
    } catch {
      setSnackbar({
        isOpen: true,
        message: `Failed to ${isEditMode ? 'update' : 'create'} exhibition. Please try again.`,
        type: 'error'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-primary text-white rounded-2xl max-w-xl mx-auto p-6 space-y-6 h-[90vh] overflow-y-auto scrollbar-hide">
      {/* Name */}
      <div>
        <label className="block font-bold mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Gallery: user cannot change gallery in edit mode */}
      {!isEditMode ? (
        <div>
          <label className="block font-bold mb-2 scrollbar-hide">Select Gallery</label>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {galleryList.map((gallery) => (
              <div
                key={gallery._id}
                className={`cursor-pointer border rounded-lg p-2 transition hover:scale-105 ${
                  selectedGalleryId === gallery._id ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => {
                  setSelectedGalleryId(gallery._id);
                  setArtImages([]);
                }}
              >
                <img src={gallery.image} alt={gallery.name} className="w-32 h-32 object-cover rounded-md" />
                <p className="text-center mt-2 font-semibold">{gallery.name}</p>
                <p className="text-center text-sm text-gray-500">Max {gallery.maxArts} arts</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // optional: show locked gallery info in edit mode
        selectedGalleryId && (
          <div className="border rounded-lg p-3 bg-gray-50">
            <p className="font-bold mb-2">Gallery</p>
            <div className="flex items-center gap-3">
              <img
                src={initialData?.gallery?.image}
                alt={initialData?.gallery?.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div>
                <p className="font-semibold">{initialData?.gallery?.name}</p>
                {typeof initialData?.gallery?.maxArts === "number" && (
                  <p className="text-sm text-gray-600">Max {initialData.gallery.maxArts} arts</p>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Gallery cannot be changed when editing.</p>
          </div>
        )
      )}

      {/* Uploads */}
      <div>
        <label className="block font-bold mb-2">
          Upload Arts ({artImages.length}{maxArts ? ` / ${maxArts}` : ""})
        </label>
        <div className="grid grid-cols-3 gap-4">
          {artImages.map((url, index) => (
            <ImageUploader
              key={index}
              initialImage={url}
              onUpload={(updatedUrl) =>
                setArtImages((prev) => prev.map((img, i) => (i === index ? updatedUrl : img)))
              }
              onRemove={() => handleRemove(index)}
            />
          ))}
          {(!maxArts || artImages.length < maxArts) && (
            <ImageUploader
              key={`uploader-${artImages.length}`}
              onUpload={handleUpload}
              onRemove={() => {}}
            />
          )}
        </div>
        {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
      </div>

      {/* Date */}
      <div>
        <label className="block font-bold mb-1">Date</label>
        <input
          type="date"
          value={date}
          min={today}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
      </div>

      {/* Time */}
      <div>
        <label className="block font-bold mb-1">Time</label>
        <input
          type="time"
          value={time}
          disabled={!date}
          min={isToday ? getCurrentTime() : undefined}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-2 border rounded disabled:bg-gray-100"
        />
        {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid}
        className={`w-full text-white py-2 rounded transition ${
          isValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {isEditMode ? "Update Exhibition" : "Create Exhibition"}
      </button>

      {/* Snackbar for notifications */}
      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar(prev => ({ ...prev, isOpen: false }))}
      />
    </form>
  );
}
