"use client";

import { setModalVisibility } from "@/redux/slices/modalSlice";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { FieldArray, Field, ErrorMessage, useFormikContext } from "formik";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
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

type RoomImageUploaderProps = {
  index: number;
  values: any;
  setFieldValue: (field: string, value: any) => void;
};

const depositOptions = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Half-Yearly", value: "halfyearly" },
  { label: "Yearly", value: "yearly" },
];

// ===== Room Image Uploader component =======

const RoomImageUploader = ({
  index,
  values,
  setFieldValue,
}: RoomImageUploaderProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        setFieldValue(
          `rooms[${index}].room_image_url`,
          reader.result as string
        );
      };
      reader.readAsDataURL(file);
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`relative cursor-pointer group border-2 border-dashed rounded-md p-1 w-full h-[250px] flex justify-center
      ${
        values?.rooms[index].room_image_url
          ? "border-transparent"
          : "border-gray-400 hover:border-gray-600"
      }`}
    >
      <input {...getInputProps()} />

      {values?.rooms[index].room_image_url ? (
        <div className="relative inline-block">
          <img
            src={values?.rooms[index].room_image_url}
            alt="Uploaded preview"
            className="max-w-[300px] max-h-[200px] object-contain rounded-md"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              type="button"
              className="bg-black bg-opacity-50 text-white font-semibold px-4 py-2 rounded shadow"
            >
              Change Image
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <p className="text-center text-sm text-gray-500">
            Drag & drop or click to upload
          </p>
        </div>
      )}
    </div>
  );
};

// ======== Room Form Component =========

export default function RoomForm({
  hasAddBtn = true,
  caption,
}: {
  hasAddBtn?: boolean;
  caption?: string;
}) {
  const { values, setFieldValue } = useFormikContext<{
    rooms: RoomFormValues[];
  }>();

  const dispatch = useDispatch();

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
            {caption ?? "Room Enlistment Form"}
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
                <RoomImageUploader
                  key={index}
                  index={index}
                  values={values}
                  setFieldValue={setFieldValue}
                />
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
                      if(values?.rooms?.length < 2){
                        toast.error("Unable to Delete : You have to enlist at least 1 room")
                      }
                      else{
                        dispatch(
                        setModalVisibility({
                          open: true,
                          type: "deletePG",
                          modalData: {
                            target: "room",
                            caption: "Delete Room",
                            btnText: "Delete Room",
                            deletedCred: ["This Room"],
                            placeholder: "The Room",
                            rowid: room?._id as string,
                          },
                        })
                      );
                      }
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
