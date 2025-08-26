import React, { useEffect, useState } from "react";
import { getNotices, Notice } from "../services/noticesService";
import NoticeCard from "./NoticeCard";
import NoticeModal from "./NoticeModal";
import { FiPlus } from "react-icons/fi";
import Snackbar from "./Snackbar";

const NoticesContainer: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    message: '',
    type: 'success'
  });

  const fetchNotices = async () => {
    setLoading(true);
    const data = await getNotices();
    if (data) {
      // Only keep active notices
      setNotices(data.filter((notice: Notice) => notice.status === "active"));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  if (loading) return <p>Loading notices...</p>;

  return (
    <div className="relative">
      <div className="sticky bg-primary z-10 py-2 top-0 mb-2 flex justify-between items-center text-secondary">
        <h2>Notices</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 px-2 py-1 rounded-full cursor-pointer bg-secondary text-white hover:bg-third hover:text-fourth transition"
        >
          <FiPlus />
        </button>
      </div>

      {notices.length > 0 ? (
        notices.map((notice) => (
          <NoticeCard
            key={notice._id}
            title={notice.title}
            description={notice.description}
            imageUrl={notice.imageUrl}
          />
        ))
      ) : (
        <p>No active notices available.</p>
      )}

      {/* Modal */}
      <NoticeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={(success: boolean, error?: string) => {
          if (success) {
            setSnackbar({
              isOpen: true,
              message: "Notice submitted! It will appear once approved by our team.",
              type: 'success'
            });
            fetchNotices();
          } else {
            setSnackbar({
              isOpen: true,
              message: error || "Failed to create notice",
              type: 'error'
            });
          }
        }}
      />

      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default NoticesContainer;
