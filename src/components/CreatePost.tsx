import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import PostForm from "./PostForm";

export default function CreatePost() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="w-full h-full bg-primary rounded-xl flex flex-col justify-between items-center">
      <div className="w-full h-[55%] text-center pt-5 text-secondary">Showcase your art..</div>
      <div className="w-full h-[45%] relative bg-secondary rounded-xl">
        <button
          className="cursor-pointer absolute text-secondary text-3xl left-1/2 -top-5 transform -translate-x-1/2 bg-primary w-12 h-12 flex items-center justify-center rounded-full border-4 border-secondary"
          onClick={() => setIsFormOpen(true)}
        >
          <FiPlus />
        </button>
        <div className="text-center pt-8">Create a post</div>
      </div>

      {isFormOpen && <PostForm onClose={() => setIsFormOpen(false)} />}
    </div>
  );
}
