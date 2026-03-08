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

const Page = () => {
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
          dispatch(setLoading({ loading: false }));
          router.push("/");
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
    return <PageSkeleton />;
  } else {
    return (
      <div className="space-y-12">
        <form className="space-y-10" onSubmit={formik.handleSubmit}>
          {/* Section: Profile Image & Header Action */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-gray-50/30 p-8 rounded-[2.5rem] border border-gray-100">
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="relative group">
                <div className="relative w-32 h-32 ring-8 ring-white rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 bg-white">
                  <Image
                    src={image || "/assets/profile.png"}
                    alt="Profile Image"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       <button
                        type="button"
                        onClick={() => document.getElementById("fileInput")?.click()}
                        className="p-3 bg-white rounded-2xl shadow-xl hover:scale-110 transition-transform text-primary-600"
                      >
                        <Pencil size={24} weight="fill" />
                      </button>
                    </div>
                  )}
                </div>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-normal text-gray-900 font-display tracking-tight">
                  {reduxUserData?.first_name} {reduxUserData?.last_name}
                </h3>
                <p className="text-sm text-gray-400 font-jakarta">{reduxUserData?.email}</p>
                <div className="pt-2">
                  <span className="inline-flex items-center px-3 py-1 bg-primary-50 text-primary-600 text-[10px] font-bold tracking-widest uppercase rounded-full border border-primary-100">
                    Verified Account
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto">
              {isEditing ? (
                <div className="flex items-center gap-3">
                  <button
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-2xl font-bold text-xs tracking-widest uppercase shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all duration-300"
                    type="submit"
                  >
                    <FloppyDisk size={18} weight="bold" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-400 rounded-2xl font-bold text-xs tracking-widest uppercase border border-gray-200 hover:bg-gray-50 transition-all duration-300"
                    onClick={() => {
                      formik.resetForm();
                      setIsEditing(false);
                    }}
                  >
                    <XCircle size={18} weight="bold" />
                    <span>Cancel</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold text-xs tracking-widest uppercase shadow-xl hover:bg-black transition-all duration-300"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil size={18} weight="bold" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Section: Personal & Contact Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-2">
              <h4 className="text-xl font-normal font-display text-gray-900 tracking-tight">Personal <span className="italic-serif text-primary-600">Details</span></h4>
              <p className="text-sm text-gray-400 leading-relaxed font-jakarta">Update your basic information to help us personalize your experience.</p>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase px-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  className={`w-full px-5 py-3.5 bg-gray-50/50 border rounded-2xl font-jakarta text-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                    formik.touched.first_name && formik.errors.first_name
                      ? "border-red-200 focus:ring-red-50"
                      : "border-gray-100 focus:ring-primary-50 focus:border-primary-100"
                  } ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                  readOnly={!isEditing}
                />
                {formik.touched.first_name && formik.errors.first_name && (
                  <p className="text-[10px] text-red-500 font-bold px-1 uppercase tracking-tight">{formik.errors.first_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase px-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  className={`w-full px-5 py-3.5 bg-gray-50/50 border rounded-2xl font-jakarta text-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                    formik.touched.last_name && formik.errors.last_name
                      ? "border-red-200 focus:ring-red-50"
                      : "border-gray-100 focus:ring-primary-50 focus:border-primary-100"
                  } ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                  readOnly={!isEditing}
                />
                {formik.touched.last_name && formik.errors.last_name && (
                  <p className="text-[10px] text-red-500 font-bold px-1 uppercase tracking-tight">{formik.errors.last_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase px-1">Email Address</label>
                <input
                  type="email"
                  value={formik.values.email}
                  className="w-full px-5 py-3.5 bg-gray-100/50 border border-gray-100 rounded-2xl font-jakarta text-sm text-gray-400 cursor-not-allowed"
                  disabled={true}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase px-1">Gender</label>
                <Select
                  isDisabled={!isEditing}
                  name="gender"
                  options={genderOptions}
                  value={genderOptions.find(o => o.value === formik.values.gender)}
                  onChange={(opt) => formik.setFieldValue("gender", opt?.value)}
                  placeholder="Select Gender"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderRadius: "1rem",
                      padding: "8px",
                      background: state.isDisabled ? "rgba(243, 244, 246, 0.5)" : "rgba(249, 250, 251, 0.5)",
                      borderColor: formik.touched.gender && formik.errors.gender ? "#fecaca" : "#f3f4f6",
                      boxShadow: state.isFocused ? "0 0 0 4px rgba(217, 144, 0, 0.05)" : "none",
                      borderWidth: "1px",
                      "&:hover": { borderColor: "#e5e7eb" }
                    }),
                    placeholder: (base) => ({ ...base, color: "#9ca3af", fontSize: "0.875rem" }),
                    singleValue: (base) => ({ ...base, color: "#111827", fontSize: "0.875rem" })
                  }}
                />
                {formik.touched.gender && formik.errors.gender && (
                  <p className="text-[10px] text-red-500 font-bold px-1 uppercase tracking-tight">{formik.errors.gender}</p>
                )}
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Section: Localization & Address */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-2">
              <h4 className="text-xl font-normal font-display text-gray-900 tracking-tight">Address & <span className="italic-serif text-primary-600">Region</span></h4>
              <p className="text-sm text-gray-400 leading-relaxed font-jakarta">Providing your location helps us show you more relevant PG options and local events.</p>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase px-1">Country / District</label>
                <Select
                  isDisabled={!isEditing}
                  options={districtOptions}
                  value={districtOptions.find(o => o.value === formik.values.district)}
                  onChange={(opt) => formik.setFieldValue("district", opt?.value)}
                  placeholder="Select Region"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderRadius: "1rem",
                      padding: "8px",
                      background: state.isDisabled ? "rgba(243, 244, 246, 0.5)" : "rgba(249, 250, 251, 0.5)",
                      borderColor: "#f3f4f6",
                      boxShadow: state.isFocused ? "0 0 0 4px rgba(217, 144, 0, 0.05)" : "none",
                      "&:hover": { borderColor: "#e5e7eb" }
                    }),
                    placeholder: (base) => ({ ...base, fontSize: "0.875rem" }),
                    singleValue: (base) => ({ ...base, fontSize: "0.875rem" })
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase px-1">Primary Language</label>
                <Select
                  isDisabled={!isEditing}
                  options={languageOptions}
                  value={languageOptions.find(o => o.value === formik.values.mother_tongue)}
                  onChange={(opt) => formik.setFieldValue("mother_tongue", opt?.value)}
                  placeholder="Select Language"
                  isSearchable
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderRadius: "1rem",
                      padding: "8px",
                      background: state.isDisabled ? "rgba(243, 244, 246, 0.5)" : "rgba(249, 250, 251, 0.5)",
                      borderColor: "#f3f4f6",
                      boxShadow: state.isFocused ? "0 0 0 4px rgba(217, 144, 0, 0.05)" : "none",
                      "&:hover": { borderColor: "#e5e7eb" }
                    }),
                    placeholder: (base) => ({ ...base, fontSize: "0.875rem" }),
                    singleValue: (base) => ({ ...base, fontSize: "0.875rem" })
                  }}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase px-1">Residential Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Street, Landmark, City"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  className={`w-full px-5 py-3.5 bg-gray-50/50 border rounded-2xl font-jakarta text-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                    formik.touched.address && formik.errors.address
                      ? "border-red-200 focus:ring-red-50"
                      : "border-gray-100 focus:ring-primary-50 focus:border-primary-100"
                  } ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                  readOnly={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase px-1">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formik.values.pincode}
                  onChange={formik.handleChange}
                  className={`w-full px-5 py-3.5 bg-gray-50/50 border rounded-2xl font-jakarta text-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                    formik.touched.pincode && formik.errors.pincode
                      ? "border-red-200 focus:ring-red-50"
                      : "border-gray-100 focus:ring-primary-50 focus:border-primary-100"
                  } ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                  readOnly={!isEditing}
                />
              </div>
            </div>
          </div>
        </form>

        <div className="h-px bg-gray-100 w-full" />

        {/* Section: Account Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-6 px-10 bg-gray-50 rounded-[2.5rem] border border-gray-100">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-bold font-display text-gray-900">Security & <span className="italic-serif text-red-600">Privacy</span></h4>
            <p className="text-xs text-gray-400 font-jakarta">Manage your password and account status.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              className="px-6 py-2.5 bg-white text-gray-700 text-[10px] font-bold tracking-widest uppercase rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-sm"
              onClick={() => {
                toast.success("Redirecting to Reset Password");
                setTimeout(() => {
                  window?.open(`/reset-password/${getCookie("authToken")}`, "_blank");
                }, 1000);
              }}
            >
              Update Password
            </button>
            <button
              className="px-6 py-2.5 bg-red-50 text-red-600 text-[10px] font-bold tracking-widest uppercase rounded-xl border border-red-100 hover:bg-red-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center gap-2"
              disabled={true}
              onClick={() => {
                dispatch(setModalVisibility({ open: true, type: "delete" }));
              }}
            >
              <Trash size={16} weight="bold" />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default Page;

// skeleton loader

const PageSkeleton = () => {
  return (
    <div className="space-y-12 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 bg-gray-200 rounded-[2rem]"></div>
          <div className="space-y-3">
            <div className="h-6 w-48 bg-gray-200 rounded-lg"></div>
            <div className="h-4 w-32 bg-gray-100 rounded-lg"></div>
            <div className="h-6 w-24 bg-primary-50 rounded-full mt-2"></div>
          </div>
        </div>
        <div className="w-full md:w-32 h-12 bg-gray-200 rounded-2xl"></div>
      </div>

      {/* Details Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="space-y-3">
          <div className="h-6 w-32 bg-gray-200 rounded-lg"></div>
          <div className="h-12 w-full bg-gray-100 rounded-lg"></div>
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-20 bg-gray-100 rounded-full"></div>
              <div className="h-12 w-full bg-gray-50 rounded-2xl"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-100 w-full" />

      {/* Account Actions Skeleton */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-6 px-10 bg-gray-50 rounded-[2.5rem]">
        <div className="space-y-2">
          <div className="h-5 w-40 bg-gray-200 rounded-lg"></div>
          <div className="h-3 w-64 bg-gray-100 rounded-lg"></div>
        </div>
        <div className="flex gap-4">
          <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};
