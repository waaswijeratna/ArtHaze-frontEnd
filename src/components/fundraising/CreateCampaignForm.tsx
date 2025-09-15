"use client";

import React, { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import { createFundraisingCampaign, createStripeAccountLink } from "@/services/fundraisingService";
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

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    message: '',
    type: 'success'
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, imageUrl: url });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createFundraisingCampaign(formData);
      if (result) {
        setSnackbar({
          isOpen: true,
          message: "Campaign created successfully!",
          type: 'success'
        });
        setTimeout(() => {
          onClose(); // Close and refresh after showing success message
        }, 1500);
      } else {
        setSnackbar({
          isOpen: true,
          message: "Failed to create campaign. Please try again.",
          type: 'error'
        });
      }
    } catch {
      setSnackbar({
        isOpen: true,
        message: "An error occurred while creating the campaign.",
        type: 'error'
      });
    }
    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Campaign Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="reason"
          placeholder="Why are you raising funds?"
          value={formData.reason}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows={4}
          required
        />

        <div className="flex gap-2">
          <input
            type="text"
            name="stripeAccountId"
            placeholder="Your Stripe Account ID"
            value={formData.stripeAccountId}
            onChange={handleChange}
            className="flex-1 border p-2 rounded"
            required
          />
          <button
            type="button"
            onClick={async () => {
              const userId = useAuthStore.getState().user?.id;
              if (!userId) {
                setSnackbar({
                  isOpen: true,
                  message: "Please log in first",
                  type: 'error'
                });
                return;
              }
              
              const result = await createStripeAccountLink(userId);
              if (result?.url) {
                window.open(result.url, '_blank');
              } else {
                setSnackbar({
                  isOpen: true,
                  message: "Failed to create Stripe account",
                  type: 'error'
                });
              }
            }}
            className="bg-secondary text-black hover:bg-third cursor-pointer px-4 py-2 rounded "
          >
            Create an Account
          </button>
        </div>

        <input
          type="number"
          name="requiredAmount"
          placeholder="Required Amount(USD)"
          value={formData.requiredAmount}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <ImageUploader
          onUpload={handleImageUpload}
          onRemove={() => setFormData({ ...formData, imageUrl: "" })}
          initialImage={formData.imageUrl}
        />

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-secondary px-4 py-2 text-black cursor-pointer rounded hover:bg-third duration-300"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Campaign"}
          </button>
        </div>
      </form>
      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default CreateCampaignForm;
