"use client";

import { Trash } from "@phosphor-icons/react/dist/ssr";
import { FieldArray, Field, ErrorMessage, useFormikContext } from "formik";
import Image from "next/image";
import Select from "react-select";

type RoomFormValues = {
  room_type: string;
  room_rent: string;
  room_count: string;
  wifi: string;
  ac: string;
  food: string;
  image: File | null;
  preview?: string;
};

export default function RoomForm() {
  const { values, setFieldValue } = useFormikContext<{
    rooms: RoomFormValues[];
  }>();

  const handleImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFieldValue(`rooms[${index}].image`, file);
      setFieldValue(`rooms[${index}].preview`, imageUrl);
    }
  };

  const yesNoOptions = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];
  const roomTypeOptions = [
    { label: "Single", value: "Single" },
    { label: "Double", value: "Double" },
  ];

  return (
    <>
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-3xl font-bold text-gray-800">
            Room Enlistment Form
          </h2>
        </div>
        <p className="text-gray-600">
          Please fill out the details carefully. Fields marked with{" "}
          <span className="text-red-600 font-semibold">*</span> are mandatory.
        </p>
      </div>
      <FieldArray name="rooms">
        {({ remove, push }) => (
          <>
            {values.rooms.map((room, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md mb-8 relative"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Room Type - React Select */}
                  <div>
                    <label className="block mb-1 font-medium">
                      Type of Room <span className="text-red-600 font-semibold">*</span>
                    </label>
                    <Select
                      options={roomTypeOptions}
                      value={roomTypeOptions.find(
                        (opt) => opt.value === room.room_type
                      )}
                      onChange={(option) =>
                        setFieldValue(
                          `rooms[${index}].room_type`,
                          option?.value
                        )
                      }
                      placeholder="Select Room Type"
                    />
                  </div>

                  {/* Rent */}
                  <div>
                    <label className="block mb-1 font-medium">Rent <span className="text-red-600 font-semibold">*</span></label>
                    <Field
                      name={`rooms[${index}].room_rent`}
                      placeholder="Rent"
                      className="p-2 border rounded w-full"
                    />
                  </div>

                  {/* Count */}
                  <div>
                    <label className="block mb-1 font-medium">
                      No. of Available Rooms <span className="text-red-600 font-semibold">*</span>
                    </label>
                    <Field
                      name={`rooms[${index}].room_count`}
                      placeholder="Available Count"
                      className="p-2 border rounded w-full"
                    />
                  </div>

                  {/* Wifi - React Select */}
                  <div>
                    <label className="block mb-1 font-medium">
                      WiFi Availability <span className="text-red-600 font-semibold">*</span>
                    </label>
                    <Select
                      options={yesNoOptions}
                      value={yesNoOptions.find(
                        (opt) => opt.value === room.wifi
                      )}
                      onChange={(option) =>
                        setFieldValue(`rooms[${index}].wifi`, option?.value)
                      }
                      placeholder="Select"
                    />
                  </div>

                  {/* AC - React Select */}
                  <div>
                    <label className="block mb-1 font-medium">
                      AC Availability <span className="text-red-600 font-semibold">*</span>
                    </label>
                    <Select
                      options={yesNoOptions}
                      value={yesNoOptions.find((opt) => opt.value === room.ac)}
                      onChange={(option) =>
                        setFieldValue(`rooms[${index}].ac`, option?.value)
                      }
                      placeholder="Select"
                    />
                  </div>

                  {/* Food - React Select */}
                  <div>
                    <label className="block mb-1 font-medium">
                      Food Availability <span className="text-red-600 font-semibold">*</span>
                    </label>
                    <Select
                      options={yesNoOptions}
                      value={yesNoOptions.find(
                        (opt) => opt.value === room.food
                      )}
                      onChange={(option) =>
                        setFieldValue(`rooms[${index}].food`, option?.value)
                      }
                      placeholder="Select"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="w-full border-dashed border-2 border-gray-300 flex items-center justify-center py-6 rounded relative mb-4">
                  {room.preview ? (
                    <div className="relative">
                      <Image
                        src={room.preview}
                        alt={`Room ${index + 1}`}
                        width={250}
                        height={250}
                        className="rounded"
                      />
                      <label className="absolute bottom-0 right-0 bg-blue-500 text-white px-2 py-1 text-sm cursor-pointer rounded">
                        Change
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageChange(index, e)}
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <span className="text-gray-600 bg-slate-300 rounded px-3 py-1 hover:bg-slate-200">
                        Upload Image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(index, e)}
                      />
                    </label>
                  )}
                </div>

                {/* Remove Room Button */}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={values?.rooms?.length < 2}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                >
                  <Trash size={20} weight="bold" />
                </button>
              </div>
            ))}

            {/* Add Room Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() =>
                  push({
                    room_type: "",
                    room_rent: "",
                    room_count: "",
                    wifi: "",
                    ac: "",
                    food: "",
                    image: null,
                    preview: "",
                  })
                }
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
              >
                + Add Room
              </button>
            </div>
          </>
        )}
      </FieldArray>
    </>
  );
}
