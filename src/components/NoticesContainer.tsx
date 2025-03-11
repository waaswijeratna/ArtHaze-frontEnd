import React, { useEffect, useState } from "react";
import { getNotices } from "../services/noticesService";
import NoticeCard from "./NoticeCard";

interface Notice {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const NoticesContainer: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      const data = await getNotices();
      if (data) {
        setNotices(data);
      }
      setLoading(false);
    };

    fetchNotices();
  }, []);

  if (loading) return <p>Loading notices...</p>;

  return (
    <div className="relative">
        <h2 className="sticky bg-primary z-10 py-2 top-0 mb-2 text-secondary">Notices</h2>
      {notices.length > 0 ? (
        notices.map((notice) => (
          <NoticeCard
            key={notice.id}
            title={notice.title}
            description={notice.description}
            imageUrl={notice.imageUrl}
          />
        ))
      ) : (
        <p>No notices available.</p>
      )}
    </div>
  );
};

export default NoticesContainer;
