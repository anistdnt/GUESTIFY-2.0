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
    // console.log(values);
    try {
      dispatch(setLoading({ loading: true }));

      const payload = values;

      const res: ApiReturn<any> = await api_caller<any>(
        "POST",
        `${paying_guestID}/${API.PG.ADD_ROOM}`,
        payload
      );
      if (res.success) {
        router?.back();
        toast.success(res.message || "Save In successfully");
      } else {
        toast.error(`${res.message} : ${res.error}`);
      }
    } catch (error: any) {
      console.error("Error in submitting room details:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      dispatch(setLoading({ loading: false }));
    }
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
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={!dirty} // ✅ disables if nothing changed
                className={`px-6 py-2 rounded transition ${
                  dirty
                    ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                    : "bg-gray-400 cursor-not-allowed text-white"
                }`}
              >
                Submit Room Details
              </button>
              <button
                type="button"
                onClick={() => {
                  router.back();
                }}
                className="bg-slate-200 text-gray-800 hover:bg-slate-400 px-6 py-2 rounded transition"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
