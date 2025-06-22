"use client";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { Form } from "formik";
import { ReactNode, useEffect, useState } from "react";

type StepperProps = {
  steps: { label: string; content: ReactNode }[];
  helpers?: any;
};

const stepFields = [
  [
    "pg_name",
    "street_name",
    "house_no",
    "state",
    "rent",
    "deposit_duration",
    "country",
    "wifi",
    "ac",
    "food",
    "rules",
  ],
  ["rooms"], // You can refine this to ["rooms[0].room_type", ...] if needed
];

export default function Stepper({ steps, helpers }: StepperProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const isLast = currentStep === steps.length - 1;
  const isFirst = currentStep === 0;

  const handleNext = async (
    index: number,
    validateForm: any,
    errors: any,
    touched: any,
    setTouched: any
  ) => {
    const fieldsToValidate = stepFields[index];

    // Mark all fields in this step as touched
    const touchedMap: any = {};
    fieldsToValidate.forEach((f) => {
      touchedMap[f] = true;
    });
    setTouched({ ...touched, ...touchedMap });

    const allErrors = await validateForm();

    const hasErrors = fieldsToValidate.some((field) => !!allErrors[field]);

    if (!hasErrors) {
      setCurrentStep((s) => s + 1);
    }
  };

  useEffect(() => {
    window?.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  return (
    <div className="w-full bg-white shadow-md p-8 rounded-xl">
      {/* Step Indicator */}
      <div className="flex justify-between items-center relative mb-10">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center relative"
            >
              {/* Circle */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 z-10
                  ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isActive
                      ? "bg-yellow-600 text-white"
                      : "bg-gray-300 text-gray-700"
                  }
                `}
              >
                {isCompleted ? (
                  <Check size={20} weight="bold" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Label */}
              <div className="mt-2 text-base font-medium text-center text-gray-700">
                {step.label}
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute top-6 right-[-50%] w-full h-1 bg-gray-300 z-[-1]">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isCompleted ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Form>
        <div>{steps[currentStep].content}</div>
      </Form>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        {!isFirst && (
          <button
            type="button"
            onClick={() => setCurrentStep((s) => s - 1)}
            className="bg-gray-300 px-5 py-2 rounded hover:bg-gray-400 transition"
          >
            Back
          </button>
        )}

        {!isLast ? (
          <button
            type="button"
            onClick={() => {
              handleNext(
                0,
                helpers?.validateForm,
                helpers?.errors,
                helpers?.touched,
                helpers?.setTouched
              );
              //   setCurrentStep((s) => s + 1);
            }}
            className="ml-auto bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 transition"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            onClick={()=>{
                helpers?.submitForm();
            }}
            className="ml-auto bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
