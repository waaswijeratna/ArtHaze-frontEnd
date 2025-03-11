/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";

export default function ExhibitionCards() {
    const router = useRouter();

    const exhibitions = [
        {
            id: "1",
            name: "Soothing Arts!",
            imageUrl:
                "https://img.freepik.com/free-vector/gallery-interior-realistic_1284-4682.jpg?t=st=1741627166~exp=1741630766~hmac=fd8438e0ae82dc218ba150809f62cd79d16560b1f689b6945b8ad45d53cae7c5&w=1480",
            gallery: "Arcadia Arco",
            exhibitionBy: "ArtHaze",
        },
        {
            id: "2",
            name: "Creator Arts",
            imageUrl:
                "https://img.freepik.com/free-vector/gallery-interior-realistic_1284-4682.jpg?t=st=1741627166~exp=1741630766~hmac=fd8438e0ae82dc218ba150809f62cd79d16560b1f689b6945b8ad45d53cae7c5&w=1480",
            gallery: "Arcadia Arco",
            exhibitionBy: "ArtHaze",
        },
    ];

    const handleCardClick = (id: string) => {
        router.push(`/exhibitionsGallery?id=${id}`);
    };

    return (
        <div className="w-full h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                {exhibitions.map((data) => (
                    <div
                        key={data.id}
                        className="max-w-sm mx-auto bg-primary shadow-lg rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => handleCardClick(data.id)}
                    >
                        {/* Exhibition Name */}
                        <div className="px-4 py-2">
                            <h2 className="text-lg font-bold text-white">{data.name}</h2>
                        </div>

                        {/* Image with Overlay */}
                        <div className="relative">
                            <img
                                src={data.imageUrl}
                                alt={data.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-2">
                                <p className="text-white font-semibold">Gallery - {data.gallery}</p>
                            </div>
                        </div>

                        {/* Exhibition By */}
                        <div className="px-4 py-2">
                            <p className="text-third text-sm">
                                Exhibition by - {data.exhibitionBy}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
