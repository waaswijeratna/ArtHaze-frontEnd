/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile } from "../services/usersService"; // Adjust path as needed

interface UserProfileProps {
  userId: string;
}

export default function UserProfileCard({ userId }: UserProfileProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<{ name: string; pfpUrl: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const profileData = await getUserProfile(userId);
      setProfile(profileData);
    };

    fetchProfile();
  }, [userId]);

  const handleClick = () => {
    router.push(`/user-profile?id=${userId}`);
  };

  if (!profile) {
    return <p>Loading...</p>; 
  }

  return (
    <div 
      className="flex items-center w-fit cursor-pointer hover:opacity-80 transition-opacity" 
      onClick={handleClick}
    >
      <img src={profile.pfpUrl} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
      <div className="ml-2">
        <h2 className="text-md text-third">{profile.name}</h2>
      </div>
    </div>
  );
}