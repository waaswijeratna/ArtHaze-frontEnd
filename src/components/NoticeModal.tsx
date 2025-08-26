import React, { useState } from "react";
import ImageUploader from "./ImageUploader";
import { createNotice } from "../services/noticesService";
import { FiX } from "react-icons/fi";

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (success: boolean, error?: string) => void;
}

const NoticeModal: React.FC<NoticeModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const userId = "66cc1234abcd5678ef901234"; // Later: fetch from localhost/auth context

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newNotice = {
      title,
      description,
      imageUrl,
      userId,
      status: "inactive" as const,
    };

    try {
      const res = await createNotice(newNotice);

      if (res) {
        onCreated(true);
        onClose();
        setTitle("");
        setDescription("");
        setImageUrl("");
      } else {
        onCreated(false, "Failed to create notice");
      }
    } catch (error) {
      onCreated(false, error instanceof Error ? error.message : "An unexpected error occurred");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur">
      <div className="bg-primary rounded-lg shadow-lg w-full max-w-md p-6 relative text-white">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-3 right-3 text-gray-400 hover:text-white"
        >
          <FiX size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4">Create Notice</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Image</label>
            <ImageUploader
              onUpload={(url) => setImageUrl(url)}
              onRemove={() => setImageUrl("")}
              initialImage={imageUrl}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-third hover:text-fourth duration-300 transition cursor-pointer"
          >
            {loading ? "Creating..." : "Create Notice"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NoticeModal;
