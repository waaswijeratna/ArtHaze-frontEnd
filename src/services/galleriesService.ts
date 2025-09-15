import { fetchWithAuth } from "@/config/fetchWithAuth";


const API_URL = `/galleries`;


export interface Gallery {
  _id: string;
  name: string;
  image: string;
  maxArts: number;
  modelUrl:string;
}

export const fetchGalleries = async (): Promise<Gallery[]> => {
    try {
        const response = await fetchWithAuth(API_URL, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch galleries");
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

