const API_URL = "http://localhost:5000/campaigns";

export const createFundraisingCampaign = async (data: {
  title: string;
  reason: string;
  imageUrl: string;
  stripeAccountId: string;
}) => {
  try {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID not found in localStorage.");
      return null;
    }

    const campaignData = { ...data, userId };

    console.log("Submitting Campaign Data:", campaignData);

    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(campaignData),
    });

    if (!response.ok) {
      throw new Error("Failed to create campaign");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating campaign:", error);
    return null;
  }
};

// Get all campaigns of current user
export const getUserCampaigns = async () => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) throw new Error("No userId found in localStorage");

    const response = await fetch(`${API_URL}/user/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch user campaigns");

    return await response.json();
  } catch (err) {
    console.error("getUserCampaigns error:", err);
    return [];
  }
};

export const deleteCampaign = async (campaignId: string) => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) throw new Error("User ID not found");

    const response = await fetch(`${API_URL}/${campaignId}?userId=${userId}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete campaign");

    return true;
  } catch (err) {
    console.error("deleteCampaign error:", err);
    return false;
  }
};

