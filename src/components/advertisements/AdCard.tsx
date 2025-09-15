/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { Advertisements } from "@/types";
import { FaEdit, FaTrash, FaTimes, FaPhone, FaImages } from "react-icons/fa";
import moment from "moment";
import UserProfileCard from "../UserProfileCard";
import Dialog from "../Dialog";
import Snackbar from "../Snackbar";
import { deleteImageFromFirebase } from "@/config/deleteImageFromFirebase";

interface AdCardProps {
    ad: Advertisements;
    onEdit: (ad: Advertisements) => void;
    onDelete: (id: string) => void;
    myAds: boolean;
}

export default function AdCard({ ad, onEdit, onDelete, myAds }: AdCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState<{
        isOpen: boolean;
        message: string;
        type: 'success' | 'error';
    }>({
        isOpen: false,
        message: '',
        type: 'success'
    });

    // Format createdAt as relative time (e.g., "2 days ago")
    const formattedTime = ad.createdAt ? moment(ad.createdAt).fromNow() : "Unknown";

    return (
        <>
            {/* Small Preview Card */}
            <div
                className="bg-primary shadow-third/40 rounded-lg p-4 shadow-md cursor-pointer hover:shadow-lg transition duration-300"
                onClick={() => setIsOpen(true)}
            >
                <div className="mb-2" onClick={(e) => e.stopPropagation()}>
                    <UserProfileCard userId={ad.userId} />
                </div>
                <img src={ad.imageUrl} alt={ad.name} className="w-full h-40 object-cover rounded-md" />
                <h2 className="text-white font-bold mt-2 truncate">{ad.name}</h2>
                <div className="flex justify-between items-center">
                    <p className="text-lg text-third font-semibold mt-1">${ad.price}</p>
                    <p className="text-gray-400 text-sm">{formattedTime}</p>
                </div>

                {myAds && (
                    <div className="flex justify-between mt-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(ad);
                                setSnackbar({
                                    isOpen: true,
                                    message: "Edit your advertisement details",
                                    type: 'success'
                                });
                            }}
                            className="cursor-pointer text-secondary hover:text-third duration-300"
                        >
                            <FaEdit size={20} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsDialogOpen(true);
                            }}
                            className="cursor-pointer text-red-400 hover:text-red-500 duration-300"
                            title="Delete advertisement"
                        >
                            <FaTrash size={20} />
                        </button>
                    </div>
                )}
            </div>


            {/* Full Detail Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50">
                    <div className="bg-primary px-6 py-6 rounded-lg w-[80vw] h-[80vh] overflow-y-auto scrollbar-hide relative flex shadow-lg shadow-third/30">
                        <button
                            className="absolute top-3 right-3 text-secondary cursor-pointer hover:text-third duration-300 text-2xl"
                            onClick={() => setIsOpen(false)}
                        >
                            <FaTimes />
                        </button>

                        {/* Left Section - Image */}
                        <div className="w-1/2">
                            <img src={ad.imageUrl} alt={ad.name} className="w-full h-full object-cover rounded-md shadow-md shadow-third/30" />
                        </div>

                        {/* Right Section - Details */}
                        <div className="w-1/2 pl-6 flex flex-col justify-between">
                            <div className="mb-2" onClick={(e) => e.stopPropagation()}>
                                <UserProfileCard userId={ad.userId} />
                            </div>
                            <h2 className="text-2xl font-bold text-white">{ad.name}</h2>
                            <p className="text-lg font-semibold text-third mt-1">${ad.price}</p>
                            <p className="text-gray-400 text-sm">Posted {formattedTime}</p>

                            <hr className="my-3 border-gray-500" />

                            <p className="text-gray-300">{ad.description}</p>

                            {/* Category with Icon */}
                            <p className=" text-white mt-2 flex items-center">
                                <FaImages className="text-third mr-2" /> {ad.category}
                            </p>

                            {/* Contact Number with Icon & Highlight */}
                            <p className=" text-secondary mt-2 flex items-center font-semibold hover:text-third duration-300">
                                <FaPhone className="text-third mr-2" /> {ad.contact}
                            </p>

                            {/* Edit & Delete Buttons (Only if myAds is true) */}
                            {myAds && (
                                <div className="flex justify-between mt-4">
                                    <button
                                        onClick={() => {
                                            onEdit(ad);
                                            setSnackbar({
                                                isOpen: true,
                                                message: "Edit your advertisement details",
                                                type: 'success'
                                            });
                                        }}
                                        className="cursor-pointer text-secondary hover:text-third duration-300 flex items-center"
                                    >
                                        <FaEdit size={20} className="mr-2" /> Edit
                                    </button>
                                    <button
                                        onClick={() => setIsDialogOpen(true)}
                                        className="cursor-pointer text-red-400 hover:text-red-500 duration-300 flex items-center"
                                    >
                                        <FaTrash size={20} className="mr-2" /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Dialog
                isOpen={isDialogOpen}
                title="Delete Advertisement"
                message="Are you sure you want to delete this advertisement? This action cannot be undone."
                onConfirm={async () => {
                    try {
                        // First delete the image
                        if (ad.imageUrl) {
                            await deleteImageFromFirebase(ad.imageUrl);
                        }

                        // Then delete the advertisement record
                        onDelete(ad.id!);

                        setSnackbar({
                            isOpen: true,
                            message: "Advertisement deleted successfully",
                            type: 'success'
                        });
                    } catch (error) {
                        console.error("Error deleting ad or image:", error);
                        setSnackbar({
                            isOpen: true,
                            message: "Failed to delete advertisement",
                            type: 'error'
                        });
                    } finally {
                        setIsDialogOpen(false);
                    }
                }}
                onCancel={() => setIsDialogOpen(false)}
            />


            <Snackbar
                isOpen={snackbar.isOpen}
                message={snackbar.message}
                type={snackbar.type}
                onClose={() => setSnackbar(prev => ({ ...prev, isOpen: false }))}
            />
        </>
    );
}
