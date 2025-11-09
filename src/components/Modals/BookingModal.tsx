"use client";

import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { setLoading } from "@/redux/slices/loaderSlice";
import { deleteSuccess, hideModal } from "@/redux/slices/modalSlice";
import { X } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { BookingFormFields } from "../Booking/BookingFormFields";
import { PersonCard } from "../Booking/PersonCard";
import { Formik, Form, FieldArray } from "formik";

type ModalType = {
  setshowModal: (show: boolean) => void;
  modalData?: any;
};

const validationSchema = Yup.object().shape({
  room_id: Yup.string().required("Room ID is required"),
  start_date: Yup.date().required("Start date is required"),
  duration: Yup.object().shape({
    year: Yup.number()
      .min(0, "Year must be 0 or greater")
      .required("Year is required"),
    month: Yup.number()
      .min(0, "Month must be between 0 and 11")
      .max(11, "Month must be between 0 and 11")
      .required("Month is required"),
  }),
  remarks: Yup.string(),
  persons: Yup.array()
    .of(
      Yup.object().shape({
        first_name: Yup.string().required("First name is required"),
        last_name: Yup.string().required("Last name is required"),
        age: Yup.number()
          .min(1, "Age must be at least 1")
          .max(150, "Age must be less than 150")
          .required("Age is required"),
        gender: Yup.string()
          .oneOf(["male", "female", "other"], "Invalid gender")
          .required("Gender is required"),
        address: Yup.string().required("Address is required"),
        dial_code: Yup.string().required("Dial code is required"),
        contact_number: Yup.string().required("Contact number is required"),
        type_of_identity: Yup.string()
          .oneOf(
            ["aadhar", "pan", "passport", "driving_license"],
            "Invalid identity type"
          )
          .required("Identity type is required"),
        identity_id: Yup.string().required("Identity ID is required"),
        is_primary: Yup.number().oneOf([0, 1]),
        image: Yup.string()
          .url("Must be a valid URL")
          .required("Image is required"),
        image_id: Yup.string().required("Image ID is required"),
        identity_image: Yup.string()
          .url("Must be a valid URL")
          .required("Identity image is required"),
        identity_image_id: Yup.string().required(
          "Identity image ID is required"
        ),
      })
    )
    .min(1, "At least one person is required"),
});



function BookingModal({ setshowModal, modalData }: ModalType) {
  const dispatch = useDispatch();
  const router = useRouter();
  const targetId = modalData?.rowid;
  const [isSubmitting, setIsSubmitting] = useState(false);;

  const initialValues = {
  room_id: modalData?.room_id,
  start_date: "",
  duration: {
    year: 0,
    month: 0,
  },
  remarks: "",
  persons: [
    {
      first_name: "",
      last_name: "",
      age: "",
      gender: "male",
      address: "",
      dial_code: "+91",
      contact_number:"",
      type_of_identity: "aadhar",
      identity_id: "",
      is_primary: 1,
      image: "",
      image_id: "",
      identity_image: "",
      identity_image_id: "",
    },
  ],
};

  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        start_date: new Date(values.start_date)
          .toISOString()
          .split("T")[0]
          .replace(/-/g, "/"),
        persons: values.persons.map((person: any, index: number) => ({
          ...person,
          age: parseInt(person.age),
          is_primary: index === 0 ? 1 : 0,
        })),
      };

      const response : ApiReturn<any> = await api_caller<any,typeof initialValues>("POST", API.USER.BOOKING.CREATE, payload);
      console.log(response)

      if (!response.success) {
        throw new Error(response.message || "Booking failed");
      }

      toast.success(response?.message || "Booking submitted successfully!");
      resetForm();
      setshowModal(false);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.message || "Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50"
      onClick={() => setshowModal(false)}
    >
      <div
        className="relative flex flex-col bg-white p-6 mx-2 rounded-md shadow-lg w-3/4 h-5/6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-row justify-between items-center mb-3">
          <h3 className="text-xl font-medium">
            {modalData?.caption ?? "Booking Modal"} ({modalData?.title || ''})
          </h3>
          <button onClick={() => setshowModal(false)}>
            <X size={20} />
          </button>
        </div>
        <hr />

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form className="flex flex-col h-[95%]">
              {/* Scrollable content area */}
              <div className="flex-1 overflow-y-auto p-1">
                <div className="py-2 px-4 bg-white shadow">
                  <h2 className="text-xl font-semibold text-gray-600 mb-1">
                    Booking Details
                  </h2>
                  <hr/>
                  <div className="mt-3"><BookingFormFields /></div>
                </div>

                <div className="py-2 px-4 bg-white shadow">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-600 mb-1">
                      Guest Information
                    </h2>
                  </div>

                  <div className="mt-3">
                    <FieldArray name="persons">
                    {({ push, remove }) => (
                      <div className="space-y-6">
                        {values.persons.map((person, index) => (
                          <PersonCard
                            key={index}
                            index={index}
                            person={person}
                            onRemove={() => remove(index)}
                            canRemove={values.persons.length > 1}
                            isPrimary={index === 0}
                          />
                        ))}

                        <button
                          type="button"
                          onClick={() =>
                            push({
                              first_name: "",
                              last_name: "",
                              age: "",
                              gender: "male",
                              address: "",
                              dial_code: "+91",
                              contact_number:"",
                              type_of_identity: "aadhar",
                              identity_id: "",
                              is_primary: 0,
                              image: "",
                              image_id: "",
                              identity_image: "",
                              identity_image_id: "",
                            })
                          }
                          className="w-full border-dashed border-2 py-4 rounded-md text-gray-600 hover:border-slate-400 hover:bg-slate-50 transition"
                        >
                          + Add Another Guest
                        </button>
                      </div>
                    )}
                  </FieldArray>
                  </div>
                </div>
              </div>

              {/* Fixed footer inside modal */}
              <div className="sticky bottom-0 left-0 right-0 bg-white border-t py-4 mt-2">
                <div className="flex justify-end gap-4 px-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-3 py-2 text-sm font-semibold bg-buttons text-white rounded-md hover:bg-buttonsHover transition"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Booking"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default BookingModal;
