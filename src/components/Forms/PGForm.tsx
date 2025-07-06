"use client";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Select from "react-select";

export default function PGForm({
  caption,
  disabledField,
}: {
  caption?: string;
  disabledField?: string[];
}) {
  const { setFieldValue, values } = useFormikContext<any>();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        setFieldValue("pg_image_url", reader.result as string);
      };
      reader.readAsDataURL(file);
    },
  });

  const yesNoOptions = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];

  const districtOptions = [
    // West Bengal districts
    { label: "Kolkata", value: "kolkata" },
    { label: "Howrah", value: "howrah" },
    { label: "Darjeeling", value: "darjeeling" },
    { label: "Siliguri", value: "siliguri" },
    { label: "Hooghly", value: "hooghly" },

    // Assam districts
    { label: "Guwahati", value: "guwahati" },
    { label: "Dibrugarh", value: "dibrugarh" },
    { label: "Silchar", value: "silchar" },

    // Bihar districts
    { label: "Patna", value: "patna" },
    { label: "Gaya", value: "gaya" },
    { label: "Muzaffarpur", value: "muzaffarpur" },
  ];

  const stateOptions = [
    { label: "West Bengal", value: "West Bengal" },
    { label: "Assam", value: "Assam" },
    { label: "Bihar", value: "Bihar" },
    { label: "Odisha", value: "Odisha" },
    { label: "Jharkhand", value: "Jharkhand" },
    { label: "Uttar Pradesh", value: "Uttar Pradesh" },
    { label: "Maharashtra", value: "Maharashtra" },
    { label: "Karnataka", value: "Karnataka" },
    { label: "Tamil Nadu", value: "Tamil Nadu" },
    { label: "Kerala", value: "Kerala" },
    { label: "Telangana", value: "Telangana" },
    { label: "Andhra Pradesh", value: "Andhra Pradesh" },
    { label: "Madhya Pradesh", value: "Madhya Pradesh" },
    { label: "Rajasthan", value: "Rajasthan" },
    { label: "Punjab", value: "Punjab" },
    { label: "Haryana", value: "Haryana" },
    { label: "Delhi", value: "Delhi" },
  ];

  const PGType = [
    {
      label: "Boys",
      value: "boys",
    },
    {
      label: "Girls",
      value: "girls",
    },
    {
      label: "Both",
      value: "both",
    },
  ];

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-3xl font-bold text-gray-800">
            {caption ?? "PG Registration Form"}
          </h2>
        </div>
        <p className="text-gray-600">
          Please fill out the details carefully. Fields marked with{" "}
          <span className="text-red-600 font-semibold">*</span> are mandatory.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">
            Name of the Paying Guest House{" "}
            <span className="text-red-600 font-semibold">*</span>
          </label>
          <Field
            name="pg_name"
            placeholder="eg : Shyam Residence"
            className="p-2 border rounded w-full"
            disabled={disabledField && disabledField?.includes("pg_name")}
          />
          <ErrorMessage
            name="pg_name"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            House Number <span className="text-red-600 font-semibold">*</span>
          </label>
          <Field
            name="house_no"
            placeholder="eg : 72"
            className="p-2 border rounded w-full"
          />
          <ErrorMessage
            name="house_no"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Street Name <span className="text-red-600 font-semibold">*</span>
          </label>
          <Field
            name="street_name"
            placeholder="eg : Bipin Bihari Street"
            className="p-2 border rounded w-full"
          />
          <ErrorMessage
            name="street_name"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            District <span className="text-red-600 font-semibold">*</span>
          </label>
          <Select
            options={districtOptions}
            value={districtOptions?.find(
              (opt) => opt.value === values?.district
            )}
            onChange={(option) => setFieldValue("district", option?.value)}
            placeholder="Select District"
          />
          <ErrorMessage
            name="district"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            State <span className="text-red-600 font-semibold">*</span>
          </label>
          <Select
            options={stateOptions}
            value={stateOptions?.find((opt) => opt.value === values?.state)}
            onChange={(option) => setFieldValue("state", option?.value)}
            placeholder="Select State"
          />
          <ErrorMessage
            name="state"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Pincode <span className="text-red-600 font-semibold">*</span>
          </label>
          <Field
            name="pincode"
            placeholder="eg : 7000"
            className="p-2 border rounded w-full"
          />
          <ErrorMessage
            name="pincode"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Type of PG <span className="text-red-600 font-semibold">*</span>
          </label>
          <Select
            options={PGType}
            value={PGType.find((opt) => opt.value === values.pg_type)}
            onChange={(option) => setFieldValue("pg_type", option?.value)}
            placeholder="Select Type of PG"
          />
          <ErrorMessage
            name="pg_type"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            WiFi Availability{" "}
            <span className="text-red-600 font-semibold">*</span>
          </label>
          <Select
            options={yesNoOptions}
            value={yesNoOptions.find(
              (opt) => opt.value === values.wifi_available
            )}
            onChange={(option) =>
              setFieldValue("wifi_available", option?.value)
            }
            placeholder="Whether Wifi Available"
          />
          <ErrorMessage
            name="wifi_available"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Food Availability{" "}
            <span className="text-red-600 font-semibold">*</span>
          </label>
          <Select
            options={yesNoOptions}
            value={yesNoOptions.find(
              (opt) => opt.value === values.food_available
            )}
            onChange={(option) =>
              setFieldValue("food_available", option?.value)
            }
            placeholder="Whether Food Available"
          />
          <ErrorMessage
            name="food_available"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        <br />

        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Mention any Instruction or Rules for PG{" "}
            <span className="text-red-600 font-semibold">*</span>
          </label>
          <Field
            as="textarea"
            name="rules"
            rows={10}
            placeholder="eg : Not allowed within PG after 10 P.M"
            className="p-2 border rounded w-full"
          />
          <ErrorMessage
            name="rules"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>

        <div className="">
          <label className="block mb-1 font-medium">
            PG Image
            <span className="text-red-600 font-semibold ms-1">*</span>
          </label>
          <div
            {...getRootProps()}
            className={`relative cursor-pointer group border-2 border-dashed rounded-md p-1 w-full h-[250px] flex justify-center
      ${
        values["pg_image_url"]
          ? "border-transparent"
          : "border-gray-400 hover:border-gray-600"
      }`}
          >
            <input {...getInputProps()} />

            {values["pg_image_url"] ? (
              <div className="relative inline-block">
                <img
                  src={values["pg_image_url"]}
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
          <span className="text-sm text-yellow-600">
            {"("}Note : Image must be in ( jpg / jpeg / png ) format{")"}
          </span>
          <ErrorMessage
            name="pg_image_url"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>
      </div>
    </>
  );
}
