const API_URL = "http://localhost:5000/galleries";  


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

