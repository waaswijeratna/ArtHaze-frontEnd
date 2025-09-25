"use client";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { createNotice } from "../services/noticesService";
import ImageUploader from "./ImageUploader";
import Snackbar from "./Snackbar";
import { FiX } from "react-icons/fi";

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (success: boolean, error?: string) => void;
}

interface FormValues {
  title: string;
  description: string;
  imageUrl: string;
}

export default function NoticeModal({ isOpen, onClose, onCreated }: NoticeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
    },
  });

  const [snackbar, setSnackbar] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error";
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const userId = "66cc1234abcd5678ef901234"; // TODO: fetch from auth context

  if (!isOpen) return null;

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const newNotice = {
        ...data,
        userId,
        status: "inactive" as const,
      };

      const result = await createNotice(newNotice);

      if (result) {
        setSnackbar({
          isOpen: true,
          message: "Notice created successfully!",
          type: "success",
        });
        onCreated(true);
        reset(); // ✅ clear form
        onClose(); // ✅ close modal
      } else {
        setSnackbar({
          isOpen: true,
          message: "Failed to create notice",
          type: "error",
        });
        onCreated(false, "Failed to create notice");
      }
    } catch (error) {
      setSnackbar({
        isOpen: true,
        message: "An error occurred. Please try again. " + error,
        type: "error",
      });
      onCreated(false, error instanceof Error ? error.message : "Unexpected error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur"
      onClick={handleOutsideClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md p-6 bg-primary rounded-lg shadow-lg text-white"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <FiX size={22} />
        </button>

        <h2 className="text-2xl font-semibold text-center mb-5">
          Create Notice
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <input
              type="text"
              placeholder="Notice Title"
              className={`bg-fourth w-full text-third p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                errors.title ? "border border-red-500" : ""
              }`}
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <textarea
              placeholder="Write a description..."
              className={`scrollbar-hide bg-fourth w-full text-third p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary max-h-[20vh] ${
                errors.description ? "border border-red-500" : ""
              }`}
              rows={3}
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters",
                },
              })}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Image */}
          <ImageUploader
            onUpload={(url) => {
              setValue("imageUrl", url, { shouldValidate: true });
              trigger("imageUrl");
            }}
            onRemove={() => {
              setValue("imageUrl", "", { shouldValidate: true });
              trigger("imageUrl");
            }}
          />
          <input
            type="hidden"
            {...register("imageUrl", { required: "Image is required" })}
          />
          {errors.imageUrl && (
            <p className="text-red-500 text-sm mt-1">
              {errors.imageUrl.message}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="cursor-pointer bg-secondary w-full py-3 text-fourth font-semibold rounded-lg hover:bg-third transition"
          >
            Create Notice
          </button>
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
