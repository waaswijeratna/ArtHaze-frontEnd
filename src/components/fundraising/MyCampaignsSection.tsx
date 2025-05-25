"use client";

import React, { useEffect, useState } from "react";
import { getUserCampaigns, deleteCampaign } from "@/services/fundraisingService";
import CampaignCard from "./CampaignCard";
import { Trash2, X } from "lucide-react";
import CreateCampaignForm from "./CreateCampaignForm";

const MyCampaignsSection = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const fetchCampaigns = async () => {
        const data = await getUserCampaigns();
        setCampaigns(data || []);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        const confirmed = confirm("Are you sure you want to delete this campaign?");
        if (!confirmed) return;

        const success = await deleteCampaign(id);
        if (success) {
            setCampaigns((prev) => prev.filter((c) => c._id !== id));
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);



    return (
        <div>
            <div className="flex w-full justify-end mb-4">
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="rounded-lg w-1/4 py-2 px-6 bg-secondary hover:bg-third duration-300 cursor-pointer"
                >
                    Create Campaign
                </button>
            </div>

            {campaigns.length === 0 ? (
                <div className="relative flex flex-col gap-8 justify-center items-center h-[60vh]">
                    <p className="font-bold text-third">
                        You haven&apos;t created any campaign yet.. Create a campaign!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {campaigns.map((campaign) => (
                        <div key={campaign._id} className="relative">
                            <button
                                className="absolute top-2 right-2 text-red-600 hover:text-red-800 z-10"
                                onClick={() => handleDelete(campaign._id)}
                            >
                                <Trash2 size={24} />
                            </button>
                            <CampaignCard campaign={campaign} />
                        </div>
                    ))}
                </div>
            )}

            {/* Popup Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur z-50 flex items-center justify-center">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
                        <button
                            onClick={() => setIsCreateOpen(false)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-black"
                        >
                            <X size={20} />
                        </button>
                        <CreateCampaignForm
                            onClose={() => {
                                setIsCreateOpen(false);
                                fetchCampaigns();
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );

};

export default MyCampaignsSection;
