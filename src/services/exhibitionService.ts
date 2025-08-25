const API_URL = "http://localhost:5000/exhibitions";

const getUserIdFromLocalStorage = () => {
    const user = localStorage.getItem("userId");
    return user ? user : null;
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
export const getExhibitionsWithGalleryInfo = async () => {
    try {
        const response = await fetch(`${API_URL}/cards`);
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
export const getExhibitionsByUserId = async () => {
    try {
        const userId = getUserIdFromLocalStorage();
        if (!userId) throw new Error("User not logged in");

        const response = await fetch(`${API_URL}/user/${userId}`);
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
        const response = await fetch("http://localhost:5000/stripe/confirm-payment", {
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


