import React, { useState, useEffect } from "react";
import { createAd, updateAd } from "@/services/advertisementsService";
import { Advertisements } from "@/types";
import ImageUploader from "../ImageUploader";
import Snackbar from "../Snackbar";
import { useAuthStore } from "@/store/authStore";

interface AdFormProps {
  initialData?: Advertisements;
  onClose: () => void;
}

export default function AdForm({ initialData, onClose }: AdFormProps) {
  const authUser = useAuthStore((state) => state.user);

  const [formData, setFormData] = useState<Advertisements>({
    id: initialData?.id,
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    category: initialData?.category || "Paint", // Default category
    imageUrl: initialData?.imageUrl || "",
    userId: authUser?.id || "",
    contact: initialData?.contact || "",
    createdAt: initialData?.createdAt || "",
  });

  const [touched, setTouched] = useState({
    name: false,
    description: false,
    price: false,
    category: false,
    imageUrl: false,
    contact: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    contact: "",
  });

  const [isValid, setIsValid] = useState(false);

  const [snackbar, setSnackbar] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error";
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const newErrors = {
      name: formData.name.trim() ? "" : "Name is required.",
      description: formData.description.trim()
        ? ""
        : "Description is required.",
      price: Number(formData.price) > 0 ? "" : "Price must be greater than 0.",
      category: formData.category ? "" : "Category is required.",
      imageUrl: formData.imageUrl ? "" : "Image is required.",
      contact: formData.contact.trim()
        ? ""
        : "Contact information is required.",
    };

    setErrors(newErrors);
    setIsValid(Object.values(newErrors).every((msg) => msg === ""));
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, imageUrl: url });
    setTouched((prev) => ({ ...prev, imageUrl: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      description: true,
      price: true,
      category: true,
      imageUrl: true,
      contact: true,
    });

    if (!isValid) return;

    try {
      if (initialData) {
        if (!initialData.id) {
          setSnackbar({
            isOpen: true,
            message: "Error: Advertisement ID is missing!",
            type: "error",
          });
          return;
        }
        const result = await updateAd({ ...formData, id: initialData.id });
        if (result) {
          setSnackbar({
            isOpen: true,
            message: "Advertisement updated successfully!",
            type: "success",
          });
          setTimeout(() => onClose(), 1500);
        }
      } else {
        const result = await createAd(formData);
        if (result) {
          setSnackbar({
            isOpen: true,
            message: "Advertisement created successfully!",
            type: "success",
          });
          setTimeout(() => onClose(), 1500);
        }
      }
    } catch (error) {
      setSnackbar({
        isOpen: true,
        message:
          "Error submitting advertisement. Please try again. " + String(error),
        type: "error",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-blac/30 backdrop-blur flex justify-center items-center z-100">
      <div className="bg-primary px-6 pb-6 rounded-lg w-[70vw] h-[90vh] overflow-y-auto scrollbar-hide">
        <h2 className="sticky top-0 py-4 bg-primary text-xl text-third font-bold mb-4">
          {initialData ? "Edit Ad" : "Create Ad"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name */}
          <div>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur("name")}
              placeholder="Name"
              className="text-white w-full p-2 border border-secondary focus:outline-none focus:ring-2 focus:ring-third rounded"
            />
            {touched.name && errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={() => handleBlur("description")}
              placeholder="Description"
              className="text-white w-full p-2 border rounded border-secondary focus:outline-none focus:ring-2 focus:ring-third"
            />
            {touched.description && errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Price & Contact */}
          <div className="flex space-x-3">
            <div className="w-1/2">
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                onBlur={() => handleBlur("price")}
                placeholder="Price (USD)"
                className="text-white w-full p-2 border rounded border-secondary focus:outline-none focus:ring-2 focus:ring-third"
              />
              {touched.price && errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>
            <div className="w-1/2">
              <input
                type="number"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                onBlur={() => handleBlur("contact")}
                placeholder="Contact"
                className="text-white w-full p-2 border rounded border-secondary focus:outline-none focus:ring-2 focus:ring-third"
              />
              {touched.contact && errors.contact && (
                <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              onBlur={() => handleBlur("category")}
              className="text-white w-full p-2 border rounded border-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-third"
            >
              <option value="Paint">Paint</option>
              <option value="Sculpt">Sculpt</option>
              <option value="Digital">Digital</option>
              <option value="Acrylic">Acrylic</option>
              <option value="Mixed Media">Mixed Media</option>
            </select>
            {touched.category && errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {/* Image */}
          <div>
            <ImageUploader
              onUpload={handleImageUpload}
              onRemove={() => {
                setFormData({ ...formData, imageUrl: "" });
                setTouched((prev) => ({ ...prev, imageUrl: true }));
              }}
              initialImage={formData.imageUrl}
            />
            {touched.imageUrl && errors.imageUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>
            )}
          </div>

          {/* Buttons */}
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
              disabled={!isValid}
              className={`cursor-pointer text-fourth px-4 py-2 rounded duration-300 ${
                isValid
                  ? "bg-secondary hover:bg-third"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
            >
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
