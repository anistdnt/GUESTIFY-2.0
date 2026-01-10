"use client";

import { Field, ErrorMessage, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import Select from "react-select";
import Tooltip from "./Tooltip";
import ImagePicker from "./imagePicker";
import { stateOptions } from "@/data/countryPhone";

export const attractionTypeOptions = [
  { label: "Medical", value: "medical" },
  { label: "Museum", value: "museum" },
  { label: "Park", value: "park" },
  { label: "Market", value: "market" },
  { label: "Grocery", value: "grocery" },
  { label: "Cafe", value: "cafe" },
];

export default function EnlistAttractionForm({
  caption,
}: {
  caption?: string;
}) {
  const { setFieldValue, values } = useFormikContext<any>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* IMAGE UPLOAD – PROMINENT */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <label className="block mb-2 font-semibold text-lg">
          Place Image <span className="text-red-600">*</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <ImagePicker
            imageKey="image_url"
            single={true}
            {...{ setFieldValue, values }}
          />

          {/* Upload Instructions */}
          <div className="text-sm text-gray-600 leading-relaxed">
            <p className="font-medium text-gray-800 mb-1">
              Image upload guidelines:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Upload a clear image of the place</li>
              <li>Avoid blurry or dark photos</li>
              <li>Image should represent the actual location</li>
              <li>Only one image is allowed</li>
            </ul>
          </div>
        </div>

        <ErrorMessage
          name="image_url"
          component="span"
          className="text-red-500 text-sm mt-1 block"
        />
      </div>

      {/* MAIN FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Place Name – MOST IMPORTANT */}
        <div>
          <label className="mb-1 font-medium flex items-center gap-1">
            Place Name <span className="text-red-600">*</span>
            <Tooltip text="This name will be visible to users" />
          </label>
          <Field
            name="place_name"
            placeholder="eg: Blue Print Medical Shop"
            className="p-2 border rounded w-full"
          />
          <ErrorMessage
            name="place_name"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        {/* Type */}
        <div>
          <label className="mb-1 font-medium flex items-center gap-1">
            Type <span className="text-red-600">*</span>
            <Tooltip text="This is used to specify the type of attrcation user found" />
          </label>
          <Select
            options={attractionTypeOptions}
            value={attractionTypeOptions.find(
              opt => opt.value === values.type
            )}
            onChange={option => setFieldValue("type", option?.value)}
            placeholder="Select type"
          />
          <ErrorMessage
            name="type"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="mb-1 font-medium">
            Address <span className="text-red-600">*</span>
          </label>
          <Field
            name="address"
            placeholder="Full address"
            className="p-2 border rounded w-full"
          />
          <ErrorMessage
            name="address"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="mb-1 font-medium">
            Description <span className="text-red-600">*</span>
          </label>
          <Field
            as="textarea"
            rows={3}
            name="description"
            placeholder="Short description about the place"
            className="p-2 border rounded w-full"
          />
          <ErrorMessage
            name="description"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        {/* Time Taken */}
        <div>
          <label className="mb-1 font-medium">
            Time Taken (minutes) <span className="text-red-600">*</span>
          </label>
          <Field
            type="number"
            name="time_taken_minutes"
            placeholder="eg: 2"
            className="p-2 border rounded w-full"
          />
          <ErrorMessage
            name="time_taken_minutes"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        {/* State */}
        <div>
          <label className="mb-1 font-medium">
            State <span className="text-red-600">*</span>
          </label>
          <Select options={stateOptions} value={stateOptions[0]} isDisabled />
        </div>

        {/* Country */}
        <div>
          <label className="mb-1 font-medium">
            Country <span className="text-red-600">*</span>
          </label>
          <Field
            name="country"
            className="p-2 border rounded w-full bg-gray-100"
            disabled
          />
        </div>
      </div>
    </>
  );
}
