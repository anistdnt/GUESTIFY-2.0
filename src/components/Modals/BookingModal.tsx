"use client";

import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { X } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { BookingFormFields } from "../Booking/BookingFormFields";
import { PersonCard } from "../Booking/PersonCard";
import { Formik, Form, FieldArray, useFormikContext } from "formik";
import { Calendar, ChatDots, Check, Clock, CreditCard, MapPin, Phone, Users } from "@phosphor-icons/react";

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
        first_name: Yup.string().trim().required("First name is required"),
        last_name: Yup.string().trim().required("Last name is required"),
        age: Yup.number()
          .min(1, "Age must be at least 1")
          .max(150, "Age must be less than 150")
          .required("Age is required"),
        gender: Yup.string()
          .oneOf(["male", "female", "other"], "Invalid gender")
          .required("Gender is required"),
        address: Yup.string().trim().required("Address is required"),
        dial_code: Yup.string().required("Dial code is required"),
        contact_number: Yup.string().trim().required("Contact number is required").length(10, "Contact number must be 10 digits"),
        type_of_identity: Yup.string()
          .oneOf(
            ["aadhar", "pan", "passport", "driving_license"],
            "Invalid identity type"
          )
          .required("Identity type is required"),
        identity_id: Yup.string().trim().required("Identity ID is required"),
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
  const formikRef = useRef<any>(null);
  const targetId = modalData?.rowid;
  const [isSubmitting, setIsSubmitting] = useState(false);;
  const [previewData, setPreviewData] = useState(null);
  const [personImages, setPersonImages] = useState<string[]>([]);

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
        contact_number: "",
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

  const handleSubmit = (values: any, formikHelpers: any) => {
    setPreviewData(values); // show preview
  };

  const confirmBooking = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...previewData,
        start_date: new Date(previewData.start_date)
          .toISOString()
          .split("T")[0]
          .replace(/-/g, "/"),
        persons: previewData.persons.map((p: any, index: number) => ({
          ...p,
          age: parseInt(p.age),
          is_primary: index === 0 ? 1 : 0,
        })),
      };

      const response: ApiReturn<any> = await api_caller("POST", API.USER.BOOKING.CREATE, payload);

      if (!response.success) throw new Error(response.message);

      toast.success(response.message || "Booking submitted successfully!");
      setshowModal(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  async function handleCloseModal() {
    setshowModal(false);
    try {
      const values = formikRef.current?.values;
      const publicIdsForImages = values.persons.filter((person: any) => person?.image_id !== "").map((person: any) => person.image_id);
      const publicIdsForIdentityImages = values.persons.filter((person: any) => person?.identity_image_id !== "").map((person: any) => person.identity_image_id);
      const payload = {
        public_ids: [...publicIdsForImages, ...publicIdsForIdentityImages],
      }
      if(payload.public_ids.length > 0) {
        const resData : ApiReturn<any> = await api_caller<any,typeof payload>("DELETE", API.IMAGE.MULTIDELETE, payload);
        if(!resData.success) {
          console.error("Error deleting images on modal close: ", resData.message);
        }
      }
     } catch (error) {
      console.error("Error closing modal:", error);
    }
  }



  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50"
      onClick={async () => await handleCloseModal()}
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
          <button onClick={async () => await handleCloseModal()}>
            <X size={20} />
          </button>
        </div>
        <hr />

        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values }) => {
            return (

            <Form className="flex flex-col h-[95%]">
              {/* Scrollable content area */}
              <div className="flex-1 overflow-y-auto p-1">
                <div className="py-2 px-4 bg-white shadow">
                  <h2 className="text-xl font-semibold text-gray-600 mb-1">
                    Booking Details
                  </h2>
                  <hr />
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
                                contact_number: "",
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
                  <button type="button" className="bg-gray-200 px-3 py-2 text-sm font-semibold rounded-md" onClick={async () => await handleCloseModal()}>
                    Cancel
                  </button>
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
          )}}
        </Formik>

        {previewData && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[999] backdrop-blur-md p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-slideUp">

              <div className="relative bg-gradient-to-br from-buttonsSecondary via-buttons to-buttonsHover text-white p-8">
                <button
                  onClick={() => setPreviewData(null)}
                  className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-all duration-200"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Check className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight">
                    Review Your Booking
                  </h2>
                </div>
                <p className="text-blue-100 ml-14">
                  Please verify all details before confirming your reservation
                </p>
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-6 bg-gradient-to-b from-gray-50 to-white">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-buttonsSecondary rounded-full"></div>
                    Booking Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Room</p>
                        <p className="font-semibold text-gray-900 text-lg">{modalData.title}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl bg-green-50/50 border border-green-100">
                      <div className="p-2 bg-green-600 rounded-lg">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Start Date</p>
                        <p className="font-semibold text-gray-900 text-lg">{previewData.start_date}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                      <div className="p-2 bg-purple-600 rounded-lg">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Duration</p>
                        <p className="font-semibold text-gray-900 text-lg">
                          {previewData.duration.year > 0 && `${previewData.duration.year} year${previewData.duration.year > 1 ? 's' : ''} `}
                          {previewData.duration.month > 0 && `${previewData.duration.month} month${previewData.duration.month > 1 ? 's' : ''}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-50/50 border border-orange-100">
                      <div className="p-2 bg-orange-600 rounded-lg">
                        <ChatDots className="w-5 h-5 text-white" weight="fill" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Remarks</p>
                        <p className="font-semibold text-gray-900">{previewData.remarks || "No remarks provided"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-buttonsSecondary rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-buttonsSecondary" />
                      Guest Information
                    </h3>
                    <span className="ml-auto text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {previewData.persons.length} {previewData.persons.length === 1 ? 'Guest' : 'Guests'}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {previewData.persons.map((person, index) => (
                      <div
                        key={index}
                        className="relative bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group"
                      >
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-400">
                            #{index + 1}
                          </span>
                          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${person.gender.toLowerCase() === 'male'
                              ? 'bg-gradient-male text-white'
                              : person.gender.toLowerCase() === 'female'
                                ? 'bg-gradient-female text-white'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                            {person.gender.toUpperCase()}
                          </span>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center gap-3">
                            <h4 className="text-xl font-bold text-gray-900 mb-1">
                              {person.first_name} {person.last_name}
                            </h4>
                            {person.is_primary === 1 && (
                              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                Primary Guest
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">Age: {person.age} years old</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Phone className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">Contact</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {person.dial_code} {person.contact_number}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <CreditCard className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">ID Type</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {person.type_of_identity.toUpperCase()}
                              </p>
                            </div>
                          </div>

                          <div className="md:col-span-2 flex items-start gap-3 pt-2 border-t border-gray-200">
                            <div className="p-2 bg-green-100 rounded-lg mt-0.5">
                              <MapPin className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 font-medium mb-1">Address</p>
                              <p className="text-sm text-gray-900">{person.address}</p>
                            </div>
                          </div>

                          <div className="md:col-span-2 bg-gray-100 rounded-lg p-3">
                            <p className="text-xs text-gray-500 font-medium mb-1">Identity Number</p>
                            <p className="text-sm font-mono font-semibold text-gray-900">
                              {person.identity_id}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t bg-white py-6 px-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg">
                <p className="text-sm text-gray-600 hidden sm:block">
                  By confirming, you agree to the booking terms
                </p>

                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setPreviewData(null)}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 active:scale-95 transition-all duration-200 disabled:opacity-50"
                  >
                    Edit Details
                  </button>

                  <button
                    onClick={confirmBooking}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-initial px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-buttonsSecondary to-buttons hover:from-buttons hover:to-buttonsHover active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Confirm Booking
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingModal;
