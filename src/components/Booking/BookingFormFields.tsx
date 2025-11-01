'use client';

import { Field, useFormikContext } from 'formik';
import { FormField } from './FormField';

export function BookingFormFields() {
  const { values, errors, touched, setFieldValue } = useFormikContext<any>();

  const durationTouched = touched.duration as any;
  const durationErrors = errors.duration as any;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        label="Start Date"
        name="start_date"
        required
        error={touched.start_date && errors.start_date}
      >
        <Field
          type="date"
          name="start_date"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </FormField>

      <FormField
        label="Duration (Years)"
        name="duration.year"
        required
        error={durationTouched?.year && durationErrors?.year}
      >
        <Field
          type="number"
          name="duration.year"
          placeholder="0"
          min="0"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </FormField>

      <FormField
        label="Duration (Months)"
        name="duration.month"
        required
        error={durationTouched?.month && durationErrors?.month}
      >
        <Field
          type="number"
          name="duration.month"
          placeholder="0"
          min="0"
          max="11"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </FormField>

      <div className="md:col-span-2">
        <FormField
          label="Remarks"
          name="remarks"
          error={touched.remarks && errors.remarks}
        >
          <Field
            as="textarea"
            name="remarks"
            placeholder="Any special requests or notes..."
            rows={4}
            className="w-full resize-none border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </FormField>
      </div>
    </div>
  );
}
