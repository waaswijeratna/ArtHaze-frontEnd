"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthChecker({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip authentication check for login page
    if (pathname === "/login") {
      setLoading(false);
      return;
    }

    // Check authentication for other pages
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router, pathname]);

  if (loading) {
    return <div className="h-screen flex justify-center items-center">Loading...</div>;
  }

  return <>{children}</>;
}