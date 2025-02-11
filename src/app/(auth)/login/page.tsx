"use client";

import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeSlash } from "@phosphor-icons/react/dist/ssr";

type LoginFormData = {
  email: string;
  password: string | number | readonly string[] | undefined;
  rememberMe: boolean;
};

const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [passwordError, setPasswordError] = useState<string>("");
  const [showPassToggle, setshowPassToggle] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

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

    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <>
      <Head>
        <title>Login - Guestify</title>
        <meta
          name="description"
          content="Login to your Guestify account and explore paying guest accommodations."
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
                  type={!showPassToggle ? 'password' : 'text'}
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
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="size-4 accent-buttons cursor-pointer"
                />
                <label htmlFor="rememberMe">Remember Me</label>
              </div>
              <Link href="/" className="text-buttons text-sm">
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-buttons text-white py-2 rounded-lg hover:bg-buttonsHover"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            <span className=" me-2">Don't have an account?</span>
            <Link href="/" className="text-buttons">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
