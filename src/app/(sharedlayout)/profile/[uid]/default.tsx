"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { formatDate } from "@/lib/utils/utilities";

export default function Profile() {
  const { uid } = useParams();
  const profile_info = useSelector(
    (state: RootState) => state.user_slice.userData
  );
  // const [image, setImage] = useState<string>('/assets/profile.png');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `px-3 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 
     after:w-full after:h-[2px] after:bg-black after:transition-transform after:duration-300 
     ${pathname === path ? "after:scale-x-100" : "after:scale-x-0"}
     after:origin-left hover:after:scale-x-100 focus:after:scale-x-100`;

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  if (!profile_info || Object.keys(profile_info).length === 0) {
    return <ProfileSkeleton />;
  } else {
    return (
      <div className="space-y-12 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-gray-100 pb-10">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-normal text-gray-900 font-display tracking-tight leading-tight">
              Welcome, <span className="italic-serif text-primary-600">{profile_info?.first_name} {profile_info?.last_name}</span>
            </h1>
            <p className="text-sm text-gray-400 font-jakarta flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-pulse"></span>
              Member since {formatDate(profile_info?.createdAt as string)}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20 ring-4 ring-primary-50 rounded-2xl overflow-hidden shadow-lg border border-white">
              <Image
                src={
                  profile_info?.image_url
                    ? profile_info?.image_url
                    : "/assets/profile.png"
                }
                alt="Profile Avatar"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* navigation */}
        <div className="flex flex-wrap justify-center gap-3 p-1.5 bg-gray-50/50 rounded-2xl border border-gray-100 w-fit mx-auto mb-10">
          <Link
            href={`/profile/${uid}`}
            className={`px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-300 font-jakarta uppercase tracking-widest ${
              pathname === `/profile/${uid}` 
                ? "bg-white text-primary-600 shadow-md border border-primary-50" 
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
          >
            Profile Overview
          </Link>

          {!profile_info?.is_admin && (
            <Link
              href={`/profile/${uid}/wishlist`}
              className={`px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-300 font-jakarta uppercase tracking-widest ${
                pathname === `/profile/${uid}/wishlist` 
                  ? "bg-white text-primary-600 shadow-md border border-primary-50" 
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              Wishlist
            </Link>
          )}

          {!profile_info?.is_admin && (
            <Link
              href={`/profile/${uid}/my-bookings`}
              className={`px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-300 font-jakarta uppercase tracking-widest ${
                pathname === `/profile/${uid}/my-bookings` 
                  ? "bg-white text-primary-600 shadow-md border border-primary-50" 
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              My Bookings
            </Link>
          )}
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
      </div>
    );
  }
}

// skeleton for the above code

const ProfileSkeleton = () => {
  return (
    <div className="space-y-12 animate-pulse">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-gray-100 pb-10">
        <div className="space-y-2">
          <div className="h-10 md:h-12 w-64 bg-gray-200 rounded-lg"></div>
          <div className="h-4 w-48 bg-gray-100 rounded-full"></div>
        </div>
        <div className="w-20 h-20 bg-gray-200 rounded-2xl shadow-sm"></div>
      </div>

      <div className="flex flex-wrap gap-3 p-1.5 bg-gray-50 rounded-2xl border border-gray-100 w-fit">
        <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
        <div className="h-10 w-24 bg-gray-200 rounded-xl"></div>
        <div className="h-10 w-28 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
};
