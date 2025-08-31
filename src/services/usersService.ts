// services/userService.ts
export const getUserProfile = async (userId: string) => {
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
  