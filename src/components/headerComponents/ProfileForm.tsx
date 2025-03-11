/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUser } from "@/services/authService";
import ImageUploader from "../ImageUploader";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  age: number;
  pfpUrl: string;
}

interface Props {
  initialData: ProfileData;
  onSwitch: () => void;

}

export default function ProfileForm({ initialData }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  const [age, setAge] = useState(initialData.age.toString());
  const [pfpUrl, setPfpUrl] = useState<string>(initialData.pfpUrl);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [serverError, setServerError] = useState("");

  const validateEmail = (email: string) => {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  };

  const handleSignOut = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userId");
    router.push("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const validationErrors: { name?: string; email?: string } = {};

    if (!name.trim()) {
      validationErrors.name = "Name is required";
    }
    if (!email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      validationErrors.email = "Enter a valid email address";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const updatedData: ProfileData = {
        id: initialData.id,
        name,
        email,
        age: Number(age),
        pfpUrl
      };

      const response = await updateUser(updatedData);
      if (response.success) {
        setIsEditing(false);
      } else {
        setServerError(response.message || "Update failed");
      }
    } catch (err) {
      setServerError("Something went wrong. Try again! " + err);
    }
  };

  return (
    <div className="w-full h-[80vh] overflow-auto scrollbar-hide mt-2 ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-third font-bold">Profile</h2>
        <button
          onClick={handleSignOut}
          className="cursor-pointer text-third hover:text-white flex items-center gap-2"
          title="Sign Out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>

      {serverError && <p className="text-red-500 mb-4">{serverError}</p>}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Name
            </label>
            <input
              type="text"
              className={`w-full bg-gray-800 text-white p-3 rounded-lg border ${errors.name ? "border-red-500" : "border-gray-700"
                } focus:border-third focus:outline-none`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: "" }));
              }}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              className={`w-full bg-gray-800 text-white p-3 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-700"
                } focus:border-third focus:outline-none`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Profile Picture
            </label>
            <ImageUploader
              onUpload={(url) => setPfpUrl(url)}
              onRemove={() => setPfpUrl("")}
              initialImage={pfpUrl}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Age
            </label>
            <input
              type="number"
              min="1"
              className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-third focus:outline-none"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="cursor-pointer flex-1 bg-secondary hover:bg-third duration-300 text-fourth p-3 rounded-lg"
            >
              Update Profile
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="cursor-pointer flex-1 bg-gray-500 hover:bg-gray-400 duration-300 text-fourth p-3 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6 flex flex-col jusify-between">

          <div className="flex items-center">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Profile Picture
              </label>
              <img src={pfpUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover border-2 border-third" />
            </div>

            <div className="ml-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Name - <span className="text-white text-lg">{name}</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Age - <span className="text-white text-lg">{age}</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Email
            </label>
            <p className="text-white text-lg">{email}</p>
          </div>


          <button
            onClick={() => setIsEditing(true)}
            className="cursor-pointer w-full bg-secondary mt-10 hover:bg-third duration-300 text-fourth p-3 rounded-lg"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}