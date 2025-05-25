"use client";

import React, { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import { createFundraisingCampaign } from "@/services/fundraisingService";

const CreateCampaignForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    title: "",
    reason: "",
    imageUrl: "",
    stripeAccountId: "",
    requiredAmount: "",
  });

  const [loading, setLoading] = useState(false);

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
    const result = await createFundraisingCampaign(formData);
    setLoading(false);

    if (result) {
      onClose(); // Close and refresh
    }
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

        <input
          type="text"
          name="stripeAccountId"
          placeholder="Your Stripe Account ID"
          value={formData.stripeAccountId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          name="requiredAmount"
          placeholder="Required Amount"
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
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Campaign"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaignForm;
