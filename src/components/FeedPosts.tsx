"use client";

import { useEffect, useState, useCallback } from "react";
import { getFeed } from "@/services/postService";
import PostCard from "./posts/PostCard";
import { useSearchFilters } from "@/components/SearchFilterContext";

interface Post {
  id: string;
  userId:string;
  name: string;
  description: string;
  imageUrl: string;
}

export default function FeedPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { filters } = useSearchFilters();

  const fetchPosts = useCallback(async () => {
    const data = await getFeed(filters);
    if (data) setPosts(data);
  }, [filters]);

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
            <PostCard key={post.id} {...post} showEditButton={false} onDelete={fetchPosts}/>
          ))}
        </div>
      )}
    </div>
  );
}
