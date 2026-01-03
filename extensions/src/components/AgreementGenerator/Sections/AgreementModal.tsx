"use client";

import React, { useRef } from "react";
import { Formik, Form, Field } from "formik";
import { XIcon } from "@phosphor-icons/react";
import { AgreementSchema, sampleAgreementPayload } from "@/utils/Generator/form.validation";
import { numberToWords } from "@/utils/Generator";
import { Input, Textarea, Section } from "../FormComponents";

type AgreementFormValues = typeof AgreementSchema.initialValues;

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: AgreementFormValues) => void;
};

export default function AgreementModal({ open, onClose, onSubmit }: Props) {
  if (!open) return null;

  const formikRef = useRef<any>(null);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
      <div className="bg-white w-full max-w-5xl rounded-md shadow-xl flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div className="flex justify-start items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Create PG Rental Agreement
            </h2>
            <div>
              <button
                type="button"
                className="border border-gray-800 text-gray-800 hover:text-gray-900 hover:border-gray-900 rounded-md py-1 px-2 text-xs"
                onClick={() => {
                  formikRef.current?.setValues({
                    ...AgreementSchema.initialValues,
                    ...sampleAgreementPayload,
                  });
                }}
              >
                Load Sample Data
              </button>
            </div>
          </div>
          <button onClick={onClose}>
            <XIcon size={22} className="text-gray-700 hover:text-black" />
          </button>
        </div>

        <Formik
          initialValues={AgreementSchema.initialValues}
          validationSchema={AgreementSchema.validationSchema}
          enableReinitialize
          onSubmit={(values: AgreementFormValues) => {
            onSubmit(values);
            onClose();
          }}
          validateOnChange={true}
          validateOnBlur={true}
          innerRef={formikRef}
        >
          {({
            setFieldValue,
            dirty,
            handleSubmit,
            validateForm,
            setTouched,
            values,
          }) => (
            <>
              {/* FORM BODY */}
              <Form className="flex-1 overflow-y-auto px-6 py-5 space-y-10">
                {/* GROUP 1 */}
                <Section title="PG & Party Details">
                  <Input
                    name="owner_name"
                    label="Owner Name"
                    placeholder="Mr. Rajesh Kumar"
                  />
                  <Input
                    name="owner_guardian_name"
                    label="Owner Guardian Name"
                    placeholder="Mr. Suresh Kumar"
                  />
                  <Textarea
                    name="owner_address"
                    label="Owner Address"
                    placeholder="Full residential address"
                  />

                  <Input
                    name="tenant_name"
                    label="Tenant Name"
                    placeholder="Amit Sharma"
                  />
                  <Input
                    name="tenant_guardian_name"
                    label="Tenant Guardian Name"
                    placeholder="Mr. Ramesh Sharma"
                  />
                  <Textarea
                    name="tenant_address"
                    label="Tenant Address"
                    placeholder="Permanent residential address"
                  />

                  <Input
                    name="pg_name"
                    label="PG Name"
                    placeholder="Sunrise Boys PG"
                  />
                  <Textarea
                    name="pg_full_address"
                    label="PG Address"
                    placeholder="Complete PG address"
                  />

                  <Input
                    name="agreement_city"
                    label="Agreement City"
                    placeholder="Kolkata"
                  />
                  <Input
                    name="agreement_state"
                    label="Agreement State"
                    placeholder="West Bengal"
                  />
                  <Input
                    type="date"
                    name="agreement_date"
                    label="Agreement Date"
                  />
                </Section>

                {/* GROUP 2 */}
                <Section title="Room Details">
                  <Textarea
                    name="room_details"
                    label="Room Details"
                    placeholder="Room number, floor, furnishing details"
                  />
                  <Textarea
                    name="common_areas"
                    label="Common Areas"
                    placeholder="Hall, kitchen, balcony, terrace"
                  />
                </Section>

                {/* GROUP 3 */}
                <Section title="Habitat & Stay Details">
                  <Input type="date" name="start_date" label="Start Date" />
                  <Input type="date" name="end_date" label="End Date" />
                  <Input
                    name="duration"
                    label="Duration"
                    placeholder="11 months"
                  />
                  <Input
                    name="lock_in_period"
                    label="Lock-in Period"
                    placeholder="3 months"
                  />
                  <Input
                    name="notice_period"
                    label="Notice Period"
                    placeholder="30 days"
                  />
                  <Input
                    name="visitor_hours"
                    label="Visitor Hours"
                    placeholder="10 AM – 8 PM"
                  />
                </Section>

                {/* GROUP 4 */}
                <Section title="Financial & Utilities">
                  <Input
                    name="rent"
                    label="Monthly Rent"
                    placeholder="8000"
                    onChange={(e: any) => {
                      const value = e.target.value;
                      setFieldValue("rent", value);
                      if (value) {
                        setFieldValue(
                          "rent_words",
                          numberToWords(Number(value))
                        );
                      }
                    }}
                  />

                  <Input
                    name="rent_words"
                    label="Rent (in words)"
                    placeholder="Eight Thousand Only"
                    readOnly
                  />

                  <Input
                    name="rent_due_day"
                    label="Rent Due Day"
                    placeholder="5"
                  />

                  <Input
                    name="deposit"
                    label="Security Deposit"
                    onChange={(e: any) => {
                      const value = e.target.value;
                      setFieldValue("deposit", value);
                      if (value) {
                        setFieldValue(
                          "deposit_words",
                          numberToWords(Number(value))
                        );
                      }
                    }}
                    placeholder="16000"
                  />
                  <Input
                    name="deposit_words"
                    label="Deposit (in words)"
                    placeholder="Sixteen Thousand Only"
                    readOnly
                  />
                  <Input
                    name="deposit_refund_days"
                    label="Deposit Refund Period (days)"
                    placeholder="30"
                  />

                  <Input
                    name="late_fee"
                    label="Late Fee"
                    placeholder="100 per day"
                  />

                  <Textarea
                    name="utilities_included"
                    label="Utilities Included"
                    placeholder="Electricity, water, Wi-Fi"
                  />
                  <Textarea
                    name="utilities_excluded"
                    label="Utilities Excluded"
                    placeholder="Laundry, food"
                  />
                </Section>
              </Form>

              {/* FOOTER */}
              <div className="px-6 py-4 border-t flex justify-end gap-3 bg-white rounded-b-md">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-400 rounded-md text-gray-800"
                >
                  Cancel
                </button>
                <button
                  // make fields auto touch so far as the erros are visible before submit
                  onClick={async () => {
                    setTouched(
                      Object.keys(values).reduce((acc: any, key) => {
                        acc[key] = true;
                        return acc;
                      }, {})
                    );
                    const errors = await validateForm();
                    if (Object.keys(errors).length === 0) {
                      handleSubmit();
                    }
                  }}
                  className="px-5 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-md"
                >
                  Submit Agreement
                </button>
              </div>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
}
