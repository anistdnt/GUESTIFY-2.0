"use client";

import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { setLoading } from "@/redux/slices/loaderSlice";
import { hideModal, triggerRefetch } from "@/redux/slices/modalSlice";
import { X } from "@phosphor-icons/react/dist/ssr";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import React from "react";

type ModalType = {
  setshowModal: (show: boolean) => void;
  modalData?: any;
};

// ✅ Validation Schema
const validationSchema = Yup.object().shape({
  reason: Yup.string().min(20,"Reason must have at least 20 charecters").required("Please mention the reason of revolking"),
});

function RevolkModal({ setshowModal, modalData }: ModalType) {
  const dispatch = useDispatch();

  const handleSubmit = async (values: {
    reason: string;
  }) => {
    try {
      dispatch(setLoading({ loading: true }));

      const payload = {
        status: "revolked",
        reason: values?.reason || ""
      };

      const res: ApiReturn<any> = await api_caller<any>(
        "PATCH",
        `${API.ADMIN.BOOKING.CHANGE_STATUS}`.replace(
          ":id",
          modalData?.booking_id
        ),
        payload
      );

      if (res.success) {
        dispatch(hideModal(false));
        dispatch(triggerRefetch(true));
        toast.success(res.message || "Booking has been revolked successfully");
      } else {
        toast.error(res.error || "Failed to revolk Booking");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50"
      onClick={() => setshowModal(false)}
    >
      <div
        className="relative flex flex-col gap-3 bg-white p-6 mx-2 rounded-md shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-xl font-semibold">Revolke Booking</h3>
          <button onClick={() => setshowModal(false)}>
            <X size={20} />
          </button>
        </div>

        <hr />

        <p className="text-sm text-yellow-600 rounded-md border border-1 border-yellow-600 px-2 py-1">Are you sure you want to revolk this booking ?</p>

        <Formik
          initialValues={{ reason: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">

              {/* Message */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 required">
                  Reason of Revolking
                </label>
                <Field
                  as="textarea"
                  name="reason"
                  rows={3}
                  placeholder="Enter reason to the user..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-300 outline-none"
                />
                <ErrorMessage
                  name="reason"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setshowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
                >
                  {isSubmitting ? "Processing..." : "Revolke Booking"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default RevolkModal;
