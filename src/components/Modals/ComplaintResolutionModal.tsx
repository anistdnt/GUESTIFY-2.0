"use client";

import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { setLoading } from "@/redux/slices/loaderSlice";
import { hideModal, triggerRefetch } from "@/redux/slices/modalSlice";
import { X, CheckCircle, WarningCircle, Clock } from "@phosphor-icons/react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import React from "react";

type ModalType = {
  setshowModal: (show: boolean) => void;
  modalData?: {
    id: string;
    status: string;
  };
};

const validationSchema = Yup.object().shape({
  resolution_details: Yup.string()
    .required("Resolution details are required")
    .min(10, "Please provide at least 10 characters"),
});

export default function ComplaintResolutionModal({ setshowModal, modalData }: ModalType) {
  const dispatch = useDispatch();

  const statusIcons: any = {
    pending: <Clock className="text-amber-500" size={24} weight="bold" />,
    resolved: <CheckCircle className="text-green-500" size={24} weight="bold" />,
    rejected: <X className="text-red-500" size={24} weight="bold" />,
  };

  const statusColors: any = {
    pending: "text-amber-600 bg-amber-50 border-amber-100",
    resolved: "text-green-600 bg-green-50 border-green-100",
    rejected: "text-red-600 bg-red-50 border-red-100",
  };

  const handleSubmit = async (values: { resolution_details: string }) => {
    if (!modalData?.id || !modalData?.status) return;

    try {
      dispatch(setLoading({ loading: true }));

      const res: ApiReturn<any> = await api_caller<any>(
        "PATCH",
        API.COMPLAINT.STATUS.replace(":id", modalData.id),
        {
          status: modalData.status,
          resolution_details: values.resolution_details,
        }
      );

      if (res.success) {
        dispatch(hideModal(false));
        dispatch(triggerRefetch(true));
        toast.success(`Complaint marked as ${modalData.status}`);
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm z-50 p-4"
      onClick={() => setshowModal(false)}
    >
      <div
        className="relative flex flex-col gap-4 bg-white p-8 mx-4 rounded-3xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border ${statusColors[modalData?.status || "pending"]}`}>
              {statusIcons[modalData?.status || "pending"]}
            </div>
            <h3 className="text-xl font-display font-bold text-gray-900">
              Update <span className="italic-serif text-primary-600">Status</span>
            </h3>
          </div>
          <button onClick={() => setshowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} weight="bold" className="text-gray-400" />
          </button>
        </div>

        <hr className="border-gray-100" />

        <p className="text-sm text-gray-500 font-jakarta">
          You are changing the status to <span className="font-bold uppercase tracking-widest text-[10px] px-2 py-0.5 rounded-full border bg-gray-50 ml-1">{modalData?.status}</span>.
          Please provide the resolution details below.
        </p>

        <Formik
          initialValues={{ resolution_details: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                  Resolution Details
                </label>
                <Field
                  as="textarea"
                  name="resolution_details"
                  rows={4}
                  placeholder="Describe how the complaint was handled or why it was rejected..."
                  className={`w-full px-5 py-4 border rounded-2xl focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-jakarta text-sm ${
                    errors.resolution_details && touched.resolution_details
                      ? "border-red-300 bg-red-50/30"
                      : "border-gray-100 bg-gray-50/50 focus:border-primary-500 focus:bg-white"
                  }`}
                />
                <ErrorMessage
                  name="resolution_details"
                  component="div"
                  className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-2 px-1"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setshowModal(false)}
                  className="px-6 py-3 bg-white text-gray-400 border border-gray-100 rounded-xl font-bold text-[10px] tracking-widest uppercase hover:text-gray-900 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold text-[10px] tracking-widest uppercase shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Submit Resolution"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
