"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/authService";

interface Props {
  onSwitch: () => void;
}

export default function LoginForm({ onSwitch }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState("");

  const validateEmail = (email: string) => {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const validationErrors: { email?: string; password?: string } = {};

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
      const response = await loginUser(email, password);
      if (response.accessToken) {
        router.push("/");
      } else {
        setServerError(response.message || "Login failed");
      }
    } catch (err) {
      setServerError("Something went wrong. Try again! " + err);
    }
  };

  return (
    <div className="w-full h-[90vh] overflow-auto scrollbar-hide mt-2 flex flex-col justify-around">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-third">Login</h2>
        {serverError && <p className="text-red-500">{serverError}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

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
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-secondary hover:bg-third duration-300 cursor-pointer text-fourth p-2 rounded"
          >
            Login
          </button>
        </form>
      </div>

      <p className="mt-4 text-center text-white">
        Don&apos;t have an account?{" "}
        <button onClick={onSwitch} className="text-third underline cursor-pointer">
          Sign up
        </button>
      </p>
    </div>
  );
}
