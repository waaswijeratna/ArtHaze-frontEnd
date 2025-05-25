"use client"

import { useState, useEffect } from "react";
import ImageUploader from "../ImageUploader";
import { submitExhibitionForm } from "../../services/exhibitionService";
import { fetchGalleries } from "../../services/galleriesService";

export default function ExhibitionForm() {
    const [name, setName] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [galleryList, setGalleryList] = useState<any[]>([]);
    const [selectedGalleryId, setSelectedGalleryId] = useState<string>("");
    const [artImages, setArtImages] = useState<string[]>([]);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const [errors, setErrors] = useState({ name: "", images: "", date: "", time: "" });
    const [isValid, setIsValid] = useState(false);

    const selectedGallery = galleryList.find((g) => g._id === selectedGalleryId);
    const maxArts = selectedGallery?.maxArts || 0;

    const today = new Date().toISOString().split("T")[0];
    const getCurrentTime = () => new Date().toTimeString().slice(0, 5);
    const isToday = date === today;

    useEffect(() => {
        fetchGalleries()
            .then(setGalleryList)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch((err: any) => console.error("Failed to load galleries", err));
    }, []);

    useEffect(() => {
        const newErrors = {
            name: name.trim() ? "" : "Name is required.",
            images: artImages.length === 0 ? "At least one image is required." : "",
            date: !date ? "Date is required." : (new Date(date) < new Date(today) ? "Date cannot be in the past." : ""),
            time: !time ? "Time is required." : (isToday && time < getCurrentTime() ? "Time cannot be in the past." : "")
        };

        setErrors(newErrors);
        setIsValid(Object.values(newErrors).every((msg) => msg === ""));
    }, [name, artImages, date, time]);

    const handleUpload = (url: string) => {
        if (artImages.length < maxArts) {
            setArtImages((prev) => [...prev, url]);
        }
    };

    const handleRemove = (index: number) => {
        setArtImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        const formData = {
            name,
            gallery: selectedGalleryId, // ✅ sending ID
            artImages,
            date,
            time,
        };

        try {
            const response = await submitExhibitionForm(formData);
            console.log("Exhibition submitted successfully", response);
        } catch (error) {
            console.error("Error submitting exhibition", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 space-y-6">
            {/* Name */}
            <div>
                <label className="block font-bold mb-1">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Gallery */}
            <div>
                <label className="block font-bold mb-2">Select Gallery</label>
                <div className="flex gap-4 overflow-x-auto">
                    {galleryList.map((gallery) => (
                        <div
                            key={gallery._id}
                            className={`cursor-pointer border rounded-lg p-2 transition hover:scale-105 ${
                                selectedGalleryId === gallery._id ? "border-blue-500" : "border-gray-300"
                            }`}
                            onClick={() => {
                                setSelectedGalleryId(gallery._id);
                                setArtImages([]);
                            }}
                        >
                            <img src={gallery.image} alt={gallery.name} className="w-32 h-32 object-cover rounded-md" />
                            <p className="text-center mt-2 font-semibold">{gallery.name}</p>
                            <p className="text-center text-sm text-gray-500">Max {gallery.maxArts} arts</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Uploads */}
            <div>
                <label className="block font-bold mb-2">
                    Upload Arts ({artImages.length} / {maxArts})
                </label>
                <div className="grid grid-cols-3 gap-4">
                    {artImages.map((url, index) => (
                        <ImageUploader
                            key={index}
                            initialImage={url}
                            onUpload={(updatedUrl) =>
                                setArtImages((prev) => prev.map((img, i) => (i === index ? updatedUrl : img)))
                            }
                            onRemove={() => handleRemove(index)}
                        />
                    ))}
                    {artImages.length < maxArts && (
                        <ImageUploader
                            key={`uploader-${artImages.length}`}
                            onUpload={handleUpload}
                            onRemove={() => {}}
                        />
                    )}
                </div>
                {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
            </div>

            {/* Date */}
            <div>
                <label className="block font-bold mb-1">Date</label>
                <input
                    type="date"
                    value={date}
                    min={today}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            {/* Time */}
            <div>
                <label className="block font-bold mb-1">Time</label>
                <input
                    type="time"
                    value={time}
                    disabled={!date}
                    min={isToday ? getCurrentTime() : undefined}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2 border rounded disabled:bg-gray-100"
                />
                {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={!isValid}
                className={`w-full text-white py-2 rounded transition ${
                    isValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                }`}
            >
                Submit
            </button>
        </form>
    );
}
