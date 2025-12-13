"use client";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import Select from "react-select";
import {
  yesNoOptions,
  PGType,
  districtOptions,
  stateOptions,
  depositOptions,
} from "@/data/countryPhone";
import Tooltip from "./Tooltip";
import ImagePicker from "./imagePicker";
import dynamic from "next/dynamic";

// Dynamically import both CKEditor and ClassicEditor together
const CKEditorWrapper = dynamic(
  () =>
    Promise.all([
      import("@ckeditor/ckeditor5-react"),
      import("@ckeditor/ckeditor5-build-classic"),
    ]).then(([{ CKEditor }, ClassicEditor]) => {
      return {
        default: function CKEditorComponent(props: any) {
          return <CKEditor editor={ClassicEditor.default} {...props} />;
        },
      };
    }),
  { ssr: false }
);

export default function PGForm({
  caption,
  disabledField,
}: {
  caption?: string;
  disabledField?: string[];
}) {
  const { setFieldValue, values } = useFormikContext<any>();

  useEffect(()=>{
    if(values?.wifi_available === "no"){
      setFieldValue("wifi_speed",0);
      setFieldValue("additional_wifi_charges",0);
      setFieldValue("charge_duration","quarterly");
    }
  },[values?.wifi_available])

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
          <label className="mb-1 font-medium flex items-center gap-1">
            <span>Name of the Paying Guest House</span>
            <span className="text-red-600 font-semibold">*</span>
            <Tooltip text="The end user will see this name on map" />
          </label>
          <Field
            name="pg_name"
            placeholder="eg : Shyam Residence"
            className="p-2 border rounded w-full"
            disabled={disabledField?.includes("pg_name")}
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
            value={districtOptions?.find(opt => opt.value === values?.district)}
            onChange={option => setFieldValue("district", option?.value)}
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
            value={stateOptions?.find(opt => opt.value === values?.state)}
            onChange={option => setFieldValue("state", option?.value)}
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
            placeholder="eg : 700001"
            className="p-2 border rounded w-full"
          />
          <ErrorMessage
            name="pincode"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        <div>
          <label className="flex items-center gap-1 mb-1 font-medium">
            <span>Type of PG</span>
            <span className="text-red-600 font-semibold">*</span>
            <Tooltip text="Who can accommodate this PG" />
          </label>
          <Select
            options={PGType}
            value={PGType.find(opt => opt.value === values.pg_type)}
            onChange={option => setFieldValue("pg_type", option?.value)}
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
            WiFi Availability <span className="text-red-600 font-semibold">*</span>
          </label>
          <Select
            options={yesNoOptions}
            value={yesNoOptions.find(opt => opt.value === values.wifi_available)}
            onChange={option => setFieldValue("wifi_available", option?.value)}
            placeholder="Whether Wifi Available"
          />
          <ErrorMessage
            name="wifi_available"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        {values.wifi_available === "yes" && (
          <div>
            <label className="block mb-1 font-medium">
              Wifi-Network Speed <span className="text-gray-600">(In Mbps)</span> <span className="text-red-600 font-semibold">*</span>
            </label>
            <Field
              name="wifi_speed"
              placeholder="eg : 30 Mbps"
              className="p-2 border rounded w-full"
            />
            <ErrorMessage
              name="wifi_speed"
              component="span"
              className="text-red-500 text-sm"
            />
          </div>
        )}

        {values.wifi_available === "yes" && (
          <div>
            <label className="block mb-1 font-medium">
              Additional Wifi-Charge <span className="text-red-600 font-semibold">*</span>
            </label>
            <div className="flex items-center gap-2 w-full">
              <Field
                name="additional_wifi_charges"
                placeholder="eg : 300"
                className="p-2 border rounded w-9/12"
              />
              <Select
                options={depositOptions}
                className="w-3/12"
                value={depositOptions.find(opt => opt.value === values.charge_duration)}
                onChange={option => setFieldValue("charge_duration", option?.value)}
                placeholder="Duration"
              />
            </div>
            <ErrorMessage
              name="additional_wifi_charges"
              component="span"
              className="text-red-500 text-sm"
            />
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">
            Food Availability <span className="text-red-600 font-semibold">*</span>
          </label>
          <Select
            options={yesNoOptions}
            value={yesNoOptions.find(opt => opt.value === values.food_available)}
            onChange={option => setFieldValue("food_available", option?.value)}
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
            Mention any Instruction or Rules for PG <span className="text-red-600 font-semibold">*</span>
          </label>
          <CKEditorWrapper
            data={values.rules || ""}
            onChange={(event: any, editor: any) => {
              setFieldValue("rules", editor.getData());
            }}
            config={{
              placeholder: "e.g. Not allowed within PG after 10 P.M",
            }}
            onReady={(editor: any) => {
              editor.editing.view.change((writer: any) => {
                const editableElement = editor.editing.view.document.getRoot();
                writer.setStyle("min-height", "140px", editableElement);
                writer.setStyle("max-height", "140px", editableElement);
                writer.setStyle("overflow-y", "auto", editableElement);
              });
            }}
          />
          <ErrorMessage
            name="rules"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            PG Image <span className="text-red-600 font-semibold ms-1">*</span>
          </label>
          <ImagePicker imageKey="pg_image_url" {...{ setFieldValue, values }} />
        </div>
      </div>
    </>
  );
}
