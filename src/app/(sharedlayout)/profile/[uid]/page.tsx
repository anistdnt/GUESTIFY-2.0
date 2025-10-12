"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

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

  const formatDate = (isodate: string) => {
    const currentDate = new Date(isodate);
    const date = currentDate.toLocaleDateString("en-GB", {
      weekday: "short", // 'Tue'
      day: "2-digit", // '07'
      month: "long", // 'June'
      year: "numeric", // '2022'
    });

    const [weekday, day, month, year] = date.split(" ");
    const formattedDate = `${weekday}, ${day} ${month} ${year}`;

    return formattedDate;
  };

  if (!profile_info || Object.keys(profile_info).length === 0) {
    return <ProfileSkeleton />;
  } else {
    return (
      <>
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className=" text-xl sm:text-3xl font-semibold text-gray-800">
              Welcome, {profile_info?.first_name} {profile_info?.last_name}
            </h1>
            <p className="text-gray-500 mt-1 max-sm:text-sm">
              Created At : {formatDate(profile_info?.createdAt as string)}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* <i
              onClick={handleModal}
              className="fa-solid fa-magnifying-glass text-black/50 sm:mr-4 cursor-pointer"
            ></i> */}
            <div className="relative w-12 h-12">
              <Image
                src={
                  profile_info?.image_url
                    ? profile_info?.image_url
                    : "/assets/profile.png"
                }
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
          <Link
            href={`/profile/${uid}`}
            className={linkClass(`/profile/${uid}`)}
          >
            Profile
          </Link>
          
          {profile_info?.is_admin && <Link
            href={`/profile/${uid}/mypg`}
            className={linkClass(`/profile/${uid}/mypg`)}
          >
            My Enlisted PGs
          </Link>}

          {profile_info?.is_admin && <Link
            href={`/profile/${uid}/stats`}
            className={linkClass(`/profile/${uid}/stats`)}
          >
            Statistics
          </Link>}

          {!profile_info?.is_admin && <Link
            href={`/profile/${uid}/wishlist`}
            className={linkClass(`/profile/${uid}/wishlist`)}
            >
              Wishlist
            </Link>
          }
          
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
}

// skeleton for the above code

const ProfileSkeleton = () => {
  return (
    <>
      <div className="flex justify-between items-center mb-10 animate-pulse">
        <div>
          <div className="h-6 sm:h-8 w-40 sm:w-64 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-48 bg-gray-200 rounded max-sm:w-40"></div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-6 w-6 bg-gray-300 rounded-full sm:mr-4"></div>
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>

      {/* navigation skeleton */}
      <div className="py-3 flex gap-4 mb-4 animate-pulse">
        <div className="h-6 w-20 bg-gray-300 rounded"></div>
        <div className="h-6 w-20 bg-gray-300 rounded"></div>
      </div>
    </>
  );
};
