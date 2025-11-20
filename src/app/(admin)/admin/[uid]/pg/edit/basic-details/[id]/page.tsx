"use client";
import PGForm from "@/components/Forms/PGForm";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { base64ToFile } from "@/lib/imageConvert";
import { setLoading } from "@/redux/slices/loaderSlice";
import { RootState } from "@/redux/store";
import { Only_PGValidationSchema } from "@/validations/onlypg";
import { Form, Formik } from "formik";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function BasicDetailsEdit() {
  const params = useParams();
  const paying_guestID = params?.id;
  const [initialFieldData, setInitialFieldData] = useState(
    Only_PGValidationSchema?.initials
  );
  const reduxUserData = useSelector(
    (state: RootState) => state.user_slice.userData
  );
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchInformation = async () => {
      const res: ApiReturn<any> = await api_caller<any>(
        "GET",
        `${API.PG.GET_PG_BY_ID}/${paying_guestID}/basic-details`
      );
      if (res.success) {
        setInitialFieldData(res?.data);
      } else {
        toast.error(`${res.message} : ${res.error}`);
      }
    };
    fetchInformation();
  }, []);


  const handleSubmit = async (values: any) => {
    const payload = {
      ...values,
    };

    dispatch(setLoading({ loading: true }));

    const res: ApiReturn<any> = await api_caller<any>(
      "PUT",
      `${API.PG.UPDATE}/${paying_guestID}/basic-details`,
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
      <Formik
        initialValues={initialFieldData}
        validationSchema={Only_PGValidationSchema?.validation}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {({ dirty, errors, values }) => {
          async function handleClose() {
            router.back();
            try {
              const prevImageIds:string[] = initialFieldData?.pg_images?.map((img: any) => img?.pg_image_id) || [];
              const publicIdsForPgImages = values.pg_images.filter((image: any) => image?.pg_image_id !== "" && !prevImageIds.includes(image.pg_image_id)).map((image: any) => image?.pg_image_id);
              const payload = {
                public_ids: publicIdsForPgImages,
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
          return (
          <Form>
            <PGForm
              caption="Update Basic Details"
              disabledField={["pg_name"]}
            />
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={!dirty} // ✅ disables if nothing changed
                className={`px-6 py-2 rounded transition ${dirty
                  ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                  : "bg-gray-400 cursor-not-allowed text-white"
                  }`}
              >
                Update Details
              </button>
              <button
                type="button"
                onClick={async () => {
                  await handleClose()
                }}
                className="bg-slate-200 text-gray-800 hover:bg-slate-400 px-6 py-2 rounded transition"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
        }
      </Formik>
    </div>
  );
}
