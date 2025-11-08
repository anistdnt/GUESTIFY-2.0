"use client";

import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { setLoading } from "@/redux/slices/loaderSlice";
import { hideModal, triggerRefetch } from "@/redux/slices/modalSlice";
import { CurrencyInr, X } from "@phosphor-icons/react/dist/ssr";
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
  payment_dunning: Yup.number()
    .typeError("Payment dunning must be a number")
    .required("Payment dunning is required")
    .positive("Must be a positive number"),
  message: Yup.string(),
});

function AcceptandInitiatePaymentModal({ setshowModal, modalData }: ModalType) {
  const dispatch = useDispatch();

  const handleSubmit = async (values: {
    payment_dunning: number;
    message: string;
  }) => {
    try {
      dispatch(setLoading({ loading: true }));

      const payload = {
        status: "accepted",
        payment_details: {
          amount: modalData?.amount || 100,
          payment_dunning: values.payment_dunning,
          message: values.message,
        },
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
        toast.success(res.message || "Payment initiated successfully");
      } else {
        toast.error(res.error || "Failed to initiate payment");
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
          <h3 className="text-xl font-semibold">Accept & Initiate Payment</h3>
          <button onClick={() => setshowModal(false)}>
            <X size={20} />
          </button>
        </div>

        <hr />

        <h4 className="flex justify-start items-center gap-1">
          <span>Total Amount :</span>{" "}
          <span className="flex items-center gap-1">
            <CurrencyInr size={15} />
            <span>{modalData?.amount || '2345'}</span>
          </span>
          <span className="text-gray-700 text-sm">({modalData?.deposit_duration || 'Monthly'})</span>
        </h4>

        <Formik
          initialValues={{ payment_dunning: 0, message: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Payment Dunning */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 required">
                  Payment Dunning (in days)
                </label>
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <Field
                    type="number"
                    name="payment_dunning"
                    placeholder="Enter number of days"
                    className="w-full px-3 py-2 outline-none"
                  />
                  <span className="px-3 py-2 bg-gray-100 text-gray-600 border-r">
                    Days
                  </span>
                </div>
                <ErrorMessage
                  name="payment_dunning"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Message
                </label>
                <Field
                  as="textarea"
                  name="message"
                  rows={3}
                  placeholder="Enter message to the user..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-300 outline-none"
                />
                <ErrorMessage
                  name="message"
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
                  {isSubmitting ? "Processing..." : "Initiate Payment"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default AcceptandInitiatePaymentModal;
