"use client";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { RootState } from "@/redux/store";
import { ArrowSquareOut, Check } from "@phosphor-icons/react/dist/ssr";
import { Form, getIn, setIn } from "formik";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

type StepperProps = {
  steps: { label: string; content: ReactNode }[];
  helpers?: any;
};

const stepFields = [
  [
    "contact_details.country_code",
    "contact_details.phone_number",
    "contact_details.alt_country_code",
    "contact_details.alt_phone_number",
    "contact_details.whatsapp_code",
    "contact_details.whatsapp_number",
    "contact_details.same_as_phone",
    "contact_details.preferred_contact",
    "contact_details.email",
  ],
  [
    "pg_name",
    "street_name",
    "house_no",
    "state",
    "pincode",
    "district",
    "pg_type",
    "wifi_available",
    "food_available",
    "rules",
    "pg_image_url",
  ],
  ["rooms"], // You can refine this to ["rooms[0].room_type", ...] if needed
];

export default function Stepper({ steps, helpers }: StepperProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const isLast = currentStep === steps.length - 1;
  const isFirst = currentStep === 0;
  const reduxAuthVerification = useSelector(
    (state: RootState) => state.auth_verification_slice
  );
  const reduxUserData = useSelector((state: RootState) => state.user_slice);
  const router = useRouter();

  const handleNext = async (
    index: number,
    validateForm: any,
    errors: any,
    touched: any,
    setTouched: any
  ) => {
    const fieldsToValidate = stepFields[index];

    // Mark fields as touched
    let touchedMap: any = { ...touched };
    fieldsToValidate.forEach((f) => {
      touchedMap = setIn(touchedMap, f, true);
    });
    setTouched(touchedMap);

    const allErrors = await validateForm();

    // Use getIn to handle nested fields
    const hasErrors = fieldsToValidate.some(
      (field) => !!getIn(allErrors, field)
    );

    if (!hasErrors) {
      if (!reduxAuthVerification?.isPhoneVerified) {
        toast.error("Please verify your phone number before proceeding.");
        return;
      }
      if (!reduxAuthVerification?.isEmailVerified) {
        toast.error("Please verify your email address before proceeding.");
        return;
      }
      setCurrentStep((s) => s + 1);
    }
  };

  async function handleClose() {
    router.push(`/profile/${reduxUserData?.userData?._id}/mypg`);
    try {
      const publicIdsForPgImages = helpers?.values.pg_images.filter((image: any) => image?.pg_image_id !== "").map((image: any) => image?.pg_image_id);
      const publicIdsForRoomImages = helpers?.values.rooms.flatMap((room: any) => room.room_images.filter((image: any) => image?.room_image_id !== "").map((image: any) => image?.room_image_id))
      const payload = {
        public_ids: [...publicIdsForPgImages, ...publicIdsForRoomImages],
      }
      if (payload.public_ids.length > 0) {
        const resData: ApiReturn<any> = await api_caller<any, typeof payload>("DELETE", API.IMAGE.MULTIDELETE, payload);
        if (!resData.success) {
          console.error("Error deleting images on modal close: ", resData.message);
        }
      }
    } catch (error) {
      console.error("Error closing modal:", error);
    }
  }

  useEffect(() => {
    window?.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  return (
    <div className="w-full">
      {/* Step Indicator - Premium Redesign */}
      <div className="flex justify-between items-center relative mb-16 max-w-4xl mx-auto px-4">
        {/* Progress Background Line */}
        <div className="absolute top-6 left-0 right-0 h-[2px] bg-gray-100 -translate-y-1/2 z-0 hidden sm:block"></div>
        
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center relative group"
            >
              {/* Connector line - Interactive Progress */}
              {index < steps.length - 1 && (
                <div className="absolute top-6 left-[50%] w-full h-[2px] bg-gray-100 z-0 hidden sm:block">
                  <div
                    className={`h-full transition-all duration-700 ease-in-out ${
                      isCompleted ? "bg-emerald-500" : "bg-transparent"
                    }`}
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  ></div>
                </div>
              )}

              {/* Circle Indicator */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-500 z-10 border-2
                  ${
                    isCompleted
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_10px_20px_rgba(16,185,129,0.2)]"
                      : isActive
                      ? "bg-primary-600 border-primary-600 text-white shadow-[0_10px_20px_rgba(202,138,4,0.2)] scale-110"
                      : "bg-white border-gray-200 text-gray-400 group-hover:border-primary-400 group-hover:text-primary-600"
                  }
                `}
              >
                {isCompleted ? (
                  <Check size={20} weight="bold" className="animate-in fade-in zoom-in duration-500" />
                ) : (
                  <span className="font-display">{index + 1}</span>
                )}
              </div>

              {/* Step Title Label */}
              <div className={`mt-4 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300
                ${isActive ? "text-primary-600" : isCompleted ? "text-emerald-600" : "text-gray-400"}
              `}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Form>
        <div>{steps[currentStep].content}</div>
      </Form>

      {/* Navigation Controls - Premium Redesign */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-16 pt-8 border-t border-gray-100">
        <div className="flex items-center gap-4 w-full sm:w-auto">
            {!isFirst ? (
            <button
                type="button"
                onClick={() => setCurrentStep((s) => s - 1)}
                className="w-full sm:w-auto bg-gray-50 text-gray-500 hover:bg-gray-100 font-bold font-jakarta px-8 py-3 rounded-xl transition-all duration-300 active:scale-95 border border-gray-100"
            >
                Previous Step
            </button>
            ) : (
            <button
                type="button"
                onClick={async () => await handleClose()}
                className="w-full sm:w-auto bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-500 font-bold font-jakarta px-8 py-3 rounded-xl transition-all duration-300 active:scale-95 border border-gray-100"
            >
                Discard & Exit
            </button>
            )}
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
            {!isFirst && (
                <button
                    type="button"
                    onClick={async () => await handleClose()}
                    className="hidden sm:block text-gray-400 hover:text-gray-600 font-bold font-jakarta px-6 py-2 transition-colors duration-300"
                >
                    Cancel
                </button>
            )}
            
            {!isLast ? (
                <button
                    type="button"
                    onClick={() => {
                        handleNext(
                        currentStep,
                        helpers?.validateForm,
                        helpers?.errors,
                        helpers?.touched,
                        helpers?.setTouched
                        );
                    }}
                    className="w-full sm:w-auto bg-primary-600 text-white px-10 py-3.5 rounded-xl font-bold font-jakarta hover:bg-primary-700 transition-all duration-300 shadow-lg shadow-primary-600/20 active:scale-95 flex items-center justify-center gap-2 group"
                >
                    <span>Continue</span>
                    <ArrowSquareOut size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                </button>
            ) : (
                <button
                    type="submit"
                    onClick={() => {
                        helpers?.submitForm();
                    }}
                    className="w-full sm:w-auto bg-emerald-600 text-white px-10 py-3.5 rounded-xl font-bold font-jakarta hover:bg-emerald-700 transition-all duration-300 shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2"
                >
                    <span>Finalize Listing</span>
                    <Check size={18} weight="bold" />
                </button>
            )}
        </div>
      </div>
    </div>
  );
}
