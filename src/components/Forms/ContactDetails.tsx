"use client";
import { Field, ErrorMessage, useFormikContext } from "formik";
import Select from "react-select";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { hideModal, setModalVisibility } from "@/redux/slices/modalSlice";
import { setLoading } from "@/redux/slices/loaderSlice";
import { SealCheck } from "@phosphor-icons/react/dist/ssr";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { RootState } from "@/redux/store";
import {
  setEmailVerified,
  setPhoneVerified,
} from "@/redux/slices/authVerifiactionSlice";

export default function ContactDetails({ caption }: { caption?: string }) {
  // Get user data from Redux store
  const reduxUserData = useSelector(
    (state: RootState) => state.user_slice.userData
  );
  const reduxAuthVerification = useSelector(
    (state: RootState) => state.auth_verification_slice
  );
  const { setFieldValue, values } = useFormikContext<any>();
  const dispatch = useDispatch();

  const countryCodes = [
    { label: "+91 (India)", value: "+91" },
    { label: "+1 (USA)", value: "+1" },
    { label: "+44 (UK)", value: "+44" },
    { label: "+61 (Australia)", value: "+61" },
    { label: "+81 (Japan)", value: "+81" },
  ];

  // initialize redux state for phone and email verification
  useEffect(() => {
    dispatch(setPhoneVerified(values.contact_details.is_phone_verified));
    dispatch(setEmailVerified(values.contact_details.is_email_verified));
  },[dispatch, values.contact_details.is_phone_verified, values.contact_details.is_email_verified]);

  // Auto-fill WhatsApp number if toggle is checked
  useEffect(() => {
    if (values.contact_details.same_as_phone) {
      setFieldValue(
        "contact_details.whatsapp_number",
        values.contact_details.phone_number || ""
      );
      setFieldValue(
        "contact_details.whatsapp_code",
        values.contact_details.country_code || ""
      );
    }
  }, [
    values.contact_details.same_as_phone,
    values.contact_details.phone_number,
    values.contact_details.country_code,
  ]);

  const handleValidationPhone = async (value: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(value)) {
      toast.error("Phone number must be exactly 10 digits");
      return false;
    }

    const payload = {
      phoneNumber: `${values.contact_details.country_code}${value}`,
    };

    dispatch(setLoading({ loading: true }));
    const result: ApiReturn<any> = await api_caller<any>(
      "POST",
      `${API.VERIFICATION.SEND_PHONE_OTP}`,
      payload
    );

    if (result.success) {
      if (result?.data?.bypassed) {
        dispatch(setPhoneVerified(true));
        toast.success(result?.message || "Phone number verified successfully!");
      } else {
        toast.success(result?.message || "OTP sent successfully!");
        dispatch(
          setModalVisibility({
            open: true,
            type: "otpVerify",
            modalData: {
              validationType: "phone",
              timerDuration: 60, // seconds
              phoneNumber: payload?.phoneNumber,
            },
          })
        );
      }

      dispatch(setLoading({ loading: false }));
    } else {
      dispatch(setLoading({ loading: false }));
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const handleValidationEmail = async (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    const payload = {
      email: value,
      owner_name: reduxUserData?.first_name + " " + reduxUserData?.last_name,
    };

    dispatch(setLoading({ loading: true }));
    const result: ApiReturn<any> = await api_caller<any>(
      "POST",
      `${API.VERIFICATION.SEND_EMAIL_OTP}`,
      payload
    );

    if (result.success) {
      if (result?.data?.bypassed) {
        dispatch(setEmailVerified(true));
        toast.success(result?.message || "Email verified successfully!");
      } else {
        toast.success(result?.message || "OTP sent successfully!");
        dispatch(
          setModalVisibility({
            open: true,
            type: "otpVerify",
            modalData: {
              validationType: "email",
              timerDuration: 60, // seconds
              email: payload?.email,
              owner_name: payload?.owner_name,
            },
          })
        );
      }
      dispatch(setLoading({ loading: false }));
    } else {
      dispatch(setLoading({ loading: false }));
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800">{caption ?? 'Contact Details'}</h2>
        <p className="text-gray-600">
          Please provide valid contact information for verification purposes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Phone Number */}
        <div className="">
          <label className="block mb-1 font-medium">
            Phone Number <span className="text-red-600 font-semibold">*</span>
          </label>
          <div className="flex gap-2">
            <div className="w-32">
              <Select
                options={countryCodes}
                value={countryCodes.find(
                  (opt) => opt.value === values.contact_details.country_code
                )}
                onChange={(option) =>
                  setFieldValue("contact_details.country_code", option?.value)
                }
                placeholder="Code"
                isDisabled={reduxAuthVerification.isPhoneVerified}
              />
            </div>
            <Field
              name="contact_details.phone_number"
              placeholder="Enter phone number"
              className="p-2 border rounded flex-1"
              disabled={reduxAuthVerification.isPhoneVerified}
            />
            <button
              type="button"
              disabled={reduxAuthVerification.isPhoneVerified}
              className={`text-white flex justify-center items-center px-4 rounded ${
                reduxAuthVerification.isPhoneVerified
                  ? "opacity-85 cursor-not-allowed bg-green-600"
                  : "bg-buttons hover:bg-buttonsHover"
              }`}
              onClick={() =>
                handleValidationPhone(values.contact_details.phone_number)
              }
            >
              {reduxAuthVerification.isPhoneVerified ? (
                <div className="flex justify-center items-center gap-2">
                  <SealCheck size={20} weight="fill" />
                  <span>Verified</span>
                </div>
              ) : (
                "Verify"
              )}
            </button>
          </div>
          <ErrorMessage
            name="contact_details.phone_number"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        {/* Alternate Phone Number */}
        <div className="">
          <label className="block mb-1 font-medium">
            Alternate Phone Number
          </label>
          <div className="flex gap-2">
            <div className="w-32">
              <Select
                options={countryCodes}
                value={countryCodes.find(
                  (opt) => opt.value === values.contact_details.alt_country_code
                )}
                onChange={(option) =>
                  setFieldValue(
                    "contact_details.alt_country_code",
                    option?.value
                  )
                }
                placeholder="Code"
              />
            </div>
            <Field
              name="contact_details.alt_phone_number"
              placeholder="Enter alternate phone"
              className="p-2 border rounded flex-1"
            />
          </div>
          <ErrorMessage
            name="contact_details.alt_phone_number"
            component="span"
            className="text-red-500 text-sm"
          />
        </div>

        {/* WhatsApp Number */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">WhatsApp Number</label>
          <div className="flex gap-2 mb-2">
            <div className="w-32">
              <Select
                options={countryCodes}
                value={countryCodes.find(
                  (opt) => opt.value === values.contact_details.whatsapp_code
                )}
                onChange={(option) =>
                  setFieldValue("contact_details.whatsapp_code", option?.value)
                }
                placeholder="Code"
                isDisabled={values.contact_details.same_as_phone}
              />
            </div>
            <Field
              name="contact_details.whatsapp_number"
              placeholder="Enter WhatsApp number"
              className="p-2 border rounded flex-1"
              disabled={values.contact_details.same_as_phone}
            />
          </div>
          <label className="flex items-center gap-2 text-gray-700">
            <Field type="checkbox" name="contact_details.same_as_phone" />
            Same as phone number
          </label>
        </div>
      </div>

      {/* Email Field */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Email Address <span className="text-red-600 font-semibold">*</span>
        </label>
        <div className="flex gap-2">
          <Field
            name="contact_details.email"
            type="email"
            placeholder="Enter email"
            className="p-2 border rounded flex-1"
            disabled={reduxAuthVerification.isEmailVerified}
          />
          <button
            type="button"
            className={`text-white flex justify-center items-center px-4 rounded ${
              reduxAuthVerification.isEmailVerified
                ? "opacity-85 cursor-not-allowed bg-green-600"
                : "bg-buttons hover:bg-buttonsHover"
            }`}
            onClick={() => handleValidationEmail(values.contact_details.email)}
          >
            {reduxAuthVerification.isEmailVerified ? (
              <div className="flex justify-center items-center gap-2">
                <SealCheck size={20} weight="fill" />
                <span>Verified</span>
              </div>
            ) : (
              "Verify"
            )}
          </button>
        </div>
        <ErrorMessage
          name="contact_details.email"
          component="span"
          className="text-red-500 text-sm"
        />
      </div>

      {/* Preferred Contact Method */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Preferred Contact Method
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <Field
              type="radio"
              name="contact_details.preferred_contact"
              value="phone"
            />
            Phone
          </label>
          <label className="flex items-center gap-2">
            <Field
              type="radio"
              name="contact_details.preferred_contact"
              value="email"
            />
            Email
          </label>
          <label className="flex items-center gap-2">
            <Field
              type="radio"
              name="contact_details.preferred_contact"
              value="whatsapp"
            />
            WhatsApp
          </label>
        </div>
      </div>
      <ErrorMessage
        name="contact_details.preferred_contact"
        component="span"
        className="text-red-500 text-sm"
      ></ErrorMessage>
      <div id="recaptcha-container"></div>
    </>
  );
}
