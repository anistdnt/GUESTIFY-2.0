"use client";
import RoomForm from "@/components/Forms/RoomForm";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { base64ToFile } from "@/lib/imageConvert";
import { setLoading } from "@/redux/slices/loaderSlice";
import { deleteSuccess } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import { Only_RoomValidationSchema } from "@/validations/onlyroom";
import { Form, Formik } from "formik";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function RoomDetailsEdit() {
  const params = useParams();
  const paying_guestID = params?.id;
  const isDeleted = useSelector(
    (state: RootState) => state.modal_slice.isDeleted
  );
  const [initialFieldData, setInitialFieldData] = useState(
    Only_RoomValidationSchema?.initials
  );

  const reduxUserData = useSelector(
    (state: RootState) => state.user_slice.userData
  );
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isDeleted]);

  useEffect(() => {
    const fetchInformation = async () => {
      const res: ApiReturn<any> = await api_caller<any>(
        "GET",
        `${API.ROOM.GET_ROOM_BY_ID}/${paying_guestID}/room-details`
      );
      if (res.success) {
        setInitialFieldData({
          rooms: res?.data,
        });
      } else {
        toast.error(`${res.message} : ${res.error}`);
      }
    };
    fetchInformation();
    dispatch(deleteSuccess(false));
  }, [isDeleted]);

  const handleSubmit = async (values: any) => {
    const payload = {
      ...values,
    };

    // console.log("Submitted values Formadata:", values);
    dispatch(setLoading({ loading: true }));

    const res: ApiReturn<any> = await api_caller<any>(
      "PUT",
      `${API.ROOM.UPDATE}/${paying_guestID}/room-details`,
      payload
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
        initialValues={initialFieldData}
        validationSchema={Only_RoomValidationSchema?.validation}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {({ dirty, errors, values }) => {
          console.log("Formik errors:", errors);
          console.log("Formik values:", values);
          return(
          <Form>
            <RoomForm hasAddBtn={false} caption="Update Room Details" />
            <div className="flex justify-between w-full items-center">
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={!dirty} // ✅ disables if nothing changed
                  className={`px-6 py-2 rounded transition ${
                    dirty
                      ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                      : "bg-gray-400 cursor-not-allowed text-white"
                  }`}
                >
                  Update Details
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
              <button
                type="button"
                className="px-6 py-2 rounded transition bg-buttonsSecondary hover:bg-buttonsHover text-white"
                onClick={() => router.push(`/admin/${params?.uid}/pg/${paying_guestID}/add-room`)}
              >
                Enlist New Rooms
              </button>
            </div>
          </Form>
        )}}
      </Formik>
    </div>
  );
}
