/* eslint-disable @next/next/no-img-element */
import UserProfile from "./userProfile";
import SearchBar from "./searchBar";
import HeaderNavBar from "./headerNavBar";
import Notifications from "./notifications";

export default function Header() {
  return (
    <div className="w-full h-full bg-fourth py-5 px-5 flex items-center shadow-md shadow-primary/20 z-100">
      {/* Left Section: Logo & SearchBar */}
      <div className="flex items-center flex-1">
        <img src="images/logo.png" alt="logo" className="w-9 h-9 rounded-full object-cover mr-4" />
        <div className="w-[25vw]">
          <SearchBar />
        </div>
      </div>

      {/* Center Section: HeaderNavBar */}
      <div className="flex justify-center flex-1">
        <HeaderNavBar />
      </div>

      {/* Right Section: Notifications & UserProfile */}
      <div className="flex items-center justify-end flex-1 space-x-7">
        <Notifications />
        <UserProfile />
      </div>
    </div>
  );
}
