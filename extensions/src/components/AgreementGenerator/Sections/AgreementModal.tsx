"use client";

import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field } from "formik";
import { XIcon } from "@phosphor-icons/react";
import {
  AgreementSchema,
  sampleAgreementPayload,
} from "@/utils/Generator/form.validation";
import { numberToWords } from "@/utils/Generator";
import { Input, Textarea, Section } from "../FormComponents";
import toast from "react-hot-toast";
import Select from "react-select";
import { Option } from "@/types/AgreementGenerator";

type AgreementFormValues = typeof AgreementSchema.initialValues;

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: AgreementFormValues) => void;
};

export default function AgreementModal({ open, onClose, onSubmit }: Props) {
  if (!open) return null;

  const [pgs, setPGs] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [habitates, setHabitates] = useState<any[]>([]);

  const [selectedPG, setSelectedPG] = useState<Option>({ value: "", label: "" });
  const [selectedRoom, setSelectedRoom] = useState<Option>({ value: "", label: "" });
  const [selectedHabitate, setSelectedHabitate] = useState<Option>({ value: "", label: "" });

  const formikRef = useRef<any>(null);

  // Fetch Paying Guest Catelogue , Room Catalogue and Habbitate Catalogue from backend to autofill respective fields
  function fetchPGCatelogue() {
    try {
      setPGs([
        {
          id: "pg1",
          name: "Sunrise Boys PG",
          address: "123, MG Road, Kolkata, West Bengal, 700001",
          owner_name: "Mr. Rajesh Kumar",
          owner_address: "456, Park Street, Kolkata, West Bengal, 700002",
        },
      ]);
    } catch (error) {
      toast.error(error.message || "Failed to fetch PG Catelogue");
    }
  }
  function fetchRoomCatelogue() {
    try {
    } catch (error) {
      toast.error(error.message || "Failed to fetch Room Catelogue");
    }
  }
  function fetchHabitatCatelogue() {
    try {
    } catch (error) {
      toast.error(error.message || "Failed to fetch Habitate Catelogue");
    }
  }

  useEffect(() => {
    // Fetch the catalogues on modal open
    fetchPGCatelogue();
    fetchRoomCatelogue();
    fetchHabitatCatelogue();
  }, []);

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

        {/* Autofill respective fields based on selected pg , room , habitate */}
        {/* Making three select boxes for selecting pg, room, and habitate */}
        <div className="mx-5 my-2 rounded-md px-2 py-3 bg-gray-100">
          <p className="text-lg font-semibold text-gray-600 mb-2">
            Import from Respective PG, Room and Habbitate
          </p>
          <hr />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="flex flex-row gap-2 justify-center items-center">
              <label className="text-sm text-nowrap font-medium text-gray-800">
                Select PG
              </label>
              <Select
                className="w-full p-2 rounded-md text-gray-800 placeholder:text-gray-600"
                placeholder="Select"
                options={pgs.map((pg) => ({ value: pg.id, label: pg.name }))}
                value={selectedPG}
                onChange={(selectedOption: any) => {
                  const selectedPG = pgs.find(
                    (pg) => pg.id === selectedOption?.value
                  );
                  setSelectedPG(selectedOption || { value: "", label: "" });
                  if (formikRef.current) {
                    formikRef.current.setFieldValue("pg_name", selectedPG?.name || "");
                    formikRef.current.setFieldValue(
                      "pg_full_address",
                      selectedPG?.address || ""
                    );
                    formikRef.current.setFieldValue(
                      "owner_name",
                      selectedPG?.owner_name || ""
                    );
                    formikRef.current.setFieldValue(
                      "owner_address",
                      selectedPG?.owner_address || ""
                    );
                  }
                }}
                isClearable
              />
            </div>
          </div>
        </div>

        {/* FORM */}
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
                  type="button"
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
