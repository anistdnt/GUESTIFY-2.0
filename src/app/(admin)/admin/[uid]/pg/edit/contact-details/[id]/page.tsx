"use client";
import ContactDetails from "@/components/Forms/ContactDetails";
import ContactDetailsFormSkeleton from "@/components/FormSkeletons/ContactDetailsFormSkeleton";
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
  const [formloading, setFormloading] = useState<boolean>(false);
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
      try {
        setFormloading(true);
        const res: ApiReturn<any> = await api_caller<any>(
          "GET",
          `${API.OWNER.GET_OWNER_BY_ID}/${paying_guestID}`
        );
        if (res.success) {
          setInitialFieldData({
            contact_details: res?.data,
          });
        } else {
          throw new Error(`${res.message} : ${res.error}`);
        }
      } catch (error) {
        toast?.error(error.message);
      } finally {
        setFormloading(false);
      }
    };
    fetchInformation();
  }, []);

  const handleSubmit = async (values: any) => {
    if (!reduxAuthVerification?.isPhoneVerified) {
      toast.error("Please verify your phone number before proceeding.");
      return;
    }
    if (!reduxAuthVerification?.isEmailVerified) {
      toast.error("Please verify your email address before proceeding.");
      return;
    }

    delete values.contact_details.is_phone_verified;
    delete values.contact_details.is_email_verified;

    const payload = {
      ...values.contact_details,
      same_as_phone: values.contact_details.same_as_phone ? true : false,
      is_phone_verified: reduxAuthVerification?.isPhoneVerified ? true : false,
      is_email_verified: reduxAuthVerification?.isEmailVerified ? true : false,
      image_url: reduxUserData?.image_url || "",
      owner_name:
        `${reduxUserData?.first_name} ${reduxUserData?.last_name}` || "",
    };

    dispatch(setLoading({ loading: true }));

    const res: ApiReturn<any> = await api_caller<any>(
      "PUT",
      `${API.OWNER.UPDATE_OWNER}/${paying_guestID}`,
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
      {formloading ? (
        <ContactDetailsFormSkeleton />
      ) : (
        <Formik
          initialValues={initialFieldData}
          validationSchema={OnlyContact_ValidationSchema?.validation}
          enableReinitialize={true}
          onSubmit={handleSubmit}
        >
          {({ dirty }) => (
            <Form>
              <ContactDetails caption="Update Contact Details" />
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={!dirty} // ✅ disables if nothing changed
                  className={`mt-5 px-6 py-2 rounded transition ${
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
                  className="bg-slate-200 text-gray-800 hover:bg-slate-400 px-6 py-2 rounded transition mt-5"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}
