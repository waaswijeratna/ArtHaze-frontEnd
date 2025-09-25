"use client";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { createPost, updatePost } from "@/services/postService";
import ImageUploader from "./ImageUploader";
import Snackbar from "./Snackbar";

interface PostFormProps {
  onClose: () => void;
  initialData?: { id: string; name: string; description: string; imageUrl: string };
}

interface FormValues {
  name: string;
  description: string;
  imageUrl: string;
}

export default function PostForm({ onClose, initialData }: PostFormProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<FormValues>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      imageUrl: initialData?.imageUrl || "",
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

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      if (initialData) {
        const result = await updatePost({ postId: initialData.id, ...data });
        if (result) {
          setSnackbar({
            isOpen: true,
            message: "Post updated successfully!",
            type: "success",
          });
          setTimeout(() => {
            window.location.reload();
            onClose();
          }, 1500);
        }
      } else {
        const result = await createPost(data);
        if (result) {
          setSnackbar({
            isOpen: true,
            message: "Post created successfully!",
            type: "success",
          });
          setTimeout(() => {
            window.location.reload();
            onClose();
          }, 1500);
        }
      }
    } catch (error) {
      setSnackbar({
        isOpen: true,
        message: "An error occurred. Please try again. " + error,
        type: "error",
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur"
      onClick={handleOutsideClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md p-6 bg-primary rounded-lg shadow-lg"
      >
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-3 right-3 text-third hover:text-white text-xl"
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold text-center mb-5 text-third">
          {initialData ? "Edit Post" : "Create a Post"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Post Title */}
          <div>
            <input
              type="text"
              placeholder="Post Title"
              className={`bg-fourth w-full text-third p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-third ${
                errors.name ? "border border-red-500" : ""
              }`}
              {...register("name", { required: "Title is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <textarea
              placeholder="Write a description..."
              className={`scrollbar-hide bg-fourth w-full text-third p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-third max-h-[20vh] ${
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

          {/* Image Uploader */}
          <ImageUploader
            initialImage={initialData?.imageUrl}
            onUpload={(url) => {
              setValue("imageUrl", url, { shouldValidate: true });
              trigger("imageUrl"); // ✅ triggers validation immediately
            }}
            onRemove={() => {
              setValue("imageUrl", "", { shouldValidate: true });
              trigger("imageUrl"); // ✅ triggers validation immediately
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
            {initialData ? "Update Post" : "Submit Post"}
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
