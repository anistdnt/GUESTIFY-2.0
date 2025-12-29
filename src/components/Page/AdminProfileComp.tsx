"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useFormik } from "formik";
import { ProfileValidationSchema } from "@/validations/profilebody";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { setLoading } from "@/redux/slices/loaderSlice";
import toast from "react-hot-toast";
import { setUserData } from "@/redux/slices/userSlice";
import { getCookie, setCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { setModalVisibility } from "@/redux/slices/modalSlice";
import {
  FloppyDisk,
  Pencil,
  Trash,
  XCircle,
} from "@phosphor-icons/react/dist/ssr";
import Select from "react-select";

const districtOptions = [
  { value: "india", label: "India" },
  { value: "usa", label: "USA" },
  { value: "hoogly", label: "Hoogly" },
];

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const languageOptions = [
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi" },
  { value: "bengali", label: "Bengali" },
];

const AdminProfileComponent = () => {
  const reduxUserData = useSelector(
    (state: RootState) => state.user_slice.userData
  );

  // console.log(reduxUserData);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(reduxUserData?.image_url);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);

      formik.setFieldValue("image_url", file);
    }
  };

  const formatDate = (isodate: string) => {
    const currentDate = new Date(isodate);
    const date = currentDate.toLocaleDateString("en-GB", {
      weekday: "short", // 'Tue'
      day: "2-digit", // '07'
      month: "long", // 'June'
      year: "numeric", // '2022'
    });

    const [weekday, day, month, year] = date.split(" ");
    const formattedDate = `${weekday}, ${day} ${month} ${year}`;

    return formattedDate;
  };

  const formik = useFormik({
    initialValues: {
      first_name: reduxUserData?.first_name ?? "",
      last_name: reduxUserData?.last_name ?? "",
      email: reduxUserData?.email || "",
      gender: reduxUserData?.gender ?? "",
      district: reduxUserData?.district ?? "",
      mother_tongue: reduxUserData?.mother_tongue ?? "",
      image_url: reduxUserData?.image_url ?? null,
      address: reduxUserData?.address ?? "",
      pincode: reduxUserData?.pincode ?? "",
    },
    validationSchema: ProfileValidationSchema.validation,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!isEditing) {
        setIsEditing(true);
      } else {
        // console.log("Form submitted", values);
        const formData = new FormData();

        formData.append("first_name", formik.values.first_name);
        formData.append("last_name", formik.values.last_name);
        formData.append("email", formik.values.email);
        formData.append("gender", formik.values.gender);
        formData.append("district", formik.values.district);
        formData.append("mother_tongue", formik.values.mother_tongue);
        formData.append("address", formik.values.address);
        formData.append("pincode", formik.values.pincode as string);

        // append image file if exists
        if (formik.values.image_url) {
          formData.append("image_url", formik.values.image_url);
        }

        dispatch(setLoading({ loading: true }));
        const res: ApiReturn<any> = await api_caller<any>(
          "PUT",
          API.USER.UPDATE,
          formData
        );
        if (res.success) {
          dispatch(setUserData(res?.data?.info));
          setCookie("authToken", res.data?.updated_token, {
            maxAge: 2 * 60 * 60, //2 hours
          });
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay
          dispatch(setLoading({ loading: false }));
          router.back();
          toast.success(res.message || "Loggged In successfully");
        } else {
          dispatch(setLoading({ loading: false }));
          toast.error(`${res.message} : ${res.error}`);
        }

        setIsEditing(false);
      }
    },
  });

  useEffect(() => {
    setImage(reduxUserData?.image_url);
  }, [reduxUserData]);

  if (!reduxUserData || Object.keys(reduxUserData).length === 0) {
    <PageSkeleton />;
  } else {
    return (
      <div className="flex flex-col gap-8 p-6">
        <div>
          <h1 className=" text-xl sm:text-3xl font-semibold text-gray-800">
            <span className="text-gray-700 text-xl">Welcome</span>, <span className="text-yellow-700">{reduxUserData?.first_name} {reduxUserData?.last_name}</span>
          </h1>
          <p className="text-gray-500 mt-1 max-sm:text-sm">
            Created At : {formatDate(reduxUserData?.createdAt as string)}
          </p>
        </div>
        <div className="rounded-2xl shadow-[0_0_10px_0_rgba(0,0,0,0.12)] bg-white p-6">
          <form className="flex flex-col" onSubmit={formik.handleSubmit}>
            {/* up Section */}
            <div className="w-full flex flex-row justify-between mb-10">
              <div>
                <div className="relative w-28 h-28 mb-4">
                  <Image
                    src={image || "/assets/profile.png"}
                    alt="Profile Image"
                    className="rounded-full"
                    fill
                    objectFit="cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                    className={
                      isEditing
                        ? "absolute h-9 w-9 bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                        : "hidden"
                    }
                  >
                    <i className="fas fa-pencil-alt  text-gray-700"></i>
                  </button>
                  {/* delete button will be implemented with api */}

                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {reduxUserData?.first_name} {reduxUserData?.last_name}
                </h2>
                <p className="text-gray-600">{reduxUserData?.email}</p>
              </div>
              <div>
                {isEditing ? (
                  <div className="flex flex-row justify-center items-center gap-5">
                    <button
                      className="mt-6 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center justify-center gap-2"
                      type="submit"
                    >
                      <FloppyDisk size={25} color="#ffffff" weight="fill" />
                      <span>Save</span>
                    </button>
                    <button
                      className="mt-6 px-3 py-2 bg-black/70 text-white rounded-lg hover:bg-black/80 flex justify-center items-center gap-2"
                      onClick={() => {
                        formik.resetForm();
                        setIsEditing(false);
                      }}
                    >
                      <XCircle size={25} color="#ffffff" weight="fill" />
                      <span>Cancel</span>
                    </button>
                  </div>
                ) : (
                  <button
                    className="flex items-center justify-center gap-2 mt-6 px-3 py-2 bg-black/70 text-white rounded-lg hover:bg-black/80"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil size={25} color="#ffffff" weight="fill" />
                    <span>Edit</span>
                  </button>
                )}
              </div>
            </div>

            {/* down Section */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-700 font-medium required">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  name="first_name"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  className={`w-full mt-2 p-3 border ${
                    formik.touched.first_name && formik.errors.first_name
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600`}
                  readOnly={!isEditing}
                />
                {formik.touched.first_name && formik.errors.first_name ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.first_name}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="block text-gray-700 font-medium required">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  name="last_name"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  className={`w-full mt-2 p-3 border ${
                    formik.touched.last_name && formik.errors.last_name
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600`}
                  readOnly={!isEditing}
                />
                {formik.touched.last_name && formik.errors.last_name ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.last_name}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="block text-gray-700 font-medium required">Email</label>
                <input
                  type="email"
                  placeholder="Your Email Address"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  className={`w-full mt-2 p-3 border ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600`}
                  disabled={true}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.email}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="block text-gray-700 font-medium required">
                  Gender
                </label>
                <Select
                  className="mt-2"
                  isDisabled={!isEditing}
                  name="gender"
                  options={genderOptions}
                  value={
                    genderOptions.find(
                      (option) => option.value === formik.values.gender
                    ) || null
                  }
                  onChange={(option) =>
                    formik.setFieldValue("gender", option?.value)
                  }
                  onBlur={() => formik.setFieldTouched("gender", true)}
                  placeholder="Select Gender"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderRadius: "0.5rem", // rounded-lg
                      padding: "6px",
                      borderColor:
                        formik.touched.gender && formik.errors.gender
                          ? "#ef4444" // Tailwind red-500
                          : "#d1d5db", // Tailwind gray-300
                      boxShadow: state.isFocused ? "0 0 0 2px #4b5563" : "none", // Tailwind gray-600 focus ring
                      "&:hover": {
                        borderColor:
                          formik.touched.gender && formik.errors.gender
                            ? "#ef4444"
                            : "#9ca3af", // Tailwind gray-400
                      },
                    }),
                  }}
                />
                {formik.touched.gender && formik.errors.gender ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.gender}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="block text-gray-700 font-medium required">
                  Country
                </label>
                <Select
                  className="mt-2 w-full"
                  isDisabled={!isEditing}
                  name="district"
                  options={districtOptions}
                  value={
                    districtOptions.find(
                      (option) => option.value === formik.values.district
                    ) || null
                  }
                  onChange={(option) =>
                    formik.setFieldValue("district", option?.value)
                  }
                  onBlur={() => formik.setFieldTouched("district", true)}
                  placeholder="Select Country"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderRadius: "0.5rem", // rounded-lg
                      padding: "6px",
                      borderColor:
                        formik.touched.district && formik.errors.district
                          ? "#ef4444" // red-500
                          : "#d1d5db", // gray-300
                      boxShadow: state.isFocused ? "0 0 0 2px #4b5563" : "none", // focus:ring-gray-600
                      "&:hover": {
                        borderColor:
                          formik.touched.district && formik.errors.district
                            ? "#ef4444"
                            : "#9ca3af", // gray-400
                      },
                    }),
                  }}
                />
                {formik.touched.district && formik.errors.district ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.district}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="block text-gray-700 font-medium required">
                  Language
                </label>
                <Select
                  className="mt-2 w-full"
                  isDisabled={!isEditing}
                  name="mother_tongue"
                  options={languageOptions}
                  value={
                    languageOptions.find(
                      (option) => option.value === formik.values.mother_tongue
                    ) || null
                  }
                  onChange={(option) =>
                    formik.setFieldValue("mother_tongue", option?.value)
                  }
                  onBlur={() => formik.setFieldTouched("mother_tongue", true)}
                  placeholder="Select Language"
                  isSearchable // 🔎 makes it searchable
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderRadius: "0.5rem", // rounded-lg
                      padding: "6px",
                      borderColor:
                        formik.touched.mother_tongue &&
                        formik.errors.mother_tongue
                          ? "#ef4444" // red-500
                          : "#d1d5db", // gray-300
                      boxShadow: state.isFocused ? "0 0 0 2px #4b5563" : "none", // focus:ring-gray-600
                      "&:hover": {
                        borderColor:
                          formik.touched.mother_tongue &&
                          formik.errors.mother_tongue
                            ? "#ef4444"
                            : "#9ca3af", // gray-400
                      },
                    }),
                  }}
                />
                {formik.touched.mother_tongue && formik.errors.mother_tongue ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.mother_tongue}
                  </div>
                ) : null}
              </div>

              {/* <div>
              <label className="block text-gray-700 font-medium">
                Time Zone
              </label>
              <select
                className={`w-full mt-2 p-3 border ${
                  formik.touched.timezone && formik.errors.timezone
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600`}
                disabled={!isEditing}
                name="timezone"
                value={formik.values.timezone}
                onChange={formik.handleChange}
              >
                <option value="">Select Time Zone</option>
                <option value="gmt">GMT</option>
                <option value="pst">PST</option>
              </select>
              {formik.touched.timezone && formik.errors.timezone ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.timezone}
                </div>
              ) : null}
            </div> */}

              <div>
                <label className="block text-gray-700 font-medium required">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Your Full Address"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  className={`w-full mt-2 p-3 border ${
                    formik.touched.address && formik.errors.address
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600`}
                  readOnly={!isEditing}
                />
                {formik.touched.address && formik.errors.address ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.address}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="block text-gray-700 font-medium required">
                  Pincode
                </label>
                <input
                  type="text"
                  placeholder="Your Pincode"
                  name="pincode"
                  value={formik.values.pincode}
                  onChange={formik.handleChange}
                  className={`w-full mt-2 p-3 border ${
                    formik.touched.pincode && formik.errors.pincode
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600`}
                  readOnly={!isEditing}
                />
                {formik.touched.address && formik.errors.pincode ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.pincode}
                  </div>
                ) : null}
              </div>
            </div>
          </form>
          <div className="flex items-center gap-5 mt-8">
            <button
              className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              onClick={() => {
                toast.success("You are redirecting to the Reset Password Page");
                setTimeout(() => {
                  window?.open(
                    `/reset-password/${getCookie("authToken")}`,
                    "_blank"
                  );
                }, 2000);
              }}
            >
              Change Password
            </button>
            <button
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              onClick={() => {
                dispatch(setModalVisibility({ open: true, type: "delete" }));
              }}
            >
              <Trash size={20} />
              <p>Delete Account</p>
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default AdminProfileComponent;

// skeleton loader

const PageSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Top Section */}
      <div className="flex flex-row justify-between mb-10">
        <div>
          <div className="relative w-28 h-28 mb-4">
            <div className="rounded-full bg-gray-300 w-full h-full" />
          </div>
          <div className="h-6 w-48 bg-gray-300 rounded mb-2" />
          <div className="h-4 w-60 bg-gray-300 rounded" />
        </div>
        <div className="w-[93px] h-[44px] bg-gray-300 rounded-lg" />
      </div>

      {/* Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="h-4 w-32 bg-gray-300 rounded mb-2" />
            <div className="h-12 bg-gray-300 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Email Section */}
      <div className="mt-10">
        <div className="h-5 w-48 bg-gray-300 rounded mb-4" />
        <div className="flex items-center p-4 bg-gray-100 rounded-lg">
          <div className="w-10 h-10 bg-gray-300 rounded-full mr-4" />
          <div>
            <div className="h-4 w-40 bg-gray-300 rounded mb-1" />
            <div className="h-3 w-24 bg-gray-300 rounded" />
          </div>
        </div>
        <div className="mt-6 w-48 h-10 bg-gray-300 rounded-lg" />
      </div>
    </div>
  );
};
