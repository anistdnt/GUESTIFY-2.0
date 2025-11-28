"use client";

import { useEffect, useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react/dist/ssr";

type Props = {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  showPassToggle: boolean;
  setshowPassToggle: (v: boolean) => void;
  passwordError: string;
  confirmpasswordError: string;
  onFormTypeChange: (type: "user" | "admin") => void; 
};

export default function SlidingSignupForm({
  formData,
  handleChange,
  handleSubmit,
  showPassToggle,
  setshowPassToggle,
  passwordError,
  confirmpasswordError,
  onFormTypeChange,
}: Props) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    onFormTypeChange(isAdmin ? "admin" : "user");
  }, [isAdmin, onFormTypeChange]);

  return (
    <div className="mt-6">
      {/* Toggle Buttons */}
      <div className="relative flex mb-6 bg-gray-100 rounded-lg overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full w-1/2 bg-buttons rounded-lg transition-transform duration-500 ${
            isAdmin ? "translate-x-full" : "translate-x-0"
          }`}
        ></div>

        <button
          type="button"
          onClick={() => setIsAdmin(false)}
          className={`z-10 w-1/2 py-2 font-medium transition-colors ${
            !isAdmin ? "text-white" : "text-gray-600"
          }`}
        >
          User
        </button>
        <button
          type="button"
          onClick={() => setIsAdmin(true)}
          className={`z-10 w-1/2 py-2 font-medium transition-colors ${
            isAdmin ? "text-white" : "text-gray-600"
          }`}
        >
          Admin
        </button>
      </div>

      {/* Sliding Forms */}
      <div className="relative w-full overflow-hidden">
        <div
          className={`flex transition-transform duration-500 ease-in-out ${
            isAdmin ? "-translate-x-1/2" : "translate-x-0"
          }`}
          style={{ width: "200%" }}
        >
          {/* USER FORM */}
          <form
            onSubmit={handleSubmit}
            className="w-1/2 px-2 transition-opacity duration-500"
          >
            <CommonFields
              formData={formData}
              handleChange={handleChange}
              showPassToggle={showPassToggle}
              setshowPassToggle={setshowPassToggle}
              passwordError={passwordError}
              confirmpasswordError={confirmpasswordError}
            />
            <button
              type="submit"
              className="w-full bg-buttons text-white py-2 mt-3 rounded-lg hover:bg-buttonsHover transition"
            >
              Register as User
            </button>
          </form>

          {/* ADMIN FORM */}
          <form
            onSubmit={handleSubmit}
            className="w-1/2 px-2 transition-opacity duration-500"
          >
            <CommonFields
              formData={formData}
              handleChange={handleChange}
              showPassToggle={showPassToggle}
              setshowPassToggle={setshowPassToggle}
              passwordError={passwordError}
              confirmpasswordError={confirmpasswordError}
            />
            <button
              type="submit"
              className="w-full bg-buttons text-white py-2 mt-3 rounded-lg hover:bg-buttonsHover transition"
            >
              Register as Admin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* Reusable Common Fields */
function CommonFields({
  formData,
  handleChange,
  showPassToggle,
  setshowPassToggle,
  passwordError,
  confirmpasswordError,
}: any) {
  return (
    <>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">First name</label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
          placeholder="eg : John"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Last name</label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
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
          placeholder="eg : john@gmail.com"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Password */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Password</label>
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
              size={22}
              className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-600 cursor-pointer"
              onClick={() => setshowPassToggle(true)}
            />
          ) : (
            <Eye
              size={22}
              className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-600 cursor-pointer"
              onClick={() => setshowPassToggle(false)}
            />
          )}
        </div>
        {passwordError && (
          <p className="text-red-500 text-sm mt-1">{passwordError}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
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
            <EyeSlash
              size={22}
              className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-600 cursor-pointer"
              onClick={() => setshowPassToggle(true)}
            />
          ) : (
            <Eye
              size={22}
              className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-600 cursor-pointer"
              onClick={() => setshowPassToggle(false)}
            />
          )}
        </div>
        {confirmpasswordError && (
          <p className="text-red-500 text-sm mt-1">{confirmpasswordError}</p>
        )}
      </div>
    </>
  );
}
