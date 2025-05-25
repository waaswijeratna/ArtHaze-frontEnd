export interface Exhibition {
    id?: string;
    name: string;
    startDate: string;
    endDate: string;
    gallery: string;
    images: string[];
}

export interface Advertisements {
    id?: string;
    name: string;
    description: string;
    price: string;
    category: string;
    imageUrl: string;
    userId:string;
    contact:string;
    createdAt:string;
}
