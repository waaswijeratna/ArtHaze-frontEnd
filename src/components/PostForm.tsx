import { useRef, useState } from "react";
import { createPost, updatePost } from "@/services/postService";
import ImageUploader from "./ImageUploader";
import Snackbar from "./Snackbar";

interface PostFormProps {
    onClose: () => void;
    initialData?: {id:string, name: string; description: string; imageUrl: string };
}

export default function PostForm({ onClose, initialData }: PostFormProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [name, setName] = useState(initialData?.name || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [imageUrl, setImageUrl] = useState<string>(initialData?.imageUrl || "");
    const [snackbar, setSnackbar] = useState<{
        isOpen: boolean;
        message: string;
        type: 'success' | 'error';
    }>({
        isOpen: false,
        message: '',
        type: 'success'
    });

    const handleOutsideClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (initialData) {
                const result = await updatePost({postId: initialData.id, name, description, imageUrl });
                if (result) {
                    setSnackbar({
                        isOpen: true,
                        message: "Post updated successfully!",
                        type: 'success'
                    });
                    setTimeout(() => {
                        window.location.reload();
                        onClose();
                    }, 1500);
                }
            } else {
                const result = await createPost({name, description, imageUrl });
                if (result) {
                    setSnackbar({
                        isOpen: true,
                        message: "Post created successfully!",
                        type: 'success'
                    });
                    setTimeout(() => {
                        window.location.reload();
                        onClose();
                    }, 1500);
                }
            }
        } catch (error) {
            setSnackbar({
                isOpen: true,
                message: "An error occurred. Please try again."+error,
                type: 'error'
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur" onClick={handleOutsideClick}>
            <div ref={modalRef} className="relative w-full max-w-md p-6 bg-primary rounded-lg shadow-lg">
                <button onClick={onClose} className="cursor-pointer absolute top-3 right-3 text-third hover:text-white text-xl">
                    ✕
                </button>
                <h2 className="text-2xl font-semibold text-center mb-5 text-third">
                    {initialData ? "Edit Post" : "Create a Post"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Post Title"
                        className="bg-fourth w-full text-third p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-third"
                        required
                    />
                    <textarea
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Write a description..."
                        className="scrollbar-hide bg-fourth w-full text-third p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-third max-h-[20vh]"
                        rows={3}
                        required
                    />

                    <ImageUploader
                        initialImage={imageUrl} 
                        onUpload={(url) => setImageUrl(url)}
                        onRemove={() => setImageUrl("")}
                    />

                    <button
                        type="submit"
                        className="cursor-pointer bg-secondary w-full py-3 text-fourth font-semibold rounded-lg hover:bg-third transition"
                    >
                        {initialData ? "Update Post" : "Submit Post"}
                    </button>
                </form>
            </div>
            <Snackbar
                isOpen={snackbar.isOpen}
                message={snackbar.message}
                type={snackbar.type}
                onClose={() => setSnackbar(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
}
