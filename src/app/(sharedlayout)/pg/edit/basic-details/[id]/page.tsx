"use client";
import PGForm from "@/components/Forms/PGForm";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { Only_PGValidationSchema } from "@/validations/onlypg";
import { Form, Formik } from "formik";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function BasicDetailsEdit() {
  const params = useParams();
  const paying_guestID = params?.id;
  const [initialFieldData, setInitialFieldData] = useState(
    Only_PGValidationSchema?.initials
  );

  useEffect(() => {
    const fetchInformation = async () => {
      const res: ApiReturn<any> = await api_caller<any>(
        "GET",
        `${API.PG.GET_PG_BY_ID}/${paying_guestID}`
      );
      if (res.success) {
        setInitialFieldData(res?.data?.pginfo);
      } else {
        toast.error(`${res.message} : ${res.error}`);
      }
    };
    fetchInformation();
  }, []);

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg mb-8">
      <Formik
        initialValues={initialFieldData}
        validationSchema={Only_PGValidationSchema?.validation}
        enableReinitialize={true}
        onSubmit={() => {}}
      >
        {({ submitForm, dirty }) => (
          <Form>
            <PGForm
              caption="Update Basic Details"
              disabledField={["pg_name"]}
            />
            <button
              type="submit"
              onClick={() => {
                submitForm();
              }}
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
