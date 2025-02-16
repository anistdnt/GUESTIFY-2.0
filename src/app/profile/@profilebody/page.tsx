"use client"
import { useState } from "react";
import Image from "next/image";
import { FaEnvelope } from "react-icons/fa";


const Page = () => {

    const [isEditing, setIsEditing] = useState<boolean>(false);
      const [image, setImage] = useState<string>('/assets/profile.png');

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


  return (
    <div>
      <div className="flex flex-col">
          {/* up Section */}
          <div className="w-full flex flex-row justify-between mb-10">
            <div>

              <div className="relative w-28 h-28 mb-4">
                <Image
                  src={image}
                  alt="Profile Image"
                  className="rounded-full"
                  fill
                  objectFit="cover"
                />
                <button
                  onClick={() => document.getElementById('fileInput')?.click()}
                  className={isEditing ? "absolute h-9 w-9 bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100" : "hidden"}

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
              <h2 className="text-2xl font-semibold text-gray-800">Arkabrata Chandra</h2>
              <p className="text-gray-600">abcdefg@gmail.com</p>
            </div>
            <button
              className="flex items-center justify-center w-[93px] h-[44px] mt-6 px-6 bg-black/70 text-white rounded-lg hover:bg-black/80"
              onClick={handleEditToggle}
            >
              <i className={!isEditing ? "fa-solid fa-pen-to-square text-[14px] mr-3 mb-1" : "hidden"}></i> {isEditing ? "Confirm" : "Edit"}
            </button>
          </div>

          {/* down Section */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
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
  )
}

export default Page
