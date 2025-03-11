"use client";

import { useEffect, useState } from "react";
import { getFeed } from "@/services/postService";
import PostCard from "./posts/PostCard";

interface Post {
  id: string;
  userId:string;
  name: string;
  description: string;
  imageUrl: string;
}

export default function FeedPosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    const data = await getFeed();
    if (data) setPosts(data);
  };

  useEffect(() => {
    async function fetchPosts() {
      const data = await getFeed();
      if (data) setPosts(data);
    }
    fetchPosts();
  }, []);

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
