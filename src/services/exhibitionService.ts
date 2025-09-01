const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_URL = `${BASE_URL}/exhibitions`;

interface FilterParams {
    search?: string;
    sortBy?: "time" | "name" | null;
    order?: "asc" | "desc" | null;
    sortUser?: string;
}

const getUserIdFromLocalStorage = () => {
    const user = localStorage.getItem("userId");
    return user ? user : null;
};

const buildQueryString = (params: FilterParams): string => {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.order) queryParams.append('order', params.order);
    if (params.sortUser) queryParams.append('sortUser', params.sortUser);
    
    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
};

// ✅ Create Exhibition
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const submitExhibitionForm = async (formData: any) => {
    const userId = getUserIdFromLocalStorage();
    if (!userId) throw new Error("User not logged in");

    const dataToSend = { ...formData, userId };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToSend),
        });

        if (!response.ok) throw new Error("Failed to submit exhibition data");

        return await response.json();
    } catch (error) {
        throw error;
    }
};

// ✅ Get Exhibition Cards
export const getExhibitionsWithGalleryInfo = async (filters?: FilterParams) => {
    try {
        const queryString = filters ? buildQueryString(filters) : '';
        const response = await fetch(`${API_URL}/cards${queryString}`);
        if (!response.ok) throw new Error("Failed to fetch exhibition cards");

        return await response.json();
    } catch (error) {
        console.error("Error fetching exhibitions:", error);
        throw error;
    }
};

// ✅ Get Exhibition Details by ID
export const getExhibitionDetailsById = async (exhibitionId: string) => {
    try {
        const response = await fetch(`${API_URL}/details?exhibitionId=${exhibitionId}`);
        if (!response.ok) throw new Error("Failed to fetch exhibition details");

        return await response.json();
    } catch (error) {
        console.error("Error fetching exhibition details:", error);
        throw error;
    }
};



// ✅ Get Exhibitions By User ID
export const getExhibitionsByUserId = async (userId?:string, filters?: FilterParams) => {
    try {
        // const userId = getUserIdFromLocalStorage();
        if (!userId) throw new Error("User not logged in");

        const queryString = filters ? buildQueryString(filters) : '';
        const response = await fetch(`${API_URL}/user/${userId}${queryString}`);
        if (!response.ok) throw new Error("Failed to fetch exhibitions by user ID");

        return await response.json();
    } catch (error) {
        console.error("Error fetching user exhibitions:", error);
        throw error;
    }
};



// ✅ Update Exhibition
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateExhibition = async (exhibitionId: string, formData: any) => {
    try {
        const response = await fetch(`${API_URL}/${exhibitionId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to update exhibition");

        return await response.json();
    } catch (error) {
        console.error("Error updating exhibition:", error);
        throw error;
    }
};

// ✅ Delete Exhibition
export const deleteExhibition = async (exhibitionId: string) => {
    try {
        const response = await fetch(`${API_URL}/${exhibitionId}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete exhibition");

        return await response.json();
    } catch (error) {
        console.error("Error deleting exhibition:", error);
        throw error;
    }
};

export const confirmStripePayment = async (sessionId: string) => {
    try {
        const response = await fetch(`${BASE_URL}/stripe/confirm-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) throw new Error("Failed to confirm payment");

        return await response.json();
    } catch (error) {
        console.error("Error confirming payment:", error);
        throw error;
    }
};

export const getAllExhibitions = async (filters?: {
  search?: string;
  sortBy?: "time" | "name" | null;
  order?: "asc" | "desc" | null;
  sortUser?: string;
}) => {
  try {
    const query = new URLSearchParams();

    if (filters?.search) query.append("search", filters.search);
    if (filters?.sortBy) query.append("sortBy", filters.sortBy);
    if (filters?.order) query.append("order", filters.order);
    if (filters?.sortUser) query.append("sortUser", filters.sortUser);

    const response = await fetch(`${API_URL}?${query.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch all exhibitions");

    return await response.json();
  } catch (error) {
    console.error("Error fetching all exhibitions:", error);
    throw error;
  }
};