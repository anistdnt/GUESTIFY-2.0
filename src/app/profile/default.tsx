"use client"
import { useState } from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function Profile() {
    const [image, setImage] = useState<string>('/assets/profile.png');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    const pathname = usePathname();
    
      const linkClass = (path:string) =>
        `px-3 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 
         after:w-full after:h-[2px] after:bg-black after:transition-transform after:duration-300 
         ${pathname === path ? 'after:scale-x-100' : 'after:scale-x-0'}
         after:origin-left hover:after:scale-x-100 focus:after:scale-x-100`;

    const handleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const currentDate = new Date();
    const date = currentDate.toLocaleDateString('en-GB', {
        weekday: 'short',  // 'Tue'
        day: '2-digit',    // '07'
        month: 'long',     // 'June'
        year: 'numeric',   // '2022'
    });

    const [weekday, day, month, year] = date.split(' ');
    const formattedDate = `${weekday}, ${day} ${month} ${year}`;

    return (
        <>
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className=" text-xl sm:text-3xl font-semibold text-gray-800">Welcome, Arkabrata</h1>
                    <p className="text-gray-500 mt-1 max-sm:text-sm">{formattedDate}</p>
                </div>
                <div className="flex items-center space-x-4">
                    <i onClick={handleModal} className="fa-solid fa-magnifying-glass text-black/50 sm:mr-4 cursor-pointer"></i>
                    <div className="relative w-12 h-12">
                        <Image
                            src={image}
                            alt="Profile Avatar"
                            className="rounded-full"
                            fill
                            objectFit="cover"
                        />
                    </div>
                </div>
            </div>

            {/* navigation */}
            <div className=" py-3 flex gap-4 font-semibold mb-4">
                <Link href="/profile" className={linkClass("/profile")}>
                    Profile
                </Link>
                <Link href="/profile/mypg" className={linkClass("/profile/mypg")}>
                    My PG
                </Link>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Search</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        {/* Search Input */}
                        <div>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Type your search..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>

                        {/* Search Results Placeholder */}
                        <div className="mt-4">
                            {query ? (
                                <p className="text-gray-700">Searching for: {query}</p>
                            ) : (
                                <p className="text-gray-500">Start typing to search...</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
