import { fetchWithAuth } from "@/config/fetchWithAuth";


// services/userService.ts
export const getUserProfile = async (userId: string) => {
    try {
      const response = await fetchWithAuth(`/users/${userId}`, {
        method: "GET",
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
  
      const data = await response.json();
      return data; // Assuming the response contains { id, name, pfpUrl }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };
  