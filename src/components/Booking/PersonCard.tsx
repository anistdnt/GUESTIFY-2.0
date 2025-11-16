"use client";

import { Field, useFormikContext } from "formik";
import { FormField } from "./FormField";
import Select from "react-select";
import ImagePicker from "../Forms/imagePicker";
import { use, useEffect } from "react";

interface PersonCardProps {
  index: number;
  person: any;
  onRemove: () => void;
  canRemove: boolean;
  isPrimary: boolean;
}

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const identityOptions = [
  { value: "aadhar", label: "Aadhar Card" },
  { value: "pan", label: "PAN Card" },
  { value: "passport", label: "Passport" },
  { value: "driving_license", label: "Driving License" },
];

export function PersonCard({
  index,
  person,
  onRemove,
  canRemove,
  isPrimary,
}: PersonCardProps) {
  const { setFieldValue, values, touched, errors } = useFormikContext<any>();

  // useEffect(() => {
  //   console.log('err : ', errors);
  //   console.log('values : ', values);
  // },[errors])

  return (
    <div className="border-2 border-slate-200 rounded-xl overflow-hidden">
      <div className="bg-slate-50 border-b p-3">
        <div className="flex items-center justify-between">
          <div className="text-lg flex items-center gap-2">
            Guest {index + 1}
            {isPrimary && (
              <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                Primary
              </span>
            )}
          </div>
          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <FormField
            label="First Name"
            name={`persons.${index}.first_name`}
            required
            error={
              touched.persons &&
              touched.persons[index]?.first_name &&
              errors.persons &&
              errors.persons[index]?.first_name
            }
          >
            <Field
              name={`persons.${index}.first_name`}
              placeholder="Enter first name"
              className="border rounded-md p-2 w-full"
            />
          </FormField>

          {/* Last Name */}
          <FormField
            label="Last Name"
            name={`persons.${index}.last_name`}
            required
            error={
              touched.persons &&
              touched.persons[index]?.last_name &&
              errors.persons &&
              errors.persons[index]?.last_name
            }
          >
            <Field
              name={`persons.${index}.last_name`}
              placeholder="Enter last name"
              className="border rounded-md p-2 w-full"
            />
          </FormField>

          {/* Age */}
          <FormField
            label="Age"
            name={`persons.${index}.age`}
            required
            error={
              touched.persons &&
              touched.persons[index]?.age &&
              errors.persons &&
              errors.persons[index]?.age
            }
          >
            <Field
              type="number"
              name={`persons.${index}.age`}
              placeholder="Enter age"
              min="1"
              max="150"
              className="border rounded-md p-2 w-full"
            />
          </FormField>

          {/* Gender */}
          <FormField
            label="Gender"
            name={`persons.${index}.gender`}
            required
            error={
              touched.persons &&
              touched.persons[index]?.gender &&
              errors.persons &&
              errors.persons[index]?.gender
            }
          >
            <Field name={`persons.${index}.gender`}>
              {({ form }: any) => (
                <Select
                  options={genderOptions}
                  placeholder="Select gender"
                  value={genderOptions.find(
                    (option) =>
                      option.value === form.values.persons[index].gender
                  )}
                  onChange={(selectedOption) =>
                    form.setFieldValue(
                      `persons.${index}.gender`,
                      selectedOption?.value
                    )
                  }
                />
              )}
            </Field>
          </FormField>

          <FormField
            label="Contact Number"
            name={`persons.${index}.contact_number`}
            required
            error={
              touched.persons &&
              touched.persons[index]?.contact_number &&
              errors.persons &&
              errors.persons[index]?.contact_number
            }
          >
            <div className="flex">
              {/* Country Code */}
              <Field
                as="select"
                name={`persons.${index}.dial_code`}
                className="border border-r-0 rounded-l-md px-3 py-2 bg-white min-w-[90px] focus:ring-0 focus:outline-none"
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+61">🇦🇺 +61</option>
                <option value="+971">🇦🇪 +971</option>
              </Field>

              {/* Phone Number */}
              <Field
                type="tel"
                name={`persons.${index}.contact_number`}
                placeholder="9876543210"
                className="border rounded-r-md px-3 py-2 w-full focus:ring-0 focus:outline-none"
              />
            </div>
          </FormField>

          {/* Address */}
          <div className="md:col-span-2">
            <FormField
              label="Address"
              name={`persons.${index}.address`}
              required
              error={
                touched.persons &&
                touched.persons[index]?.address &&
                errors.persons &&
                errors.persons[index]?.address
              }
            >
              <Field
                as="textarea"
                name={`persons.${index}.address`}
                placeholder="Enter full address"
                rows={3}
                className="border rounded-md p-2 w-full resize-none"
              />
            </FormField>
          </div>

          {/* Type of Identity */}
          <FormField
            label="Type of Identity"
            name={`persons.${index}.type_of_identity`}
            required
            error={
              touched.persons &&
              touched.persons[index]?.type_of_identity &&
              errors.persons &&
              errors.persons[index]?.type_of_identity
            }
          >
            <Field name={`persons.${index}.type_of_identity`}>
              {({ form }: any) => (
                <Select
                  options={identityOptions}
                  placeholder="Select identity type"
                  value={identityOptions.find(
                    (option) =>
                      option.value ===
                      form.values.persons[index].type_of_identity
                  )}
                  onChange={(selectedOption) =>
                    form.setFieldValue(
                      `persons.${index}.type_of_identity`,
                      selectedOption?.value
                    )
                  }
                />
              )}
            </Field>
          </FormField>

          {/* Identity ID */}
          <FormField
            label="Identity ID"
            name={`persons.${index}.identity_id`}
            required
            error={
              touched.persons &&
              touched.persons[index]?.identity_id &&
              errors.persons &&
              errors.persons[index]?.identity_id
            }
          >
            <Field
              name={`persons.${index}.identity_id`}
              placeholder="Enter identity ID"
              className="border rounded-md p-2 w-full"
            />
          </FormField>

          {/* Guest Photo */}
          <FormField
            label="Guest Photo"
            name={`persons.${index}.image`}
            required
            error={
              touched.persons &&
              touched.persons[index]?.image &&
              errors.persons &&
              errors.persons[index]?.image
            }
          >
            <div className="flex items-start gap-4">
              <ImagePicker
                values={person}
                imageKey="image"
                single={true}
                {...{ setFieldValue, index }}
              />

              <div className="text-sm text-gray-600 max-w-xs">
                • Upload a clear front-facing photo.
                <br />• Recommended size: <strong>400 X 400</strong> px.
                <br />• Accepted formats: JPG, PNG.
              </div>
            </div>
          </FormField>

          {/* Identity Document Photo */}
          <FormField
            label="Photo of Identity"
            name={`persons.${index}.image`}
            required
            error={
              touched.persons &&
              touched.persons[index]?.identity_image &&
              errors.persons &&
              errors.persons[index]?.identity_image
            }
          >
            <div className="flex items-start gap-4">
              <ImagePicker
                values={person}
                imageKey="identity_image"
                single={true}
                {...{ setFieldValue, index }}
              />

              <div className="text-sm text-gray-600 max-w-xs">
                • Upload a clear picture of your ID proof.
                <br />
                • Make sure text is readable.
                <br />• Avoid glare or blur.
              </div>
            </div>
          </FormField>
        </div>
      </div>
    </div>
  );
}
