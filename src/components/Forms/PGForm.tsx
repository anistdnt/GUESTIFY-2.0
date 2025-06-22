"use client";
import { Field, ErrorMessage, useFormikContext } from "formik";
import Image from "next/image";
import { useEffect, useState } from "react";
import Select from "react-select";

export default function PGForm() {
  const [pgImage, setPgImage] = useState<string | null>(null);
  const { setFieldValue, values } = useFormikContext<any>();

  const handlePGImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPgImage(imageUrl);
      setFieldValue("pg_image", file);
    }
  };

  const yesNoOptions = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  const countryOptions = [
    { label: "India", value: "India" },
    { label: "USA", value: "USA" },
  ];

  const depositOptions = [
    { label: "Monthly", value: "monthly" },
    { label: "Quarterly", value: "quarterly" },
    { label: "Half-Yearly", value: "half-yearly" },
    { label: "Yearly", value: "yearly" },
  ];

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-3xl font-bold text-gray-800">
            PG Registration Form
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
          />
          <ErrorMessage
            name="pg_name"
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
            State <span className="text-red-600 font-semibold">*</span>
          </label>
          <Field
            name="state"
            placeholder="eg : West Benagl"
            className="p-2 border rounded w-full"
          />
          <ErrorMessage
            name="state"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Rent (in ₹) <span className="text-red-600 font-semibold">*</span>
          </label>
          <Field
            name="rent"
            placeholder="eg : 7000"
            className="p-2 border rounded w-full"
          />
          <ErrorMessage
            name="rent"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Deposit Duration <span className="text-red-600 font-semibold">*</span>
          </label>
          <Select
            options={depositOptions}
            value={depositOptions.find(
              (opt) => opt.value === values.deposit_duration
            )}
            onChange={(option) =>
              setFieldValue("deposit_duration", option?.value)
            }
            placeholder="Select Duration"
          />
          <ErrorMessage
            name="deposit_duration"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Country <span className="text-red-600 font-semibold">*</span>
          </label>
          <Select
            options={countryOptions}
            value={countryOptions.find((opt) => opt.value === values.country)}
            onChange={(option) => setFieldValue("country", option?.value)}
            placeholder="Select Country"
          />
          <ErrorMessage
            name="country"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            WiFi Availability <span className="text-red-600 font-semibold">*</span>
          </label>
          <Select
            options={yesNoOptions}
            value={yesNoOptions.find((opt) => opt.value === values.wifi)}
            onChange={(option) => setFieldValue("wifi", option?.value)}
            placeholder="Whether Wifi Available"
          />
          <ErrorMessage
            name="wifi"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            AC Availability <span className="text-red-600 font-semibold">*</span>
          </label>
          <Select
            options={yesNoOptions}
            value={yesNoOptions.find((opt) => opt.value === values.ac)}
            onChange={(option) => setFieldValue("ac", option?.value)}
            placeholder="Whether AC Available"
          />
          <ErrorMessage
            name="ac"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Food Availability <span className="text-red-600 font-semibold">*</span>
          </label>
          <Select
            options={yesNoOptions}
            value={yesNoOptions.find((opt) => opt.value === values.food)}
            onChange={(option) => setFieldValue("food", option?.value)}
            placeholder="Whether Food Available"
          />
          <ErrorMessage
            name="food"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Mention any Instruction or Rules for PG{" "}
            <span className="text-red-600 font-semibold">*</span>
          </label>
          <Field
            as="textarea"
            name="rules"
            rows={8}
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
          <label className="block mb-1 font-medium">PG Image</label>
          <div className="w-full h-48 max-h-52 border-dashed border-2 border-gray-300 flex flex-col gap-1 items-center justify-center rounded box-content">
            {pgImage ? (
              <div className="relative max-h-44">
                <Image src={pgImage} alt="PG" width={250} height={250} />
                <label className="absolute bottom-0 right-0 bg-yellow-600 text-white px-2 py-1 text-sm cursor-pointer rounded">
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
                <span className="text-gray-600 bg-slate-300 rounded px-3 py-1 hover:bg-slate-200">
                  Upload Image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePGImageChange}
                />
              </label>
            )}
          </div>
          <p className="text-sm text-yellow-600">
            Note : Image must be in ( jpg / jpeg / png ) format
          </p>
        </div>
      </div>
    </>
  );
}
