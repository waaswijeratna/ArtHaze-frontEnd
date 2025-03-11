"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/authService";
import ImageUploader from "./ImageUploader";

interface Props {
  onSwitch: () => void;
}

export default function SignupForm({ onSwitch }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [pfpUrl, setPfpUrl] = useState<string>("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [serverError, setServerError] = useState("");

  const validateEmail = (email: string) => {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const validationErrors: { name?: string; email?: string; password?: string } = {};

    if (!name.trim()) {
      validationErrors.name = "Name is required";
    }
    if (!email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      validationErrors.email = "Enter a valid email address";
    }
    if (!password.trim()) {
      validationErrors.password = "Password is required";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await registerUser(name, email, Number(age), password, pfpUrl);
      if (response.token) {
        router.push("/");
      } else {
        setServerError(response.message || "Registration failed");
      }
    } catch (err) {
      setServerError("Something went wrong. Try again! " + err);
    }
  };

  return (
    <div className="w-full h-[90vh] overflow-auto scrollbar-hide mt-2">
      <h2 className="text-xl text-third font-semibold mb-4">Sign Up</h2>
      {serverError && <p className="text-red-500">{serverError}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Name"
            className={`w-full text-white p-2 border rounded border-secondary focus:border-third focus:outline-none ${
              errors.name ? "border-red-500" : ""
            }`}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: "" }));
            }}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Email"
            className={`w-full text-white p-2 border rounded border-secondary focus:border-third focus:outline-none ${
              errors.email ? "border-red-500" : ""
            }`}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <ImageUploader onUpload={(url) => setPfpUrl(url)} onRemove={() => setPfpUrl("")} />

        <input
          type="number"
          min="1"
          placeholder="Age"
          className="w-full text-white p-2 border rounded border-secondary focus:border-third focus:outline-none"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <div>
          <input
            type="password"
            placeholder="Password"
            className={`w-full text-white p-2 border rounded border-secondary focus:border-third focus:outline-none ${
              errors.password ? "border-red-500" : ""
            }`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-secondary hover:bg-third duration-300 cursor-pointer text-fourth p-2 rounded"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-2 text-center text-white text-sm">
        Already have an account?{" "}
        <button onClick={onSwitch} className="text-third underline cursor-pointer">
          Login
        </button>
      </p>
    </div>
  );
}
