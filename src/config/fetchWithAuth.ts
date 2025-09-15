import { useAuthStore } from "@/store/authStore";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const { accessToken, setAuth, clearAuth, user } = useAuthStore.getState();

  // Get refresh token from localStorage
  const refreshToken = localStorage.getItem("refreshToken");

  // Attach access token if available
  const headers = {
    ...options.headers,
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
    "Content-Type": "application/json",
  };

  let response = await fetch(`${BASE_URL}${url}`, { ...options, headers });

  // If token expired or invalid
  if (response.status === 401 && refreshToken) {
    try {
      const refreshRes = await fetch(`${BASE_URL}/users/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshRes.ok) {
        clearAuth();
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // force re-login
        throw new Error("Refresh token failed");
      }

      const data = await refreshRes.json();

      // Save new access token + refresh token
      setAuth(data.accessToken, user);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      // Retry original request with new token
      const retryHeaders = {
        ...options.headers,
        Authorization: `Bearer ${data.accessToken}`,
        "Content-Type": "application/json",
      };

      response = await fetch(`${BASE_URL}${url}`, { ...options, headers: retryHeaders });
    } catch (err) {
      console.error("Token refresh error:", err);
      throw err;
    }
  }

  return response;
}
