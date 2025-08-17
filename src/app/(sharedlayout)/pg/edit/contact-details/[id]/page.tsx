"use client";
import ContactDetails from "@/components/Forms/ContactDetails";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { base64ToFile } from "@/lib/imageConvert";
import { setLoading } from "@/redux/slices/loaderSlice";
import { RootState } from "@/redux/store";
import { OnlyContact_ValidationSchema } from "@/validations/onlycontactdetails";
import { Form, Formik } from "formik";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function BasicDetailsEdit() {
  const params = useParams();
  const paying_guestID = params?.id;
  const [initialFieldData, setInitialFieldData] = useState(
    OnlyContact_ValidationSchema?.initials
  );
  const reduxUserData = useSelector(
    (state: RootState) => state.user_slice.userData
  );
  const reduxAuthVerification = useSelector(
    (state: RootState) => state.auth_verification_slice
  );
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchInformation = async () => {
      const res: ApiReturn<any> = await api_caller<any>(
        "GET",
        `${API.OWNER.GET_OWNER_BY_ID}/${paying_guestID}`
      );
      if (res.success) {
        setInitialFieldData({
            contact_details: res?.data
        });
      } else {
        toast.error(`${res.message} : ${res.error}`);
      }
    };
    fetchInformation();
  }, []);

  const handleSubmit = async (values: any) => {
    const formData = new FormData();

    delete values.contact_details.is_phone_verified;
    delete values.contact_details.is_email_verified;

    // ✅ Add top-level fields
    Object.entries(values).forEach(([key, value]) => {
      if (key === "rooms") return; // skip for now

      if (
        key === "contact_details" &&
        typeof value === "object" &&
        value !== null
      ) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          formData.append(
            `contact_details[${subKey}]`,
            (subValue as string) ?? ""
          );
        });
        formData.append(
          "contact_details[is_phone_verified]",
          reduxAuthVerification?.isPhoneVerified ? "true" : "false"
        );
        formData.append(
          "contact_details[is_email_verified]",
          reduxAuthVerification?.isEmailVerified ? "true" : "false"
        );
        formData.append(
          "contact_details[image_url]",
          reduxUserData?.image_url || ""
        );
        return;
      }
    });

    dispatch(setLoading({ loading: true }));

    const res: ApiReturn<any> = await api_caller<any>(
      "PUT",
      `${API.PG.UPDATE}/${paying_guestID}/basic-details`,
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
        initialValues={initialFieldData}
        validationSchema={OnlyContact_ValidationSchema?.validation}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {({ dirty }) => (
          <Form>
            <ContactDetails caption="Update Contact Details" />
            <button
              type="submit"
              disabled={!dirty} // ✅ disables if nothing changed
              className={`ml-auto px-6 py-2 rounded transition ${
                dirty
                  ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                  : "bg-gray-400 cursor-not-allowed text-white"
              }`}
            >
              Update Details
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
