"use client";

import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeSlash } from "@phosphor-icons/react/dist/ssr";
import { useDispatch } from "react-redux";
import { setLoading } from "@/redux/slices/loaderSlice";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type SignUpFormData = {
  first_name: string;
  last_name: string;
  email: string;
  password: string | number | readonly string[] | undefined;
  confirmpassword: string | number | readonly string[] | undefined;
};

const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

const SignUp = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmpasswordError, setConfirmPasswordError] = useState<string>("");
  const [showPassToggle, setshowPassToggle] = useState<boolean>(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // check if the password follows the regex
    if (name === "password") {
      if (!passwordRegex.test(value)) {
        setPasswordError(
          "Password must be 8-20 characters with 1 uppercase, 1 number, and 1 special character."
        );
      } else {
        if (!(formData.confirmpassword === value)) {
          setConfirmPasswordError("Confirm password must be same as Password");
        } else {
          setConfirmPasswordError("");
        }
        setPasswordError("");
      }
    }

    // check if the password matches with the confirm password
    if (name === "confirmpassword") {
      if (!(formData.password === value)) {
        setConfirmPasswordError("Confirm password must be same as Password");
      } else {
        setConfirmPasswordError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordError !== "" || confirmpasswordError !== "") {
      return;
    }

    dispatch(setLoading({ loading: true }));
    const res: ApiReturn<any> = await api_caller<any>(
      "POST",
      API.USER.REGISTER,
      formData
    );
    if (res.success) {
      dispatch(setLoading({ loading: false }));
      router.push("/login");
      toast.success(res.message || "Loggged In successfully");
    } else {
      dispatch(setLoading({ loading: false }));
      toast.error(`${res.message} : ${res.error}`);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up - Guestify</title>
        <meta
          name="description"
          content="Sign Up to your Guestify account and explore paying guest accommodations."
        />
      </Head>

      <div className="min-h-[85vh] flex flex-col lg:flex-row  items-center justify-evenly bg-gray-100 py-10">
        <Image
          src="/assets/login_illustration.webp"
          height={600}
          width={600}
          alt="illustration"
        ></Image>
        <div className="bg-white p-8 rounded-lg w-full max-w-md mx-5">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Register
          </h2>
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">
                First name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                minLength={1}
                maxLength={30}
                required
                placeholder="eg : John"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">
                Last name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                minLength={1}
                maxLength={30}
                required
                placeholder="eg : Doe"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="eg : John@gmail.com"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={!showPassToggle ? "password" : "text"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="eg : Test@1234"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {!showPassToggle ? (
                  <span data-tooltip="Password not visible">
                  <EyeSlash
                    size={24}
                    className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-600 cursor-pointer"
                    onClick={() => {
                      setshowPassToggle(true);
                    }}
                  />
                  </span>
                ) : (
                  <span data-tooltip="Password visible">
                  <Eye
                    size={24}
                    className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-600 cursor-pointer"
                    onClick={() => {
                      setshowPassToggle(false);
                    }}
                  />
                  </span>
                )}
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
            <label className="block text-gray-700 font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={!showPassToggle ? "password" : "text"}
                name="confirmpassword"
                value={formData.confirmpassword}
                onChange={handleChange}
                required
                placeholder="eg : Test@1234"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {!showPassToggle ? (
                <span data-tooltip="Password not visible">
                <EyeSlash
                  size={24}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-600 cursor-pointer"
                  onClick={() => {
                    setshowPassToggle(true);
                  }}
                />
                </span>
              ) : (
                <span data-tooltip="Password visible">
                <Eye
                  size={24}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-600 cursor-pointer"
                  onClick={() => {
                    setshowPassToggle(false);
                  }}
                />
                </span>
              )}
            </div>
            {confirmpasswordError && (
              <p className="text-red-500 text-sm mt-1">
                {confirmpasswordError}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-buttons text-white py-2 mt-4 rounded-lg hover:bg-buttonsHover"
            >
              Register
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            <span className=" me-2">Already have an account?</span>
            <Link href="/login" className="text-buttons">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
