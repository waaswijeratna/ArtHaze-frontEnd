import { useAuthStore } from "@/store/authStore";
import { fetchWithAuth } from "@/config/fetchWithAuth";

const API_URL = "/posts";

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

export const createPost = async (data: { name: string; description: string; imageUrl: string }) => {
  try {
    console.log("image?",data)
    const userId = useAuthStore.getState().user?.id; 

    if (!userId) {
      console.error("User ID not found");
      return null;
    }

    const postData = { ...data, userId};

    console.log("Submitting Post Data:", postData); 

    const response = await fetchWithAuth(`${API_URL}/create`, {
      method: "POST",
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error("Failed to create post it");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating post:", error);
    return null;
  }
};

// Get posts for a specific user
export const getUserPosts = async (userId:string, filters?: FilterParams) => {
  try {
    if (!userId) {
      console.error("User ID not found");
      return null;
    }

    const baseQuery = `userId=${userId}`;
    const filterQuery = filters ? buildQueryString(filters).replace('?', '&') : '';
    const response = await fetchWithAuth(`${API_URL}?${baseQuery}${filterQuery}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user posts");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return null;
  }
};

export const getFeed = async (filters?: FilterParams) => {
  try {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      console.error("User ID not found");
      return null;
    }

    const baseQuery = `userId=${userId}`;
    const filterQuery = filters ? buildQueryString(filters).replace('?', '&') : '';
    const response = await fetchWithAuth(`${API_URL}/feed?${baseQuery}${filterQuery}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch feed posts");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching feed posts:", error);
    return null;
  }
};


export const updatePost = async (data: { postId: string; name: string; description: string; imageUrl: string }) => {
  try {
    const userId = useAuthStore.getState().user?.id;

    if (!userId) {
      console.error("User ID not found");
      return null;
    }

    const { postId, ...rest } = data;
    const postData = { ...rest, userId };

    const response = await fetchWithAuth(`${API_URL}/${postId}`, {
      method: "PUT",
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error("Failed to update post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating post:", error);
    return null;
  }
};



export const deletePost = async (postId: string) => {
  try {
    const response = await fetchWithAuth(`${API_URL}/${postId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete post");
    }

    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    return false;
  }
};

export const toggleLike = async (postId: string) => {
  try {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      console.error("User ID not found");
      return null;
    }

    const response = await fetchWithAuth(`${API_URL}/${postId}/like`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to toggle like");
    }

    return await response.json();
  } catch (error) {
    console.error("Error toggling like:", error);
    return null;
  }
};

export const isPostLiked = async (postId: string) => {
  try {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      console.error("User ID not found");
      return false;
    }

    const response = await fetchWithAuth(`${API_URL}/${postId}/isLiked?userId=${userId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to check like status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking like status:", error);
    return false;
  }
};
