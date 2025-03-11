const API_URL = "http://127.0.0.1:3658/m1/826407-806023-default/notices";

// Fetch all notices
export const getNotices = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("apidog", response)

    if (!response.ok) {
      throw new Error("Failed to fetch notices");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching notices:", error);
    return null;
  }
};