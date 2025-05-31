"use client";

import { api_caller, ApiReturn } from '@/lib/api_caller';
import { API } from '@/lib/api_const';
import { setLoading } from '@/redux/slices/loaderSlice';
import { Eye, EyeSlash } from '@phosphor-icons/react/dist/ssr';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

// type Props = {}

const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

export default async function page({params}:{params : {token : string}}) {
  let {token} = await params;
  // const [formData, setFormData] = useState<any>({
  //   first_name: "",
  //   last_name: "",
  //   email: "",
  //   password: "",
  //   confirmpassword: "",
  // });
  // const [passwordError, setPasswordError] = useState<string>("");
  // const [confirmpasswordError, setConfirmPasswordError] = useState<string>("");
  // const [showPassToggle, setshowPassToggle] = useState<boolean>(false);

  // const dispatch = useDispatch();
  // const router = useRouter();

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;

  //   // check if the password follows the regex
  //   if (name === "password") {
  //     if (!passwordRegex.test(value)) {
  //       setPasswordError(
  //         "Password must be 8-20 characters with 1 uppercase, 1 number, and 1 special character."
  //       );
  //     } else {
  //       if (!(formData.confirmpassword === value)) {
  //         setConfirmPasswordError("Confirm password must be same as Password");
  //       } else {
  //         setConfirmPasswordError("");
  //       }
  //       setPasswordError("");
  //     }
  //   }

  //   // check if the password matches with the confirm password
  //   if (name === "confirmpassword") {
  //     if (!(formData.password === value)) {
  //       setConfirmPasswordError("Confirm password must be same as Password");
  //     } else {
  //       setConfirmPasswordError("");
  //     }
  //   }

  //   setFormData({ ...formData, [name]: value });
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (passwordError !== "" || confirmpasswordError !== "") {
  //     return;
  //   }

  //   dispatch(setLoading({ loading: true }));
  //   const res: ApiReturn<any> = await api_caller<any>(
  //     "POST",
  //     API.USER.REGISTER,
  //     formData
  //   );
  //   if (res.success) {
  //     dispatch(setLoading({ loading: false }));
  //     router.push("/login");
  //     toast.success(res.message || "Loggged In successfully");
  //   } else {
  //     dispatch(setLoading({ loading: false }));
  //     toast.error(`${res.message} : ${res.error}`);
  //   }
  // };
  return (
    <div>
      <div className="bg-white p-8 rounded-lg w-full max-w-md mx-5">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Change Password
          </h2>
          <form className="mt-6">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  // type={!showPassToggle ? "password" : "text"}
                  type='password'
                  name="password"
                  // value={formData.password}
                  // onChange={handleChange}
                  required
                  placeholder="eg : Test@1234"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {/* {!showPassToggle ? (
                  <EyeSlash
                    size={24}
                    className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-600 cursor-pointer"
                    onClick={() => {
                      // setshowPassToggle(true);
                    }}
                  />
                ) : (
                  <Eye
                    size={24}
                    className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-600 cursor-pointer"
                    onClick={() => {
                      // setshowPassToggle(false);
                    }}
                  />
                )} */}
              </div>
              {/* {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )} */}
            </div>
            <label className="block text-gray-700 font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <input
                // type={!showPassToggle ? "password" : "text"}
                type='password'
                name="confirmpassword"
                // value={formData.confirmpassword}
                // onChange={handleChange}
                required
                placeholder="eg : Test@1234"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {/* {!showPassToggle ? (
                <EyeSlash
                  size={24}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-600 cursor-pointer"
                  onClick={() => {
                    setshowPassToggle(true);
                  }}
                />
              ) : (
                <Eye
                  size={24}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-600 cursor-pointer"
                  onClick={() => {
                    setshowPassToggle(false);
                  }}
                />
              )} */}
            </div>
            {/* {confirmpasswordError && (
              <p className="text-red-500 text-sm mt-1">
                {confirmpasswordError}
              </p>
            )} */}
            <button
              type="submit"
              className="w-full bg-buttons text-white py-2 mt-4 rounded-lg hover:bg-buttonsHover"
            >
              Register
            </button>
          </form>
        </div>
    </div>
  )
}