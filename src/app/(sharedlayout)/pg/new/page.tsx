"use client";
import { Formik } from "formik";
import PGForm from "@/components/Forms/PGForm";
import Stepper from "@/components/Forms/Stepper";
import RoomForm from "@/components/Forms/RoomForm";
import { PGValidationSchema } from "@/validations/pg";

export default function PGFormWrapper() {
  const handleSubmit = (values: any) => {
    console.log("Submitted values:", values);
    alert("Form submitted successfully!");
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg mb-8">
      <Formik
        initialValues={PGValidationSchema?.initials}
        validationSchema={PGValidationSchema?.validation}
        onSubmit={handleSubmit}
      >
        {({ validateForm, errors, touched, setTouched, submitForm }) => (
            <Stepper
              steps={[
                { label: "Basic Paying Guest Details", content: <PGForm /> },
                { label: "Room Details", content: <RoomForm /> },
              ]}
              helpers={{
                validateForm:validateForm,
                errors:errors,
                touched:touched,
                setTouched:setTouched,
                submitForm:submitForm
              }}
            />
        )}
      </Formik>
    </div>
  );
}
