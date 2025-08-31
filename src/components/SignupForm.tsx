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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pfpUrl, setPfpUrl] = useState<string>("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [serverError, setServerError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<string>("");

  const validateEmail = (email: string) => {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  };

  // Password validation helpers
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (score === 0) return "";
    if (score === 1) return "Weak";
    if (score === 2) return "Medium";
    if (score >= 3) return "Strong";
    return "";
  };

  const validatePassword = (pwd: string) => {
    const messages = [];
    if (pwd.length < 8) messages.push("At least 8 characters");
    if (!/[A-Z]/.test(pwd)) messages.push("At least one capital letter");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) messages.push("At least one special character");
    return messages;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const validationErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

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
    } else {
      const pwdMessages = validatePassword(password);
      if (pwdMessages.length > 0) {
        validationErrors.password = pwdMessages.join(", ");
      }
    }
    if (!confirmPassword.trim()) {
      validationErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
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
              setPasswordStrength(getPasswordStrength(e.target.value));
            }}
            onBlur={() => setPasswordStrength(getPasswordStrength(password))}
          />
          {password && (
            <p className={`text-xs mt-1 ${
              passwordStrength === "Strong"
                ? "text-green-500"
                : passwordStrength === "Medium"
                ? "text-yellow-500"
                : passwordStrength === "Weak"
                ? "text-red-500"
                : "text-gray-400"
            }`}>
              Password strength: {passwordStrength}
            </p>
          )}
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            className={`w-full text-white p-2 border rounded border-secondary focus:border-third focus:outline-none ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
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
