/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { FiImage, FiX } from "react-icons/fi";
import { storage } from "@/config/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

interface ImageUploaderProps {
    onUpload: (url: string) => void;
    onRemove: () => void;
    initialImage?: string; // Accept initial image URL
}

export default function ImageUploader({ onUpload, onRemove, initialImage }: ImageUploaderProps) {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initialImage || null);
    const [uploading, setUploading] = useState(false);
    const [downloadURL, setDownloadURL] = useState<string | null>(initialImage || null);

    useEffect(() => {
        setPreview(initialImage || null);
        setDownloadURL(initialImage || null);
    }, [initialImage]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Show preview before uploading
        }
    };

    const handleUpload = async () => {
        if (!image) return;
        setUploading(true);

        // Delete the existing image first (if any)
        if (downloadURL) {
            try {
                await deleteObject(ref(storage, downloadURL));
                console.log("Old image deleted:", downloadURL);
            } catch (error) {
                console.error("Error deleting old image:", error);
            }
        }

        const storageRef = ref(storage, `posts/${Date.now()}-${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
            "state_changed",
            null,
            (error) => {
                console.error("Upload failed:", error);
                setUploading(false);
            },
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                console.log("Uploaded Image URL:", url);
                setDownloadURL(url);
                onUpload(url);
                setUploading(false);
            }
        );
    };

    const handleRemove = async () => {
        if (downloadURL) {
            try {
                await deleteObject(ref(storage, downloadURL));
                console.log("Image removed from Firebase:", downloadURL);
            } catch (error) {
                console.error("Failed to delete image:", error);
            }
        }

        setPreview(null);
        setImage(null);
        setDownloadURL(null);
        onRemove();
    };

    return (
        <div className="flex flex-col items-center space-y-3">
            {preview ? (
                <div className="relative group">
                    <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-md shadow-md" />
                    <button
                        onClick={handleRemove}
                        className="absolute top-1 right-1 bg-red-500 text-white p-2 rounded-full opacity-80 hover:opacity-100 transition"
                    >
                        <FiX />
                    </button>
                </div>
            ) : (
                <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-third p-4 rounded-lg cursor-pointer hover:border-secondary transition">
                    <FiImage className="text-secondary text-4xl mb-2" />
                    <span className="text-secondary">Click to upload image</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
            )}

            {image && !downloadURL && (
                <button
                    onClick={handleUpload}
                    className="cursor-pointer bg-secondary text-fourth px-4 py-2 rounded-lg hover:bg-third transition disabled:opacity-50"
                    disabled={uploading}
                >
                    {uploading ? "Uploading..." : "Upload Image"}
                </button>
            )}
        </div>
    );
}
