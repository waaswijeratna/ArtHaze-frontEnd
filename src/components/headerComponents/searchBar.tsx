import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
    return (
        <div className="w-full max-w-md">
            <div className="bg-secondary rounded-full flex items-center px-4 py-1.5 shadow-md">
                <input type="text" placeholder="Search..." className="bg-transparent outline-none px-3 w-full text-[#09202C]" />
                <FaSearch className="text-primary text-lg cursor-pointer" />
            </div>
        </div>
    );
}
