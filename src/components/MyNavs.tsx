"use client"; 

import { usePathname, useRouter } from "next/navigation";
import { FaHome, FaPhotoVideo, FaDonate, FaImages } from "react-icons/fa";

export default function MyNavs() {
  const router = useRouter();
  const pathname = usePathname();

  // Navigation function
  const handleNavigation = (path: string) => {
      router.push(`/${path}`);
  };

  // Nav items
  const navItems = [
    { name: "Feed", icon: <FaHome className="text-xl" />, path: "myFeed" },
    { name: "Exhibitions", icon: <FaPhotoVideo className="text-xl" />, path: "myExhibitions" },
    { name: "Fundraising", icon: <FaDonate className="text-xl" />, path: "myFundraising" },
    { name: "Advertisements", icon: <FaImages className="text-xl" />, path: "myAdvertisements" },
  ];

  return (
    <div className="w-full h-full bg-secondary rounded-xl">
      {/* Header */}
      <div className="bg-primary p-4 text-lg font-semibold rounded-xl text-third w-full h-[20%]">
        My
      </div>

      {/* Navigation List */}
      <ul className="p-4 flex flex-col justify-center items-baseline space-y-4 w-full h-[80%]">
        {navItems.map(({ name, icon, path }) => (
          <li
            key={path}
            className={`flex items-center space-x-3 cursor-pointer duration-300 
              ${pathname.includes(path) ? "text-primary font-bold" : "text-fourth hover:text-primary"}`}
            onClick={() => handleNavigation(path)}
          >
            {icon}
            <span>{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
