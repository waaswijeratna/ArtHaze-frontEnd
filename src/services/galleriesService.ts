const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_URL = `${BASE_URL}/galleries`;


export interface Gallery {
  _id: string;
  name: string;
  image: string;
  maxArts: number;
  modelUrl:string;
}

export const fetchGalleries = async (): Promise<Gallery[]> => {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch galleries");
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

