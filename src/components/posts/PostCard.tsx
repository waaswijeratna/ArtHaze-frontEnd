/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import UserProfileCard from "../UserProfileCard";
import PostForm from "../PostForm";
import Dialog from "../Dialog";
import Snackbar from "../Snackbar";
import { deletePost } from "../../services/postService";

interface PostCardProps {
  id: string;
  userId: string;
  name: string;
  description: string;
  imageUrl: string;
  showEditButton?: boolean;
  onDelete?: () => void;
}

export default function PostCard({ id, name, description, imageUrl, userId, showEditButton = false, onDelete }: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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

  const handleDelete = async () => {
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
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
        message: "Failed to delete post. Please try again."+error,
        type: 'error'
      });
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="w-full bg-primary shadow-md rounded-lg p-4 mb-5 relative">
      <div className="flex justify-between items-center">
        <UserProfileCard userId={userId} />

        {showEditButton && (
          <div className="flex gap-3">
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
          </div>
        )}
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
