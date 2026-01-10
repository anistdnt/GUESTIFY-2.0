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
import EnlistAttractionForm from "@/components/Forms/EnlistAttraction";

type ModalType = {
  setshowModal: (show: boolean) => void;
  modalData?: any;
};

interface payloadType {
  place_name: string;
  address: string;
  description: string;
  image_url: string;
  image_id: string;
  state: string;
  country: string;
  time_taken_minutes: number;
  type: string;
}

const FormikSchema = {
  initialValues: {
    place_name: "",
    address: "",
    description: "",
    image_url: "",
    image_id: "",
    state: "West Bengal",
    country: "India",
    time_taken_minutes: 0,
    type: "",
  },

  validationSchema: Yup.object().shape({
    place_name: Yup.string()
      .trim()
      .required("Place name is required")
      .min(3, "Place name must be at least 3 characters"),

    type: Yup.string().required("Type is required"),

    address: Yup.string()
      .trim()
      .required("Address is required")
      .min(10, "Address must be at least 10 characters"),

    description: Yup.string()
      .trim()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters"),

    time_taken_minutes: Yup.number()
      .typeError("Time taken must be a number")
      .required("Time taken is required")
      .min(1, "Time must be greater than 1")
      .max(300, "Time seems too high"),

    image_url: Yup.string().required("Image is required"),

    image_id: Yup.string().required("Image ID is required"),

    state: Yup.string().oneOf(["West Bengal"], "Invalid state").required(),

    country: Yup.string().oneOf(["India"], "Invalid country").required(),
  }),
};

function EnlistNewAttraction({ setshowModal, modalData }: ModalType) {
  const dispatch = useDispatch();

  const handleSubmit = async (values: payloadType) => {
    try {
      dispatch(setLoading({ loading: true }));

      let payload = {
        ...values
      };

      let url = API.ADMIN.ATTRACTIONS.ENLSIT;
      let httpVerb: "POST" | "GET" | "PUT" | "DELETE" | "PATCH" = "POST";

      const res: ApiReturn<any> = await api_caller<any>(
        httpVerb,
        url,
        payload
      );

      if (res.success) {
        dispatch(hideModal(false));
        dispatch(triggerRefetch(true));
        toast.success(res.message || "Enlisted successfully");
      } else {
        throw new Error(res.error || "Failed to Enlist");
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
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
        className="relative flex flex-col gap-3 bg-white p-6 mx-2 rounded-md shadow-lg w-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-xl font-semibold">
            {modalData?.caption || "Accept & Initiate Payment"}
          </h3>
          <button onClick={() => setshowModal(false)}>
            <X size={20} />
          </button>
        </div>

        <hr />

        <Formik
          initialValues={FormikSchema.initialValues}
          validationSchema={FormikSchema.validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div className="overflow-y-scroll max-h-96">
                <EnlistAttractionForm />
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
                  {isSubmitting ? "Enlisting..." : "Enlist"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default EnlistNewAttraction;
