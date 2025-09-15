"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { refreshAccessToken } from "@/services/authService"; // adjust path as needed

export default function AuthChecker({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Skip authentication check for login page
      if (pathname === "/login") {
        setLoading(false);
        return;
      }

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        router.push("/login");
        return;
      }

      // 🔄 Try refreshing access token
      const result = await refreshAccessToken();
      if (!result || !result.success) {
        // Clear refresh token and force login
        localStorage.removeItem("refreshToken");
        router.push("/login");
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (loading) {
    return <div className="h-screen text-white flex justify-center items-center">Loading...</div>;
  }

  return <>{children}</>;
}
