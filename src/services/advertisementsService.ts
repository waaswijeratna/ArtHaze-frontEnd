const API_URL = "http://localhost:5000/advertisements";

export const createAd = async (data: { 
  name: string; 
  description: string; 
  price: string; 
  category: string; 
  imageUrl: string; 
  contact: string;
}) => {
  try {
    console.log("Creating Ad:", data);
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID not found in localStorage.");
      return null;
    }

    const adData = { ...data, userId };

    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adData),
    });

    if (!response.ok) {
      throw new Error("Failed to create advertisement");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating advertisement:", error);
    return null;
  }
};

export const getUserAds = async () => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found in localStorage.");
      return null;
    }

    const response = await fetch(`${API_URL}/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user advertisements");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user advertisements:", error);
    return null;
  }
};

export const getAllAds = async () => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch advertisements");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching advertisements:", error);
    return null;
  }
};

export const updateAd = async (data: { 
  id: string; 
  name: string; 
  description: string; 
  price: string; 
  category: string; 
  imageUrl: string; 
  contact: string;
}) => {
  try {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID not found in localStorage.");
      return null;
    }

    const { id, ...rest } = data;
    const adData = { ...rest, userId };

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adData),
    });

    if (!response.ok) {
      throw new Error("Failed to update advertisement");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating advertisement:", error);
    return null;
  }
};

export const deleteAd = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete advertisement");
    }

    return true;
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    return false;
  }
};
