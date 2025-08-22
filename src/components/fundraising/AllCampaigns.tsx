/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { getAllCampaigns, createStripeCheckoutSession } from "@/services/fundraisingService";
import CampaignCard from "./CampaignCard";
import { X } from "lucide-react";

const AllCampaignsSection = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCampaigns = async () => {
    const data = await getAllCampaigns();
    setCampaigns(data || []);
    setLoading(false);
  };

  const handleDonateClick = (campaign: any) => {
    setSelectedCampaign(campaign);
    setDonationAmount("");
    setIsModalOpen(true);
  };

  const handleStartDonation = async () => {
    if (!donationAmount || isNaN(+donationAmount) || +donationAmount <= 0) {
      alert("Please enter a valid donation amount");
      return;
    }

    const res = await createStripeCheckoutSession({
      amount: +donationAmount,
      campaignId: selectedCampaign._id,
    });

    if (res?.url) {
      window.location.href = res.url;
    } else {
      alert("Failed to start donation");
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  if (campaigns.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg font-semibold text-third">
          No campaigns available right now.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-auto scrollbar-hide">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {campaigns.map((campaign) => (
          <div key={campaign._id} className="flex flex-col items-center">
            <CampaignCard campaign={campaign} />
            <button
              onClick={() => handleDonateClick(campaign)}
              className="rounded-lg bg-secondary hover:bg-third text-white py-2 px-6 duration-300 mt-2"
            >
              Donate
            </button>
          </div>
        ))}
      </div>

      {/* Modal for donation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center">
          <div className="relative bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4">Enter Donation Amount</h2>
            <input
              type="number"
              className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
              placeholder="Amount in USD"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
            />
            <button
              onClick={handleStartDonation}
              className="w-full bg-secondary hover:bg-third text-white py-2 rounded duration-300"
            >
              Donate Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCampaignsSection;
