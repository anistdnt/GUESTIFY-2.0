"use client";

import { setModalVisibility } from "@/redux/slices/modalSlice";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { FieldArray, Field, ErrorMessage, useFormikContext } from "formik";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";

type RoomFormValues = {
  _id?: string;
  room_type: string;
  room_rent: string;
  attached_bathroom: string;
  ac_available: string;
  deposit_duration: string;
  room_image_url: any;
};

const depositOptions = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Half-Yearly", value: "half-yearly" },
  { label: "Yearly", value: "yearly" },
];

export default function RoomForm({
  hasAddBtn = true,
  caption
}: {
  hasAddBtn?: boolean;
  caption?: string;
}) {
  const { values, setFieldValue } = useFormikContext<{
    rooms: RoomFormValues[];
  }>();

  const [roomImage, setRoomImage] = useState<string[]>([]);

  const dispatch = useDispatch();

  const handleImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFieldValue(`rooms[${index}].room_image_url`, file);
      setRoomImage((prev) => {
        const copy = [...prev];
        copy[index] = imageUrl;
        return copy;
      });
    }
  };

  const yesNoOptions = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];
  const roomTypeOptions = [
    { label: "Single", value: "single" },
    { label: "Double", value: "double" },
  ];

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-3xl font-bold text-gray-800">
            {caption ?? 'Room Enlistment Form'}
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
                  {/* Room Type */}
                  <div>
                    <label className="block mb-1 font-medium">
                      Type of Room{" "}
                      <span className="text-red-600 font-semibold">*</span>
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
                    <ErrorMessage
                      name={`rooms[${index}].room_type`}
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Rent */}
                  <div>
                    <label className="block mb-1 font-medium">
                      Rent <span className="text-red-600 font-semibold">*</span>
                    </label>
                    <Field
                      name={`rooms[${index}].room_rent`}
                      placeholder="Rent"
                      className="p-2 border rounded w-full"
                    />
                    <ErrorMessage
                      name={`rooms[${index}].room_rent`}
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Deposit */}
                  <div>
                    <label className="block mb-1 font-medium">
                      Deposit Duration{" "}
                      <span className="text-red-600 font-semibold">*</span>
                    </label>
                    <Select
                      options={depositOptions}
                      value={depositOptions.find(
                        (opt) => opt.value === room.deposit_duration
                      )}
                      onChange={(option) =>
                        setFieldValue(
                          `rooms[${index}].deposit_duration`,
                          option?.value
                        )
                      }
                      placeholder="Select Deposit Duration"
                    />
                    <ErrorMessage
                      name={`rooms[${index}].deposit_duration`}
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* AC */}
                  <div>
                    <label className="block mb-1 font-medium">
                      AC Availability{" "}
                      <span className="text-red-600 font-semibold">*</span>
                    </label>
                    <Select
                      options={yesNoOptions}
                      value={yesNoOptions.find(
                        (opt) => opt.value === room.ac_available
                      )}
                      onChange={(option) =>
                        setFieldValue(
                          `rooms[${index}].ac_available`,
                          option?.value
                        )
                      }
                      placeholder="Whether AC Available"
                    />
                    <ErrorMessage
                      name={`rooms[${index}].ac_available`}
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Bathroom */}
                  <div>
                    <label className="block mb-1 font-medium">
                      Attached Bathroom{" "}
                      <span className="text-red-600 font-semibold">*</span>
                    </label>
                    <Select
                      options={yesNoOptions}
                      value={yesNoOptions.find(
                        (opt) => opt.value === room.attached_bathroom
                      )}
                      onChange={(option) =>
                        setFieldValue(
                          `rooms[${index}].attached_bathroom`,
                          option?.value
                        )
                      }
                      placeholder="Whether Attached Bathroom available"
                    />
                    <ErrorMessage
                      name={`rooms[${index}].attached_bathroom`}
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="w-full border-dashed border-2 border-gray-300 flex items-center justify-center py-6 rounded relative mb-4">
                  {room.room_image_url ? (
                    <div className="relative">
                      <Image
                        src={roomImage[index]}
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
                <ErrorMessage
                  name={`rooms[${index}].room_image_url`}
                  component="div"
                  className="text-red-500 text-sm mb-2"
                />

                {/* Remove Room Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (hasAddBtn) {
                      remove(index);
                    } else {
                      dispatch(
                        setModalVisibility({
                          open: true,
                          type: "deletePG",
                          modalData: {
                            target: "room",
                            caption: "Delete Room",
                            btnText: "Delete Room",
                            deletedCred: ["This Room"],
                            placeholder:"The Room",
                            rowid: room?._id as string,
                          },
                        })
                      );
                    }
                  }}
                  disabled={hasAddBtn && values?.rooms?.length < 2}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                >
                  <Trash size={20} weight="bold" />
                </button>
              </div>
            ))}

            {/* Add Room Button */}
            {hasAddBtn && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    push({
                      room_type: "",
                      room_rent: "",
                      attached_bathroom: "",
                      ac_available: "",
                      deposit_duration: "",
                      room_image_url: null,
                    })
                  }
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                >
                  + Add Room
                </button>
              </div>
            )}
          </>
        )}
      </FieldArray>
    </>
  );
}
