"use client"
import { useState } from "react";
import Image from "next/image";
import { FaEdit, FaEnvelope } from "react-icons/fa";
export default function ProfileSettings() {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">Welcome, Arkabrata</h1>
            <p className="text-gray-500 mt-1">Tue, 07 June 2022</p>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            <div className="relative w-12 h-12">
              <Image
                src="/assets/profile.png"
                alt="Profile Avatar"
                className="rounded-full"
                fill
                objectFit="cover"
              />
            </div>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="flex flex-col">
          {/* up Section */}
          <div className="w-full flex flex-row justify-between mb-10">
            <div>

            <div className="relative w-28 h-28 mb-4">
              <Image
                src="/assets/profile.png"
                alt="Profile Image"
                className="rounded-full"
                fill
                objectFit="cover"
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Arkabrata Chandra</h2>
            <p className="text-gray-600">abcdefg@gmail.com</p>
            </div>
            <button
              className="flex items-center w-[93px] h-[44px] mt-6 px-6 py-2 bg-black/70 text-white rounded-lg hover:bg-black/80"
              onClick={handleEditToggle}
            >
              <FaEdit className="mr-2" /> {isEditing ? "Confirm" : "Edit"}
            </button>
          </div>

          {/* Right Section */}
          <div className="flex-1 grid grid-cols-2 gap-8">
            <div>
              <label className="block text-gray-700 font-medium">Full Name</label>
              <input
                type="text"
                placeholder="Your Full Name"
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                readOnly={!isEditing}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                placeholder="Your Email Address"
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                readOnly={!isEditing}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Gender</label>
              <select
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                disabled={!isEditing}
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
              >
                <option>Select Country</option>
                <option>India</option>
                <option>USA</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Language</label>
              <select
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                disabled={!isEditing}
              >
                <option>Select Language</option>
                <option>English</option>
                <option>Spanish</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Time Zone</label>
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
          <h3 className="text-lg font-semibold text-gray-800">My Email Address</h3>
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
    </div>
  );
}
