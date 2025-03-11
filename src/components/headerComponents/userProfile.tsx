/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { getProfile } from "../../services/authService";
import ProfileForm from "./ProfileForm";

export default function UserProfile() {
    const profile = getProfile();
    const [isEditing, setIsEditing] = useState(false);

    if (!profile) {
        return <p>Profile not found</p>;
    }

    return (
        <>
            <div 
                className="flex items-center w-fit cursor-pointer"
                onClick={() => setIsEditing(true)}
            >
                <img src={profile.pfpUrl} alt="Profile" className="w-8 h-8 rounded-full object-cover"/>
                <div className="ml-2">
                    <h2 className="text-md text-white">{profile.name}</h2>
                </div>
            </div>

            {/* Overlay Modal */}
            {isEditing && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/30 backdrop-blur flex justify-center items-center z-50">
                    <div className="bg-primary w-[50vw] p-6 rounded-lg w-96 relative">
                        <button 
                            onClick={() => setIsEditing(false)} 
                            className="cursor-pointer absolute top-0 right-2 text-white hover:text-third duration-300 text-2xl"
                        >
                            &times;
                        </button>
                        <ProfileForm 
                            onSwitch={() => setIsEditing(false)}
                            initialData={profile}
                        />
                    </div>
                </div>
            )}
        </>
    );
}