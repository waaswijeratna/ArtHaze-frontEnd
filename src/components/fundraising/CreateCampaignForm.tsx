"use client";

import React, { useState, useEffect } from "react";
import ImageUploader from "@/components/ImageUploader";
import {
  createFundraisingCampaign,
  createStripeAccountLink,
} from "@/services/fundraisingService";
import Snackbar from "@/components/Snackbar";
import { useAuthStore } from "@/store/authStore";

const CreateCampaignForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    title: "",
    reason: "",
    imageUrl: "",
    stripeAccountId: "",
    requiredAmount: "",
  });

  // track touched fields
  const [touched, setTouched] = useState({
    title: false,
    reason: false,
    imageUrl: false,
    stripeAccountId: false,
    requiredAmount: false,
  });

  const [errors, setErrors] = useState({
    title: "",
    reason: "",
    imageUrl: "",
    stripeAccountId: "",
    requiredAmount: "",
  });

  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error";
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  // validate fields
  useEffect(() => {
    const newErrors = {
      title: formData.title.trim() ? "" : "Campaign title is required.",
      reason: formData.reason.trim()
        ? ""
        : "Please describe why you are raising funds.",
      imageUrl: formData.imageUrl ? "" : "Campaign image is required.",
      stripeAccountId: formData.stripeAccountId
        ? ""
        : "Stripe account ID is required.",
      requiredAmount:
        Number(formData.requiredAmount) > 0
          ? ""
          : "Required amount must be greater than 0.",
    };

    setErrors(newErrors);
    setIsValid(Object.values(newErrors).every((msg) => msg === ""));
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      title: true,
      reason: true,
      imageUrl: true,
      stripeAccountId: true,
      requiredAmount: true,
    });

    if (!isValid) return;
    setLoading(true);

    try {
      const result = await createFundraisingCampaign(formData);
      if (result) {
        setSnackbar({
          isOpen: true,
          message: "Campaign created successfully!",
          type: "success",
        });
        setTimeout(() => {
          onClose?.();
        }, 1500);
      } else {
        setSnackbar({
          isOpen: true,
          message: "Failed to create campaign. Please try again.",
          type: "error",
        });
      }
    } catch {
      setSnackbar({
        isOpen: true,
        message: "An error occurred while creating the campaign.",
        type: "error",
      });
    }
    setLoading(false);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-primary text-white rounded-2xl max-w-xl mx-auto p-6 space-y-6 h-[90vh] overflow-y-auto scrollbar-hide"
      >
        {/* Title */}
        <div>
          <label className="block font-bold mb-1">Campaign Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={() => handleBlur("title")}
            className="w-full p-2 border rounded text-black"
          />
          {touched.title && errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Reason */}
        <div>
          <label className="block font-bold mb-1">Reason</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            onBlur={() => handleBlur("reason")}
            rows={4}
            className="w-full p-2 border rounded text-black"
          />
          {touched.reason && errors.reason && (
            <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
          )}
        </div>

        {/* Stripe Account */}
        <div>
          <label className="block font-bold mb-1">Stripe Account</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="stripeAccountId"
              placeholder="Your Stripe Account ID"
              value={formData.stripeAccountId}
              onChange={handleChange}
              onBlur={() => handleBlur("stripeAccountId")}
              className="flex-1 border p-2 rounded text-black"
            />
            <button
              type="button"
              onClick={async () => {
                const userId = useAuthStore.getState().user?.id;
                if (!userId) {
                  setSnackbar({
                    isOpen: true,
                    message: "Please log in first",
                    type: "error",
                  });
                  return;
                }

                const result = await createStripeAccountLink(userId);
                if (result?.url) {
                  window.open(result.url, "_blank");
                } else if (result?.accountId) {
                  setSnackbar({
                    isOpen: true,
                    message: `You already have an account, please copy the id: ${result.accountId}`,
                    type: "success",
                  });
                } else {
                  setSnackbar({
                    isOpen: true,
                    message: "Failed to create or fetch Stripe account",
                    type: "error",
                  });
                }
              }}
              className="bg-secondary text-black hover:bg-third cursor-pointer px-4 py-2 rounded"
            >
              Create Account
            </button>
          </div>
          {touched.stripeAccountId && errors.stripeAccountId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.stripeAccountId}
            </p>
          )}
        </div>

        {/* Required Amount */}
        <div>
          <label className="block font-bold mb-1">Required Amount (USD)</label>
          <input
            type="number"
            name="requiredAmount"
            value={formData.requiredAmount}
            onChange={handleChange}
            onBlur={() => handleBlur("requiredAmount")}
            className="w-full border p-2 rounded text-black"
          />
          {touched.requiredAmount && errors.requiredAmount && (
            <p className="text-red-500 text-sm mt-1">
              {errors.requiredAmount}
            </p>
          )}
        </div>

        {/* Image */}
        <div>
          <label className="block font-bold mb-1">Campaign Image</label>
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

        {/* Submit */}
        <button
          type="submit"
          disabled={!isValid || loading}
          className={`w-full text-white py-2 rounded transition ${
            isValid
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Creating..." : "Create Campaign"}
        </button>
      </form>

      {/* Snackbar */}
      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default CreateCampaignForm;
