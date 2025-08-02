"use client";
import RoomForm from "@/components/Forms/RoomForm";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { base64ToFile } from "@/lib/imageConvert";
import { setLoading } from "@/redux/slices/loaderSlice";
import { RootState } from "@/redux/store";
import { Only_RoomValidationSchema } from "@/validations/onlyroom";
import { Form, Formik } from "formik";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function AddRoomsForm() {
  const params = useParams();
  const paying_guestID = params?.id;

  const reduxUserData = useSelector(
    (state: RootState) => state.user_slice.userData
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    const formData = new FormData();

    // ✅ Add rooms array with their files
    values.rooms.forEach((room: any, index: number) => {
      Object.entries(room).forEach(([key, value]) => {
        if (key === "room_image_url" && value) {
          if (typeof value === "string" && value.startsWith("data:image/")) {
            const file = base64ToFile(value, `Room-Image-${Date.now()}`);
            formData.append(`rooms[${index}][${key}]`, file);
          } else {
            formData.append(`rooms[${index}][${key}]`, value as File);
          }
        } else if (key !== "room_image_url") {
          formData.append(`rooms[${index}][${key}]`, (value as string) ?? "");
        }
      });
    });

    // console.log("Submitted values Formadata:", values);
    dispatch(setLoading({ loading: true }));

    const res: ApiReturn<any> = await api_caller<any>(
      "POST",
      `${paying_guestID}/${API.PG.ADD_ROOM}`,
      formData
    );
    if (res.success) {
      dispatch(setLoading({ loading: false }));
      router?.push(`/profile/${reduxUserData?._id}/mypg`);
      toast.success(res.message || "Save In successfully");
    } else {
      dispatch(setLoading({ loading: false }));
      toast.error(`${res.message} : ${res.error}`);
    }

    // alert("Form submitted successfully!");
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg mb-8">
      <Formik
        initialValues={Only_RoomValidationSchema?.initials}
        validationSchema={Only_RoomValidationSchema?.validation}
        onSubmit={handleSubmit}
      >
        {({ dirty }) => (
          <Form>
            <RoomForm />
            <button
              type="submit"
              disabled={!dirty} // ✅ disables if nothing changed
              className={`ml-auto px-6 py-2 rounded transition ${
                dirty
                  ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                  : "bg-gray-400 cursor-not-allowed text-white"
              }`}
            >
              Submit Room Details
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
