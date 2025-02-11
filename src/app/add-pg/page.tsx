"use client";
import { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

type RooomType = {
  image : string | null,
}

export default function PGForm() {
  const [pgImage, setPgImage] = useState<string | null>(null);
  const [rooms, setRooms] = useState<RooomType[]>([{ image: null }]);

  const addRoom = () => setRooms([...rooms, { image: null }]);

  const handlePGImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPgImage(imageUrl);
    }
  };

  const handleRoomImageChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) : void => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const updatedRooms = [...rooms];
      updatedRooms[index].image = imageUrl;
      setRooms(updatedRooms);
    }
  };

  const removeRoom = (index: number):void => {
    if (rooms.length > 1) {
      const updatedRooms = rooms.filter((_, i) => i !== index);
      setRooms(updatedRooms);
    }
  };

  async function handleFormSubmit (e : React.FormEvent<HTMLElement>) : Promise<void> {
    
    e.preventDefault();

    // the submit api will be handled here

  }

  return (
    <div className="bg-yellow-100 min-h-screen py-8 px-4">
      <form className="mx-auto max-w-7xl" onSubmit={handleFormSubmit}>
        <h2 className="text-2xl font-bold mb-4">PG Information</h2>
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Name of the PG" className="p-2 border rounded" />
            <input type="text" placeholder="Street Name" className="p-2 border rounded" />
            <input type="text" placeholder="House No" className="p-2 border rounded" />
            <input type="text" placeholder="State" className="p-2 border rounded" />
            <select className="p-2 border rounded">
              <option>Country</option>
              <option>India</option>
              <option>USA</option>
            </select>
            <select className="p-2 border rounded">
              <option>WiFi Availability</option>
              <option>Yes</option>
              <option>No</option>
            </select>
            <select className="p-2 border rounded">
              <option>AC Availability</option>
              <option>Yes</option>
              <option>No</option>
            </select>
            <select className="p-2 border rounded">
              <option>Food Availability</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
          <textarea placeholder="Rules of the PG" className="p-2 border rounded w-full mb-4" />

          {/* PG Image Upload Section */}
          <div className="w-full border-dashed border-2 border-gray-300 flex items-center justify-center py-6 rounded relative mb-4">
            {pgImage ? (
              <div className="relative">
                <img src={pgImage} alt="PG" className="w-64 h-64 object-cover rounded" />
                <label className="absolute bottom-0 right-0 bg-blue-500 text-white px-2 py-1 text-sm cursor-pointer rounded">
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePGImageChange}
                  />
                </label>
              </div>
            ) : (
              <label className="cursor-pointer">
                <span className="text-gray-600 bg-slate-300 rounded px-3 py-1 hover:bg-slate-200">Upload Images</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePGImageChange}
                />
              </label>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Room Details</h2>
        {rooms.map((room, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md mb-8 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <select className="p-2 border rounded">
                <option>Type of Room</option>
                <option>Single</option>
                <option>Double</option>
              </select>
              <input type="text" placeholder="Rent of the Room" className="p-2 border rounded" />
              <input type="text" placeholder="No. of Available Rooms" className="p-2 border rounded" />
              <select className="p-2 border rounded">
                <option>WiFi Availability</option>
                <option>Yes</option>
                <option>No</option>
              </select>
              <select className="p-2 border rounded">
                <option>AC Availability</option>
                <option>Yes</option>
                <option>No</option>
              </select>
              <select className="p-2 border rounded">
                <option>Food Availability</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>

            {/* Room Image Upload Section */}
            <div className="w-full border-dashed border-2 border-gray-300 flex items-center justify-center py-6 rounded relative mb-4">
              {room.image ? (
                <div className="relative">
                  <img
                    src={room.image}
                    alt={`Room ${index + 1}`}
                    className="w-64 h-64 object-cover rounded"
                  />
                  <label className="absolute bottom-0 right-0 bg-blue-500 text-white px-2 py-1 text-sm cursor-pointer rounded">
                    Change
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleRoomImageChange(index, e)}
                    />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <span className="text-gray-600 bg-slate-300 rounded px-3 py-1 hover:bg-slate-200">Upload Images</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleRoomImageChange(index, e)}
                  />
                </label>
              )}
            </div>

            {/* Remove Room Button */}
            {rooms.length > 1 && (
              <button
                onClick={() => removeRoom(index)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addRoom}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600"
        >
          <FaPlus /> Add Your Room
        </button>
        <div className="w-full flex flex-row justify-center py-10">
          <button type="submit" className="bg-buttons text-white px-6 rounded-lg py-2">Submit</button>
        </div>
      </form>
    </div>
  );
}
