/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getUserProfile } from "@/services/usersService";
import { getUserPosts } from "@/services/postService";
import { getExhibitionsByUserId } from "@/services/exhibitionService";
import { getUserCampaigns } from "@/services/fundraisingService";
import { getUserAds } from "@/services/advertisementsService";
import PostCard from "@/components/posts/PostCard";
import UserExhibitionCards from "@/components/exhibitions/UserExhibitionCards";
import CampaignCard from "@/components/fundraising/CampaignCard";
import AdCard from "@/components/advertisements/AdCard";
import { useSearchFilters } from "@/components/SearchFilterContext";
import { useAuthStore } from "@/store/authStore";


const BUTTONS = [
  { key: "posts", label: "Posts" },
  { key: "exhibitions", label: "Exhibitions" },
  { key: "campaigns", label: "Campaigns" },
  { key: "advertisements", label: "Advertisements" },
];

export default function UserProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters } = useSearchFilters();
  const authUser = useAuthStore((state) => state.user);

  const paramUserId = searchParams?.get("id");
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let id;
    console.log("paramUserId:", paramUserId);
    if (paramUserId === "undefined") {
      id = authUser?.id || null;
    }
    else {
      id = paramUserId
    }
    setUserId(id);
    if (!id) return;
    getUserProfile(id).then(setUser);
  }, [paramUserId, authUser]);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    let fetcher;
    if (activeTab === "posts") fetcher = () => getUserPosts(userId, filters);
    else if (activeTab === "exhibitions") fetcher = () => getExhibitionsByUserId(userId, filters);
    else if (activeTab === "campaigns") fetcher = () => getUserCampaigns(userId, filters);
    else if (activeTab === "advertisements") fetcher = () => getUserAds(userId, filters);
    (async () => {
      try {
        if (fetcher) {
          const res = await fetcher();
          setData(res || []);
        } else {
          setData([]);
        }
      } catch {
        setData([]);
      }
      setLoading(false);
    })();
  }, [activeTab, filters, userId]);

  return (
    <div className="mx-auto h-[83vh]">
      {/* User Info */}
      {user && (
        <div className="flex items-center gap-4 mb-4 cursor-pointer" onClick={() => router.push(`/user-profile?id=${userId}`)}>
          <div>
            <h2 className="text-2xl font-bold text-third">{user.name}</h2>
            {user.age && <p className="text-gray-100">Age: {user.age}</p>}
          </div>
        </div>
      )}

      {/* Tab Buttons */}
      <div className="flex gap-2 mb-4">
        {BUTTONS.map(btn => (
          <button
            key={btn.key}
            className={`px-2 py-1 text-sm rounded font-semibold border-b-2 transition-colors duration-200 ${activeTab === btn.key ? "border-third text-third" : "border-transparent text-gray-400 hover:text-third"
              }`}
            onClick={() => setActiveTab(btn.key)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Data Display */}
      <div className="h-[67vh] overflow-y-auto scrollbar-hide">
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : data.length === 0 ? (
          <div className="text-center text-gray-400">No data found.</div>
        ) : (
          <ul className="space-y-4">
            {activeTab === "posts" && data.map((post: any) => (
              <li key={post.id || post._id}>
                <PostCard {...post} showEditButton={false} />
              </li>
            ))}
            {activeTab === "exhibitions" && userId && (
              <UserExhibitionCards userId={userId} />
            )}
            {activeTab === "campaigns" && data.map((c: any) => (
              <li key={c._id}>
                <CampaignCard campaign={c} />
              </li>
            ))}
            {activeTab === "advertisements" && data.map((ad: any) => (
              <li key={ad._id}>
                <AdCard ad={ad} onEdit={() => { }} onDelete={() => { }} myAds={false} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}