"use client";

import { useEffect, useState, useCallback } from "react";
import { getUserPosts } from "@/services/postService";
import PostCard from "./PostCard";
import { useSearchFilters } from "@/components/SearchFilterContext";
import { useAuthStore } from "@/store/authStore";


interface Post {
  id: string;
  userId:string;
  name: string;
  description: string;
  imageUrl: string;
}

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { filters } = useSearchFilters();
  const authUser = useAuthStore((state) => state.user);

  const userId = authUser?.id ?? "";

  const fetchPosts = useCallback(async () => {
    const data = await getUserPosts(userId, filters);
    if (data) setPosts(data);
  }, [filters, userId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="flex flex-col justify-center items-center">
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts found.</p>
      ) : (
        <div className="w-[40vw] max-h-[84vh] overflow-y-auto scrollbar-hide">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} showEditButton={true} onDelete={fetchPosts}/>
          ))}
        </div>
      )}
    </div>
  );
}
