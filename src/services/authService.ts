const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_BASE_URL = `${BASE_URL}/users`;

interface UpdateUserData {
  id: string;
  name: string;
  email: string;
  age: number;
  pfpUrl: string;
  password?: string;
}

let userData: { id: string; name: string; email: string; age: number; pfpUrl: string } | null = null;

// Function to save user data to local storage
const saveUserDataToLocalStorage = (user: { id: string; name: string; email: string; age: number; pfpUrl: string }) => {
  localStorage.setItem("userData", JSON.stringify(user));
};

// Function to load user data from local storage
const loadUserDataFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      userData = JSON.parse(storedData);
    }
  }
};

loadUserDataFromLocalStorage();

const saveUserIdToLocalStorage = (userId: string) => {
  localStorage.setItem("userId", userId);
};

const decodeToken = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      age: Number(payload.age),
      pfpUrl: payload.pfpUrl || payload.pfp_url // Handle snake_case if needed
    };
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

export const registerUser = async (name: string, email: string, age: number, password: string, pfpUrl: string) => {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, age, password, pfpUrl }),
  });

  const data = await res.json();
  console.log("came data",data)
  if (res.ok) {
    const decodedData = decodeToken(data.token);
    if (decodedData) {
      saveUserIdToLocalStorage(decodedData.id);
      saveUserDataToLocalStorage(decodedData);
      userData = decodedData;
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
  console.log("came data",data)
  if (res.ok) {
    const decodedData = decodeToken(data.token);
    if (decodedData) {
      saveUserIdToLocalStorage(decodedData.id);
      saveUserDataToLocalStorage(decodedData);
      userData = decodedData;
    }
  }
  return data;
};

export const getProfile = () => {
  if (!userData) loadUserDataFromLocalStorage();
  return userData ? { ...userData } : null;
};

export const getProfileInfo = () => {
  if (!userData) loadUserDataFromLocalStorage();
  return userData ? { ...userData } : null;
};

export const updateUser = async (updatedUserData: UpdateUserData) => {
  try {
    const { id, ...updateData } = updatedUserData;

    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    const data = await res.json();

    if (res.ok) {
      let updatedUser = null;

      // Check if the backend returns a new token
      if (data.token) {
        localStorage.setItem("token", data.token);
        const decodedData = decodeToken(data.token);
        if (decodedData) {
          saveUserIdToLocalStorage(decodedData.id);
          saveUserDataToLocalStorage(decodedData);
          userData = decodedData;
          updatedUser = decodedData;
        }
      }

      // Extract user data from response (handle both nested and top-level)
      const responseUser = data.user || data;
      if (responseUser && !updatedUser) {
        // Ensure fields are correctly mapped (adjust for backend's field names)
        updatedUser = {
          id: responseUser.id,
          name: responseUser.name,
          email: responseUser.email,
          age: Number(responseUser.age),
          pfpUrl: responseUser.pfpUrl || responseUser.pfp_url,
        };
        saveUserDataToLocalStorage(updatedUser);
        userData = updatedUser;
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