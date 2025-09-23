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
import { base64ToFile } from "@/lib/imageConvert";
import ContactDetails from "@/components/Forms/ContactDetails";
import HeaderSection from "@/components/Forms/FormHeaderSections/HeaderSection";

export default function PGFormWrapper() {
  const reduxUserData = useSelector(
    (state: RootState) => state.user_slice.userData
  );
  const reduxAuthVerification = useSelector(
    (state: RootState) => state.auth_verification_slice
  );
  const dispatch = useDispatch();
  const router = useRouter();

  // const handleSubmit = async (values: any) => {
  //   const formData = new FormData();

  //   delete values.contact_details.is_phone_verified;
  //   delete values.contact_details.is_email_verified;

  //   // Add top-level fields
  //   Object.entries(values).forEach(([key, value]) => {
  //     if (key === "rooms") return; // skip for now

  //     // Special handling for contact_details
  //     if (
  //       key === "contact_details" &&
  //       typeof value === "object" &&
  //       value !== null
  //     ) {
  //       Object.entries(value).forEach(([subKey, subValue]) => {
  //         formData.append(
  //           `contact_details[${subKey}]`,
  //           (subValue as string) ?? ""
  //         );
  //       });
  //       formData.append(
  //         "contact_details[is_phone_verified]",
  //         reduxAuthVerification?.isPhoneVerified ? "true" : "false"
  //       );
  //       formData.append(
  //         "contact_details[is_email_verified]",
  //         reduxAuthVerification?.isEmailVerified ? "true" : "false"
  //       );
  //       formData.append(
  //         "contact_details[image_url]",
  //         reduxUserData?.image_url || ""
  //       );
  //       formData.append(
  //         "contact_details[owner_name]",
  //         `${reduxUserData?.first_name} ${reduxUserData?.last_name}` || ""
  //       );
  //       return;
  //     }

  //     if (key === "pg_image_url" && value) {
  //       if (typeof value === "string" && value.startsWith("data:image/")) {
  //         const file = base64ToFile(value, `PG-Image-${Date.now()}`);
  //         formData.append("pg_image_url", file);
  //       } else {
  //         formData.append("pg_image_url", value as File);
  //       }
  //     } else if (key !== "pg_image_url") {
  //       formData.append(key, (value as string) ?? "");
  //     }
  //   });

  //   // Add rooms array with their files
  //   values.rooms.forEach((room: any, index: number) => {
  //     Object.entries(room).forEach(([key, value]) => {
  //       if (key === "room_image_url" && value) {
  //         if (typeof value === "string" && value.startsWith("data:image/")) {
  //           const file = base64ToFile(value, `Room-Image-${Date.now()}`);
  //           formData.append(`rooms[${index}][${key}]`, file);
  //         } else {
  //           formData.append(`rooms[${index}][${key}]`, value as File);
  //         }
  //       } else if (key !== "room_image_url") {
  //         formData.append(`rooms[${index}][${key}]`, (value as string) ?? "");
  //       }
  //     });
  //   });

  //   console.log("Submitted values Formadata:", values);
  //   dispatch(setLoading({ loading: true }));

  //   const res: ApiReturn<any> = await api_caller<any>(
  //     "POST",
  //     API.PG.ADD,
  //     formData
  //   );
  //   if (res.success) {
  //     dispatch(setLoading({ loading: false }));
  //     router?.push(`/profile/${reduxUserData?._id}/mypg`);
  //     toast.success(res.message || "Save In successfully");
  //   } else {
  //     dispatch(setLoading({ loading: false }));
  //     toast.error(`${res.message} : ${res.error}`);
  //   }

  //   // alert("Form submitted successfully!");
  // };

  const handleSubmit = async (values: any) => {
    // clone values to avoid mutating the form state directly
    const payload: any = { ...values };

    // Remove unwanted fields from contact_details
    if (payload.contact_details) {
      delete payload.contact_details.is_phone_verified;
      delete payload.contact_details.is_email_verified;

      // Override with redux values
      payload.contact_details.is_phone_verified =
        reduxAuthVerification?.isPhoneVerified ?? false;
      payload.contact_details.is_email_verified =
        reduxAuthVerification?.isEmailVerified ?? false;
      payload.contact_details.image_url = reduxUserData?.image_url || "";
      payload.contact_details.owner_name =
        `${reduxUserData?.first_name} ${reduxUserData?.last_name}`.trim() || "";
    }

    payload.pg_images = values.pg_images;

    // Ensure rooms array is in correct format
    payload.rooms = Array.isArray(values.rooms)
      ? values.rooms.map((room: any) => ({
        ...room,
        room_images: room.room_images,
      })) : [];

    console.log("Submitted values JSON:", payload);
    dispatch(setLoading({ loading: true }));

    const res: ApiReturn<any> = await api_caller<any>(
      "POST",
      API.PG.ADD,
      payload // send JSON instead of FormData
    );

    if (res.success) {
      dispatch(setLoading({ loading: false }));
      router?.push(`/profile/${reduxUserData?._id}/mypg`);
      toast.success(res.message || "Saved successfully");
    } else {
      dispatch(setLoading({ loading: false }));
      toast.error(`${res.message} : ${res.error}`);
    }
  };


  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg mb-8">
      <HeaderSection />
      <hr className="my-4 border-gray-200" />
      <Formik
        initialValues={PGValidationSchema?.initials}
        validationSchema={PGValidationSchema?.validation}
        onSubmit={handleSubmit}
      >
        {({ validateForm, errors, touched, setTouched, submitForm, values }) => (
          <Stepper
            steps={[
              { label: "Contact Details", content: <ContactDetails /> },
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
