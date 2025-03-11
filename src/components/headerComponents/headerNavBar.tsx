"use client";

import { usePathname, useRouter } from "next/navigation";
import { FaHome, FaPhotoVideo, FaDonate, FaImages } from "react-icons/fa";

export default function HeaderNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  // Navigation function
  const handleNavigation = (path: string) => {
    router.push(`/${path}`);
  };

  // Nav items
  const navItems = [
    { name: "Feed", icon: <FaHome className="text-xl" />, path: "feed" },
    { name: "Exhibitions", icon: <FaPhotoVideo className="text-xl" />, path: "exhibitions" },
    { name: "Fundraising", icon: <FaDonate className="text-xl" />, path: "fundraising" },
    { name: "Advertisements", icon: <FaImages className="text-xl" />, path: "advertisements" },
  ];

  return (
    <div className="flex justify-center items-center">
      <ul className="flex space-x-8 p-4 rounded-lg shadow-lg">
        {navItems.map(({ name, icon, path }) => (
          <li
            key={path}
            className={`flex flex-col items-center justify-center cursor-pointer space-y-1 transition-all duration-300 
              ${pathname.includes(path) ? "text-third font-bold" : "text-secondary hover:text-third"}`}
            onClick={() => handleNavigation(path)}
          >
            <div>{icon}</div>
            <div className="text-xs">{name}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
