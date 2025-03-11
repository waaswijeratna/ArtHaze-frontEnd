const API_URL = "http://localhost:5000/posts";

export const createPost = async (data: { name: string; description: string; imageUrl: string }) => {
  try {
    console.log("image?",data)
    const userId = localStorage.getItem("userId"); 

    if (!userId) {
      console.error("User ID not found in localStorage.");
      return null;
    }

    const postData = { ...data, userId};

    console.log("Submitting Post Data:", postData); 

    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error("Failed to create post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating post:", error);
    return null;
  }
};

// Get posts for a specific user
export const getUserPosts = async () => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found in localStorage.");
      return null;
    }

    const response = await fetch(`${API_URL}?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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

export const getFeed = async () => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found in localStorage.");
      return null;
    }

    const response = await fetch(`${API_URL}/feed?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID not found in localStorage.");
      return null;
    }

    const { postId, ...rest } = data;
    const postData = { ...rest, userId };

    const response = await fetch(`${API_URL}/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
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
    const response = await fetch(`${API_URL}/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
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
