import { fetchWithAuth } from "@/config/fetchWithAuth";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_BASE_URL = `${BASE_URL}/users`;
const API_URL = `/users`;

import { useAuthStore } from "@/store/authStore";

interface UpdateUserData {
  id: string;
  name: string;
  email: string;
  age: number;
  pfpUrl: string;
  password?: string;
}

// let userData: {
//   id: string;
//   name: string;
//   email: string;
//   age: number;
//   pfpUrl: string;
// } | null = null;

const saveRefreshToken = (refreshToken: string) => {
  localStorage.setItem("refreshToken", refreshToken);
};

// // Function to save user data to local storage
// const saveUserDataToLocalStorage = (user: {
//   id: string;
//   name: string;
//   email: string;
//   age: number;
//   pfpUrl: string;
// }) => {
//   localStorage.setItem("userData", JSON.stringify(user));
// };

// // Function to load user data from local storage
// const loadUserDataFromLocalStorage = () => {
//   if (typeof window !== "undefined") {
//     const storedData = localStorage.getItem("userData");
//     if (storedData) {
//       userData = JSON.parse(storedData);
//     }
//   }
// };

// loadUserDataFromLocalStorage();

// const saveUserIdToLocalStorage = (userId: string) => {
//   localStorage.setItem("userId", userId);
// };

const decodeToken = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      age: Number(payload.age),
      pfpUrl: payload.pfpUrl || payload.pfp_url, // Handle snake_case if needed
    };
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

export const registerUser = async (
  name: string,
  email: string,
  age: number,
  password: string,
  pfpUrl: string
) => {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, age, password, pfpUrl }),
  });

  const data = await res.json();
  console.log("came data", data);
  if (res.ok) {
    const { accessToken, refreshToken } = data;

    // Save refresh token in localStorage
    saveRefreshToken(refreshToken);

    // Decode access token → user
    const decodedUser = decodeToken(accessToken);

    // Save in Zustand
    if (decodedUser) {
      useAuthStore.getState().setAuth(accessToken, decodedUser);
    }
  }
  return data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  console.log("came data", data);
  if (res.ok) {
    const { accessToken, refreshToken } = data;

    saveRefreshToken(refreshToken);

    const decodedUser = decodeToken(accessToken);
    if (decodedUser) {
      useAuthStore.getState().setAuth(accessToken, decodedUser);
    }
  }
  return data;
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return { success: false, message: "No refresh token" };

  try {
    const res = await fetch(`${API_BASE_URL}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();

    if (res.ok) {
      const { accessToken } = data;
      const decodedUser = decodeToken(accessToken);

      if (decodedUser) {
        useAuthStore.getState().setAuth(accessToken, decodedUser);
        return { success: true, accessToken };
      }
    } else {
      // Backend sends descriptive error messages
      return {
        success: false,
        message: data.message || "Failed to refresh token",
      };
    }
  } catch (error) {
    console.error("Refresh token error:", error);
    return { success: false, message: "Network error while refreshing token" };
  }
};

export const getProfile = () => {
  const state = useAuthStore.getState();
  return state.user ? { ...state.user } : null;
};

export const getProfileInfo = () => {
  const state = useAuthStore.getState();
  return state.user ? { ...state.user } : null;
};

export const updateUser = async (updatedUserData: UpdateUserData) => {
  try {
    const { id, ...updateData } = updatedUserData;

    const res = await fetchWithAuth(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });

    const data = await res.json();

    if (res.ok) {
      let updatedUser = null;

      // If backend returns a new token
      if (data.token) {
        const decodedData = decodeToken(data.token);
        if (decodedData) {
          useAuthStore.getState().setAuth(data.token, decodedData);
          updatedUser = decodedData;
        }
      }

      // Otherwise, build updated user object from response
      const responseUser = data.user || data;
      if (responseUser && !updatedUser) {
        updatedUser = {
          id: responseUser.id,
          name: responseUser.name,
          email: responseUser.email,
          age: Number(responseUser.age),
          pfpUrl: responseUser.pfpUrl || responseUser.pfp_url,
        };

        //  update Zustand user with existing token
        const currentToken = useAuthStore.getState().accessToken;
        if (currentToken) {
          useAuthStore.getState().setAuth(currentToken, updatedUser);
        }
      }

      return {
        success: true,
        message: data.message || "Profile updated successfully",
        user: updatedUser,
        token: data.token,
      };
    } else {
      return {
        success: false,
        message: data.message || "Failed to update profile",
      };
    }
  } catch (error) {
    console.error("Update user error:", error);
    return {
      success: false,
      message: "An error occurred while updating profile",
    };
  }
};

