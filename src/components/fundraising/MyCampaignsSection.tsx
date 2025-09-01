"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getUserCampaigns, deleteCampaign } from "@/services/fundraisingService";
import CampaignCard from "./CampaignCard";
import { Trash2, X } from "lucide-react";
import { useSearchFilters } from "@/components/SearchFilterContext";
import CreateCampaignForm from "./CreateCampaignForm";
import Dialog from "@/components/Dialog";
import Snackbar from "@/components/Snackbar";

const MyCampaignsSection = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const userId = localStorage.getItem("userId") ?? undefined;
    const [snackbar, setSnackbar] = useState<{ isOpen: boolean; message: string; type: 'success' | 'error' }>({
        isOpen: false,
        message: '',
        type: 'success'
    });
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; campaignId: string }>({
        isOpen: false,
        campaignId: ''
    });
    const { filters } = useSearchFilters();

    const fetchCampaigns = useCallback(async () => {
        const data = await getUserCampaigns(userId, filters);
        setCampaigns(data || []);
        setLoading(false);
    }, [filters, userId]);

    const handleDelete = async (id: string) => {
        setDeleteDialog({
            isOpen: true,
            campaignId: id
        });
    };

    const confirmDelete = async () => {
        const id = deleteDialog.campaignId;
        try {
            const success = await deleteCampaign(id);
            if (success) {
                setCampaigns((prev) => prev.filter((c) => c._id !== id));
                setSnackbar({
                    isOpen: true,
                    message: 'Campaign deleted successfully',
                    type: 'success'
                });
            } else {
                setSnackbar({
                    isOpen: true,
                    message: 'Failed to delete campaign',
                    type: 'error'
                });
            }
        } catch {
            setSnackbar({
                isOpen: true,
                message: 'An error occurred while deleting the campaign',
                type: 'error'
            });
        }
        setDeleteDialog({ isOpen: false, campaignId: '' });
    };

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);



    return (
        <div>
            <div className="flex w-full  mb-4">
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
                                className="absolute top-2 right-2 text-red-600 hover:text-red-700 z-10 cursor-pointer"
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
                    <div className="relative bg-primary text-white px-6 py-8  rounded-lg shadow-lg w-full max-w-xl">
                        <button
                            onClick={() => setIsCreateOpen(false)}
                            className="absolute top-2 right-2 text-white hover:text-gray-300 hover:scale-110 duration-200 cursor-pointer"
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
            
            {/* Dialog for delete confirmation */}
            <Dialog
                isOpen={deleteDialog.isOpen}
                title="Delete Campaign"
                message="Are you sure you want to delete this campaign? This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setDeleteDialog({ isOpen: false, campaignId: '' })}
            />

            {/* Snackbar for notifications */}
            <Snackbar
                isOpen={snackbar.isOpen}
                message={snackbar.message}
                type={snackbar.type}
                onClose={() => setSnackbar(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );

};

export default MyCampaignsSection;
