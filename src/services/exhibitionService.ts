const API_URL = "http://localhost:5000/exhibitions";  

const getUserIdFromLocalStorage = () => {
    const user = localStorage.getItem("userId");
    if (user) {
        return user;
    }
    return null; 
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const submitExhibitionForm = async (formData: any) => {
    const userId = getUserIdFromLocalStorage();

    if (!userId) {
        throw new Error("User not logged in");
    }

    const dataToSend = {
        ...formData,
        userId, 
    };

    console.log("Submitting exhibition data:", dataToSend);

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
            throw new Error("Failed to submit exhibition data");
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getExhibitionsWithGalleryInfo = async () => {
    try {
        const response = await fetch(`${API_URL}/cards`);
        if (!response.ok) {
            throw new Error("Failed to fetch exhibition cards");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching exhibitions:", error);
        throw error;
    }
};

export const getExhibitionDetailsById = async (exhibitionId: string) => {
    try {
        console.log("ex",exhibitionId)
        const response = await fetch(`http://localhost:5000/exhibitions/details?exhibitionId=${exhibitionId}`);

        if (!response.ok) {
            throw new Error("Failed to fetch exhibition details");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching exhibition details:", error);
        throw error;
    }
};