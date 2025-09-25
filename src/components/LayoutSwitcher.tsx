"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/headerComponents/Header";
import CreatePost from "@/components/CreatePost";
import MyNavs from "@/components/MyNavs";
import Notices from "@/components/Notices";
import FallingLeavesOverlay from "./FallingLeaves";
import { SearchFilterProvider } from "./SearchFilterContext";


export default function LayoutSwitcher({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Render only children (no layout) on login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Render only children (no layout) on login page
  if (pathname === "/exhibitionsGallery") {
    return <>{children}</>;
  }

  // Full layout for other routes
  return (
    <SearchFilterProvider>
      <div className="flex flex-col h-[100vh]">
        <FallingLeavesOverlay />
        <div className="w-full h-[10%]">
          <Header />
        </div>
        <div className="w-full h-[90%] flex flex-row">
          <div className="w-[22vw] h-full">
            <div className="w-full h-[40%] p-4"><CreatePost /></div>
            <div className="w-full h-[60%] p-4"><MyNavs /></div>
          </div>
          <div className="w-[56vw] h-full p-4">{children}</div>
          <div className="w-[22vw] h-full">
            {/* <div className="w-full h-[50%] p-4"><Messages /></div> */}
            <div className="w-full h-[100%] p-4"><Notices /></div>
          </div>
        </div>
      </div>
    </SearchFilterProvider>
  );
}