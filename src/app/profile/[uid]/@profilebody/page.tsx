"use client";
import { useState } from "react";
import Image from "next/image";
import { FaEnvelope } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Page = () => {
  const reduxUserData = useSelector(
    (state: RootState) => state.user_slice.userData
  );

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [image, setImage] = useState<string>("/assets/profile.png");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  if (Object.keys(reduxUserData).length === 0) {
    <PageSkeleton />;
  } else {
    return (
      <div>
        <div className="flex flex-col">
          {/* up Section */}
          <div className="w-full flex flex-row justify-between mb-10">
            <div>
              <div className="relative w-28 h-28 mb-4">
                <Image
                  src={
                    reduxUserData?.image_url ? reduxUserData?.image_url : image
                  }
                  alt="Profile Image"
                  className="rounded-full"
                  fill
                  objectFit="cover"
                />
                <button
                  onClick={() => document.getElementById("fileInput")?.click()}
                  className={
                    isEditing
                      ? "absolute h-9 w-9 bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                      : "hidden"
                  }
                >
                  <i className="fas fa-pencil-alt  text-gray-700"></i>
                </button>
                {/* delete button will be implemented with api */}

                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {reduxUserData?.first_name} {reduxUserData?.last_name}
              </h2>
              <p className="text-gray-600">{reduxUserData?.email}</p>
            </div>
            <button
              className="flex items-center justify-center w-[93px] h-[44px] mt-6 px-6 bg-black/70 text-white rounded-lg hover:bg-black/80"
              onClick={handleEditToggle}
            >
              <i
                className={
                  !isEditing
                    ? "fa-solid fa-pen-to-square text-[14px] mr-3 mb-1"
                    : "hidden"
                }
              ></i>{" "}
              {isEditing ? "Confirm" : "Edit"}
            </button>
          </div>

          {/* down Section */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-gray-700 font-medium">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your Full Name"
                value={`${reduxUserData?.first_name} ${reduxUserData?.last_name}`}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                readOnly={!isEditing}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                placeholder="Your Email Address"
                value={reduxUserData?.email}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                readOnly={!isEditing}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Gender</label>
              <select
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                disabled={!isEditing}
                value={
                  reduxUserData?.gender === null ? "" : reduxUserData?.gender
                }
              >
                <option>Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Country</label>
              <select
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                disabled={!isEditing}
                value={
                  reduxUserData?.district === null
                    ? ""
                    : reduxUserData?.district
                }
              >
                <option>Select Country</option>
                <option>India</option>
                <option>USA</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                Language
              </label>
              <select
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                disabled={!isEditing}
                value={
                  reduxUserData?.mother_tongue === null
                    ? ""
                    : reduxUserData?.mother_tongue
                }
              >
                <option>Select Language</option>
                <option>English</option>
                <option>Spanish</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                Time Zone
              </label>
              <select
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                disabled={!isEditing}
              >
                <option>Select Time Zone</option>
                <option>GMT</option>
                <option>PST</option>
              </select>
            </div>
          </div>
        </div>

        {/* Additional Email Section */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-gray-800">
            My Email Address
          </h3>
          <div className="flex items-center mt-4 p-4 bg-gray-100 rounded-lg">
            <FaEnvelope className="text-gray-600 mr-4" />
            <div>
              <p className="text-gray-800">alexarawles@gmail.com</p>
              <p className="text-gray-500 text-sm">1 month ago</p>
            </div>
          </div>
          <button className="mt-6 px-6 py-2 bg-black/70 text-white rounded-lg hover:bg-black/80">
            + Add Email Address
          </button>
        </div>
      </div>
    );
  }
};

export default Page;

// skeleton loader

const PageSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Top Section */}
      <div className="flex flex-row justify-between mb-10">
        <div>
          <div className="relative w-28 h-28 mb-4">
            <div className="rounded-full bg-gray-300 w-full h-full" />
          </div>
          <div className="h-6 w-48 bg-gray-300 rounded mb-2" />
          <div className="h-4 w-60 bg-gray-300 rounded" />
        </div>
        <div className="w-[93px] h-[44px] bg-gray-300 rounded-lg" />
      </div>

      {/* Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="h-4 w-32 bg-gray-300 rounded mb-2" />
            <div className="h-12 bg-gray-300 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Email Section */}
      <div className="mt-10">
        <div className="h-5 w-48 bg-gray-300 rounded mb-4" />
        <div className="flex items-center p-4 bg-gray-100 rounded-lg">
          <div className="w-10 h-10 bg-gray-300 rounded-full mr-4" />
          <div>
            <div className="h-4 w-40 bg-gray-300 rounded mb-1" />
            <div className="h-3 w-24 bg-gray-300 rounded" />
          </div>
        </div>
        <div className="mt-6 w-48 h-10 bg-gray-300 rounded-lg" />
      </div>
    </div>
  );
};
