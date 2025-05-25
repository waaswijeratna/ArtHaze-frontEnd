import React, { useState, useEffect } from "react";
import { createAd, updateAd } from "@/services/advertisementsService";
import { Advertisements } from "@/types";
import ImageUploader from "../ImageUploader";

interface AdFormProps {
  initialData?: Advertisements;
  onClose: () => void;
}

export default function AdForm({ initialData, onClose }: AdFormProps) {
  const [formData, setFormData] = useState<Advertisements>({
    id: initialData?.id,
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    category: initialData?.category || "Paint", // Default category
    imageUrl: initialData?.imageUrl || "",
    userId: localStorage.getItem("userId") || "",
    contact: initialData?.contact || "",
    createdAt: initialData?.createdAt || "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Convert number inputs to string before storing
    if (name === "price" || name === "contact") {
      setFormData({ ...formData, [name]: value.toString() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, imageUrl: url });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (initialData) {
        if (!initialData.id) {
          console.error("Error: Ad ID is missing!");
          return;
        }
        await updateAd({ ...formData, id: initialData.id });
      } else {
        await createAd(formData);
      }
      
      // ✅ Close modal after successful submission
      onClose();
    } catch (error) {
      console.error("Error submitting ad:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-blac/30 backdrop-blur flex justify-center items-center z-100">
      <div className="bg-primary px-6 pb-6 rounded-lg w-[70vw] h-[90vh] overflow-y-auto scrollbar-hide">
        <h2 className="sticky top-0 py-4 bg-primary text-xl text-third font-bold mb-4">
          {initialData ? "Edit Ad" : "Create Ad"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="text-white w-full p-2 border border-secondary focus:outline-none focus:ring-2 focus:ring-third rounded"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="text-white w-full p-2 border rounded border-secondary focus:outline-none focus:ring-2 focus:ring-third"
          />

          {/* 🔹 Price & Contact in the Same Line */}
          <div className="flex space-x-3">
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="text-white w-1/2 p-2 border rounded border-secondary focus:outline-none focus:ring-2 focus:ring-third"
            />
            <input
              type="number"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Contact"
              className="text-white w-1/2 p-2 border rounded border-secondary focus:outline-none focus:ring-2 focus:ring-third"
            />
          </div>

          {/* 🔹 Category Selection Dropdown */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="text-white w-full p-2 border rounded border-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-third"
          >
            <option value="Paint">Paint</option>
            <option value="Sculpt">Sculpt</option>
            <option value="Digital">Digital</option>
            <option value="Acrylic">Acrylic</option>
            <option value="Mixed Media">Mixed Media</option>
          </select>

          <ImageUploader
            onUpload={handleImageUpload}
            onRemove={() => setFormData({ ...formData, imageUrl: "" })}
            initialImage={formData.imageUrl}
          />

          {/* 🔹 Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-fourth bg-gray-400 hover:bg-gray-300 duration-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer text-fourth bg-secondary hover:bg-third duration-300 px-4 py-2 rounded"
            >
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
