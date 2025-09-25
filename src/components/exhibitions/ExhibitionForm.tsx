/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ImageUploader from "../ImageUploader";
import { submitExhibitionForm, updateExhibition } from "../../services/exhibitionService";
import { fetchGalleries } from "../../services/galleriesService";
import Snackbar from "@/components/Snackbar";

interface ExhibitionFormProps {
  initialData?: any;            // data when editing
  onSubmitSuccess?: () => void; // callback to refresh parent
}

interface FormValues {
  name: string;
  gallery: string;
  artImages: string[];
  date: string;
  time: string;
}

export default function ExhibitionForm({ initialData, onSubmitSuccess }: ExhibitionFormProps) {
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: initialData?.name || "",
      gallery: initialData?.gallery?._id || "",
      artImages: initialData?.artImages || [],
      date: initialData?.date ? initialData.date.split("T")[0] : "",
      time: initialData?.time || "",
    },
  });

  const [galleryList, setGalleryList] = useState<any[]>([]);
  const [snackbar, setSnackbar] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error";
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const selectedGalleryId = watch("gallery");
  const artImages = watch("artImages");
  const date = watch("date");

  const today = new Date().toISOString().split("T")[0];
  const getCurrentTime = () => new Date().toTimeString().slice(0, 5);
  const isToday = date === today;

  const selectedGallery = galleryList.find((g) => g._id === selectedGalleryId);
  const maxArts = selectedGallery?.maxArts || 0;

  useEffect(() => {
    fetchGalleries()
      .then(setGalleryList)
      .catch((err: any) => console.error("Failed to load galleries", err));
  }, []);

  const handleUpload = (url: string) => {
    if (!maxArts || artImages.length < maxArts) {
      const updated = [...artImages, url];
      setValue("artImages", updated, { shouldValidate: true });
      trigger("artImages");
    }
  };

  const handleRemove = (index: number) => {
    const updated = artImages.filter((_, i) => i !== index);
    setValue("artImages", updated, { shouldValidate: true });
    trigger("artImages");
  };

  const onSubmit = async (data: FormValues) => {
    try {
      if (isEditMode) {
        await updateExhibition(initialData._id, data);
        setSnackbar({
          isOpen: true,
          message: "Exhibition updated successfully!",
          type: "success",
        });
      } else {
        await submitExhibitionForm(data);
        setSnackbar({
          isOpen: true,
          message: "Exhibition created successfully!",
          type: "success",
        });
      }
      setTimeout(() => {
        onSubmitSuccess?.();
      }, 1000);
    } catch (error) {
      setSnackbar({
        isOpen: true,
        message: `Failed to ${isEditMode ? "update" : "create"} exhibition. Please try again.`+error,
        type: "error",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-primary text-white rounded-2xl max-w-xl mx-auto p-6 space-y-6 h-[90vh] overflow-y-auto scrollbar-hide"
    >
      {/* Name */}
      <div>
        <label className="block font-bold mb-1">Name</label>
        <input
          type="text"
          className={`w-full p-2 border rounded ${
            errors.name ? "border-red-500" : ""
          }`}
          {...register("name", { required: "Name is required." })}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      {/* Gallery */}
      {!isEditMode ? (
        <div>
          <label className="block font-bold mb-2">Select Gallery</label>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {galleryList.map((gallery) => (
              <div
                key={gallery._id}
                className={`cursor-pointer border rounded-lg p-2 transition hover:scale-105 ${
                  selectedGalleryId === gallery._id ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => {
                  setValue("gallery", gallery._id, { shouldValidate: true });
                  setValue("artImages", [], { shouldValidate: true });
                }}
              >
                <img src={gallery.image} alt={gallery.name} className="w-32 h-32 object-cover rounded-md" />
                <p className="text-center mt-2 font-semibold">{gallery.name}</p>
                <p className="text-center text-sm text-gray-500">Max {gallery.maxArts} arts</p>
              </div>
            ))}
          </div>
          <input type="hidden" {...register("gallery", { required: "Gallery is required." })} />
          {errors.gallery && <p className="text-red-500 text-sm mt-1">{errors.gallery.message}</p>}
        </div>
      ) : (
        selectedGalleryId && (
          <div className="border rounded-lg p-3 bg-gray-50 text-black">
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
              onUpload={(updatedUrl) => {
                const updated = artImages.map((img, i) => (i === index ? updatedUrl : img));
                setValue("artImages", updated, { shouldValidate: true });
                trigger("artImages");
              }}
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
        <input
          type="hidden"
          {...register("artImages", { validate: (value) => value.length > 0 || "At least one image is required." })}
        />
        {errors.artImages && <p className="text-red-500 text-sm mt-1">{errors.artImages.message as string}</p>}
      </div>

      {/* Date */}
      <div>
        <label className="block font-bold mb-1">Date</label>
        <input
          type="date"
          className={`w-full p-2 border rounded ${errors.date ? "border-red-500" : ""}`}
          {...register("date", {
            required: "Date is required.",
            validate: (value) => new Date(value) >= new Date(today) || "Date cannot be in the past.",
          })}
        />
        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
      </div>

      {/* Time */}
      <div>
        <label className="block font-bold mb-1">Time</label>
        <input
          type="time"
          className={`w-full p-2 border rounded ${errors.time ? "border-red-500" : ""}`}
          disabled={!date}
          min={isToday ? getCurrentTime() : undefined}
          {...register("time", {
            required: "Time is required.",
            validate: (value) =>
              !isToday || value >= getCurrentTime() || "Time cannot be in the past.",
          })}
        />
        {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full text-white py-2 rounded transition bg-blue-600 hover:bg-blue-700"
      >
        {isEditMode ? "Update Exhibition" : "Create Exhibition"}
      </button>

      {/* Snackbar */}
      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))}
      />
    </form>
  );
}
