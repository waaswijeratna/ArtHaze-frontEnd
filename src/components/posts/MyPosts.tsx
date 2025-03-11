"use client";

import { useEffect, useState } from "react";
import { getUserPosts } from "@/services/postService";
import PostCard from "./PostCard";

interface Post {
  id: string;
  userId:string;
  name: string;
  description: string;
  imageUrl: string;
}

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    const data = await getUserPosts();
    if (data) setPosts(data);
  };

  useEffect(() => {
    async function fetchPosts() {
      const data = await getUserPosts();
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
            <PostCard key={post.id} {...post} showEditButton={true} onDelete={fetchPosts}/>
          ))}
        </div>
      )}
    </div>
  );
}
