/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaHeart } from "react-icons/fa";
import UserProfileCard from "../UserProfileCard";
import PostForm from "../PostForm";
import Dialog from "../Dialog";
import Snackbar from "../Snackbar";
import { deletePost, toggleLike, isPostLiked } from "../../services/postService";
import { usePostLikes } from "@/hooks/usePostLikes";
import { useAuthStore } from "@/store/authStore";
import { deleteImageFromFirebase } from "@/config/deleteImageFromFirebase";


interface PostCardProps {
  id: string;
  userId: string;
  name: string;
  description: string;
  imageUrl: string;
  showEditButton?: boolean;
  onDelete?: () => void;
  likes?: string[];
}

export default function PostCard({ id, name, description, imageUrl, userId, showEditButton = false, onDelete, likes = [] }: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes.length);
  const [snackbar, setSnackbar] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    message: '',
    type: 'success'
  });

  // Initialize like state from props and check server state
  useEffect(() => {
    const currentUserId = authUser?.id;
    if (currentUserId && likes) {
      setIsLiked(likes.includes(currentUserId));
      setLikeCount(likes.length);
    }

    const checkLikeStatus = async () => {
      const liked = await isPostLiked(id);
      setIsLiked(liked);
    };
    checkLikeStatus();
  }, [id, likes]);

  // Handle real-time like updates
  usePostLikes((postId, updatedLikes) => {
    if (postId === id) {
      const currentUserId = authUser?.id;
      const newLikeCount = updatedLikes.length;
      const newIsLiked = currentUserId ? updatedLikes.includes(currentUserId) : false;

      // Only update if the state actually changed
      if (likeCount !== newLikeCount) {
        setLikeCount(newLikeCount);
      }
      if (isLiked !== newIsLiked) {
        setIsLiked(newIsLiked);
      }
    }
  });

  const handleDelete = async () => {
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (imageUrl) {
      await deleteImageFromFirebase(imageUrl);
    }
      const success = await deletePost(id);
      if (success) {
        setSnackbar({
          isOpen: true,
          message: "Post deleted successfully!",
          type: 'success'
        });
        setTimeout(() => {
          onDelete?.(); // Refresh posts after deletion
        }, 1500);
      }
    } catch (error) {
      setSnackbar({
        isOpen: true,
        message: "Failed to delete post. Please try again." + error,
        type: 'error'
      });
    }
    setIsDialogOpen(false);
  };

  const handleLike = async () => {
    const currentUserId = authUser?.id;
    if (!currentUserId) {
      setSnackbar({
        isOpen: true,
        message: "Please log in to like posts",
        type: 'error'
      });
      return;
    }

    // Optimistic update
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

    try {
      const updatedPost = await toggleLike(id);
      if (!updatedPost) {
        // Revert optimistic update if the server request failed
        setIsLiked(isLiked);
        setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
        throw new Error('Failed to update like status');
      }
    } catch (error) {
      // Revert optimistic update
      setIsLiked(isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
      setSnackbar({
        isOpen: true,
        message: "Failed to update like status" + error,
        type: 'error'
      });
    }
  };

  return (
    <div className="w-full bg-primary shadow-md rounded-lg p-4 mb-5 relative">
      <div className="flex justify-between items-center">
        <UserProfileCard userId={userId} />

        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2 mr-4">
            <FaHeart
              onClick={handleLike}
              className={`cursor-pointer transition-colors ${isLiked ? 'text-third' : 'text-gray-400'
                } `}
              title={isLiked ? "Unlike" : "Like"}
              size={20}
            />
            <span className="text-white text-sm">{likeCount}</span>
          </div>

          {showEditButton && (
            <>
              <FaEdit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer text-white hover:text-gray-300"
                title="Edit"
                size={20}
              />
              <FaTrash
                onClick={handleDelete}
                className="cursor-pointer text-red-500 hover:text-red-700"
                title="Delete"
                size={20}
              />
            </>
          )}
        </div>

      </div>

      <h3 className="text-white text-lg font-bold mb-2 truncate">{name}</h3>

      {/* Description with "See More" and "See Less" */}
      {/* Description with "See More" and "See Less" */}
      <p className="text-white mb-3 inline">
        {expanded || description.length <= 50
          ? description
          : `${description.slice(0, 50)}... `}

        {description.length > 50 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-third cursor-pointer hover:underline ml-1"
          >
            {expanded ? "See Less" : "See More"}
          </button>
        )}
      </p>


      {imageUrl && (
        <div className="w-full h-full relative mt-3">
          <img src={imageUrl} alt={name} className="w-full h-full object-cover rounded-md" />
        </div>
      )}

      {/* Render the Edit Form in a Modal */}
      {isEditing && <PostForm onClose={() => setIsEditing(false)} initialData={{ id, name, description, imageUrl }} />}

      <Dialog
        isOpen={isDialogOpen}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDialogOpen(false)}
      />

      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
