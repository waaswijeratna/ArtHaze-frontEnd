/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";

interface NoticeCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ title, description, imageUrl }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Notice Card */}
      <div 
        className="w-full flex rounded-lg bg-secondary mb-2 cursor-pointer" 
        onClick={() => setIsOpen(true)}
      >
        <div className="w-1/3 relative">
          <img className="w-full h-16 object-cover flex-shrink-0 rounded-lg" src={imageUrl} alt={title} />
        </div>
        <div className="w-2/3 h-16 px-2 flex flex-col">
          <h2 className="text-sm font-semibold truncate">{title}</h2>
          <p className="text-xs text-gray-800 overflow-hidden break-words line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur  flex justify-center items-center z-50">
          <div className="bg-secondary p-6 shadow-md rounded-lg w-3/4 md:w-1/2 lg:w-1/3 relative">
            <button 
              className="cursor-pointer absolute text-white top-2 right-2 bg-primary rounded-full px-2 py-0.5 hover:bg-fourth duration-300"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
            <img className="w-full h-48 object-cover rounded-lg" src={imageUrl} alt={title} />
            <h2 className="text-lg font-semibold mt-4">{title}</h2>
            <p className="text-sm text-fourth mt-2">{description}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default NoticeCard;
