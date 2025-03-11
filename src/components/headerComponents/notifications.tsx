"use client";

import { useState } from "react";
import { FaBell, FaTimes } from "react-icons/fa";

export default function Notifications() {
    // Hardcoded notification data
    const notifications = [
        "Your artwork ‘Sunset Bliss’ received 10 new likes!",
        "Someone commented on your post: ‘Amazing details!’",
        "Congrats! You’ve been featured in ‘Artist Spotlight’!",
        "New art exhibition ‘Digital Visions’ is happening soon!",
        "Your artwork ‘Abstract Dreams’ has been sold!",
    ];

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <div className="relative cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <FaBell className="text-2xl text-secondary" />
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-3 bg-third text-fourth text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {notifications.length}
                    </span>
                )}
            </div>

            {/* Notification Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-primary shadow-md shadow-secondary/40 rounded-lg p-4 z-50">
                    <div className="flex justify-between items-center border-b border-secondary pb-2 mb-2">
                        <h2 className="text-lg text-third font-semibold">Notifications</h2>
                        <FaTimes
                            className="text-secondary cursor-pointer hover:text-third"
                            onClick={() => setIsOpen(false)}
                        />
                    </div>

                    <ul className="space-y-2">
                        {notifications.map((notif, index) => (
                            <li key={index} className="text-secondary text-sm p-2 bg-fourth rounded-md">
                                {notif}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
