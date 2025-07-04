"use client";
import { Formik } from "formik";
import PGForm from "@/components/Forms/PGForm";
import Stepper from "@/components/Forms/Stepper";
import RoomForm from "@/components/Forms/RoomForm";
import { PGValidationSchema } from "@/validations/pg";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/slices/loaderSlice";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import toast from "react-hot-toast";
import { API } from "@/lib/api_const";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";

export default function PGFormWrapper() {
  const reduxUserData = useSelector(
    (state: RootState) => state.user_slice.userData
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    const formData = new FormData();

    // ✅ Add top-level fields
    Object.entries(values).forEach(([key, value]) => {
      if (key === "rooms") return; // skip for now

      if (key === "pg_image_url" && value) {
        formData.append("pg_image_url", value as File);
      } else if (key !== "pg_image_url") {
        formData.append(key, value as string ?? "");
      }
    });

    // ✅ Add rooms array with their files
    values.rooms.forEach((room:any, index:number) => {
      Object.entries(room).forEach(([key, value]) => {
        if (key === "room_image_url" && value) {
          formData.append(`rooms[${index}][${key}]`, value as File);
        } else if (key !== "room_image_url") {
          formData.append(`rooms[${index}][${key}]`, value as string ?? "");
        }
      });
    });

    console.log("Submitted values Formadata:", values);
    dispatch(setLoading({ loading: true }));

    const res: ApiReturn<any> = await api_caller<any>(
      "POST",
      API.PG.ADD,
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
              validateForm: validateForm,
              errors: errors,
              touched: touched,
              setTouched: setTouched,
              submitForm: submitForm,
            }}
          />
        )}
      </Formik>
    </div>
  );
}
