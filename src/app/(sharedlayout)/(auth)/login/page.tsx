"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeSlash } from "@phosphor-icons/react/dist/ssr";
import { LoginFormData } from "@/types/auth_type";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next/client";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { useDispatch } from "react-redux";
import { setLoading } from "@/redux/slices/loaderSlice";
import { setModalVisibility } from "@/redux/slices/modalSlice";
import { log } from "console";

const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [passwordError, setPasswordError] = useState<string>("");
  const [showPassToggle, setshowPassToggle] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // check if the password follows the regex
    if (name === "password") {
      if (!passwordRegex.test(value)) {
        setPasswordError(
          "Password must be 8-20 characters with 1 uppercase, 1 number, and 1 special character."
        );
      } else {
        setPasswordError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading({loading:true}))
    const res: ApiReturn<any> = await api_caller<any>(
      "POST",
      API.USER.LOGIN,
      formData
    );
    if (res.success) {
      
      setCookie("authToken", res.data?.token, {
        maxAge: 2 * 60 * 60, //2 hours
      });
      dispatch(setLoading({loading:false}))
      router.push("/");
      toast.success(res.message || "Loggged In successfully");
    } else {
      dispatch(setLoading({loading:false}))
      toast.error(`${res.message} : ${res.error}`);
    }
  };

  return (
    <>
      <div className="min-h-[85vh] flex flex-col lg:flex-row  items-center justify-evenly bg-gray-100 py-10">
        <Image
          src="/assets/login_illustration.webp"
          height={600}
          width={600}
          alt="illustration"
        ></Image>
        <div className="bg-white p-8 rounded-lg w-full max-w-md mx-5">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="mt-6">
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
                )}
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
            <div className="flex items-center justify-between mb-4">
              {/* Toodle (Toggle) for "Remember Me" */}
              <div className="flex flex-row justify-center items-center gap-2">
                <input
                  type="checkbox"
                  checked={true}
                  className="size-4 accent-buttons cursor-pointer"
                  disabled
                />
                <label htmlFor="rememberMe">Remember Me</label>
              </div>
              <p className="text-buttons text-sm cursor-pointer" onClick={()=>{dispatch(setModalVisibility({open:true,type:"reset"}));}}>
                Forgot Password?
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-buttons text-white py-2 rounded-lg hover:bg-buttonsHover"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            <span className=" me-2">Don&apos;t have an account?</span>
            <Link href="/signup" className="text-buttons">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
