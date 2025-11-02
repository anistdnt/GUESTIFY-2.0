'use client';

import { Field } from 'formik';
import { FormField } from './FormField';
import Select from 'react-select';

interface PersonCardProps {
  index: number;
  person: any;
  onRemove: () => void;
  canRemove: boolean;
  isPrimary: boolean;
}

export function PersonCard({
  index,
  person,
  onRemove,
  canRemove,
  isPrimary,
}: PersonCardProps) {
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  const identityOptions = [
    { value: 'aadhar', label: 'Aadhar Card' },
    { value: 'pan', label: 'PAN Card' },
    { value: 'passport', label: 'Passport' },
    { value: 'driving_license', label: 'Driving License' },
  ];

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
          <FormField label="First Name" name={`persons.${index}.first_name`} required>
            <Field
              name={`persons.${index}.first_name`}
              placeholder="Enter first name"
              className="border rounded-md p-2 w-full"
            />
          </FormField>

          {/* Last Name */}
          <FormField label="Last Name" name={`persons.${index}.last_name`} required>
            <Field
              name={`persons.${index}.last_name`}
              placeholder="Enter last name"
              className="border rounded-md p-2 w-full"
            />
          </FormField>

          {/* Age */}
          <FormField label="Age" name={`persons.${index}.age`} required>
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
          <FormField label="Gender" name={`persons.${index}.gender`} required>
            <Field name={`persons.${index}.gender`}>
              {({ form }: any) => (
                <Select
                  options={genderOptions}
                  placeholder="Select gender"
                  value={genderOptions.find(
                    (option) => option.value === form.values.persons[index].gender
                  )}
                  onChange={(selectedOption) =>
                    form.setFieldValue(`persons.${index}.gender`, selectedOption?.value)
                  }
                />
              )}
            </Field>
          </FormField>

          {/* Address */}
          <div className="md:col-span-2">
            <FormField label="Address" name={`persons.${index}.address`} required>
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
          >
            <Field name={`persons.${index}.type_of_identity`}>
              {({ form }: any) => (
                <Select
                  options={identityOptions}
                  placeholder="Select identity type"
                  value={identityOptions.find(
                    (option) =>
                      option.value === form.values.persons[index].type_of_identity
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
          <FormField label="Identity ID" name={`persons.${index}.identity_id`} required>
            <Field
              name={`persons.${index}.identity_id`}
              placeholder="Enter identity ID"
              className="border rounded-md p-2 w-full"
            />
          </FormField>

          {/* Guest Photo */}
          <div className="md:col-span-2">
          </div>

          {/* Identity Document Photo */}
          <div className="md:col-span-2">
          </div>
        </div>
      </div>
    </div>
  );
}
