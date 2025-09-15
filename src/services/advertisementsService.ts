import { useAuthStore } from "@/store/authStore";
import { fetchWithAuth } from "@/config/fetchWithAuth";



const API_URL = "/advertisements";

interface FilterParams {
    search?: string;
    sortBy?: "time" | "name" | null;
    order?: "asc" | "desc" | null;
    sortUser?: string;
}

const buildQueryString = (params: FilterParams): string => {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.order) queryParams.append('order', params.order);
    if (params.sortUser) queryParams.append('sortUser', params.sortUser);
    
    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
};

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
    const userId = useAuthStore.getState().user?.id;

    if (!userId) {
      console.error("User ID not found");
      return null;
    }

    const adData = { ...data, userId };

    const response = await fetchWithAuth(`${API_URL}`, {
      method: "POST",
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

export const getUserAds = async (userId?:string, filters?: FilterParams) => {
  try {
    if (!userId) {
      console.error("User ID not found");
      return null;
    }

    const queryString = filters ? buildQueryString(filters) : '';
    const response = await fetchWithAuth(`${API_URL}/user/${userId}${queryString}`, {
      method: "GET",
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

export const getAllAds = async (filters?: FilterParams) => {
  try {
    const queryString = filters ? buildQueryString(filters) : '';
    const response = await fetchWithAuth(`${API_URL}${queryString}`, {
      method: "GET",
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
    const userId = useAuthStore.getState().user?.id;

    if (!userId) {
      console.error("User ID not found");
      return null;
    }

    const { id, ...rest } = data;
    const adData = { ...rest, userId };

    const response = await fetchWithAuth(`${API_URL}/${id}`, {
      method: "PUT",
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
    const response = await fetchWithAuth(`${API_URL}/${id}`, {
      method: "DELETE",
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
