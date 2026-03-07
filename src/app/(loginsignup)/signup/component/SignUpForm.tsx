"use client";

import { useEffect, useState } from "react";
import { Eye, EyeSlash, User, UserIcon, EnvelopeSimple, LockSimple, IdentificationBadge } from "@phosphor-icons/react";
import CommonButton from "@/components/AppComponents/CommonButton";

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
      <div className="relative flex p-1.5 mb-10 bg-gray-100/50 backdrop-blur-md rounded-2xl border border-gray-100">
        <div
          className={`absolute top-1.5 left-1.5 h-[calc(100%-12px)] w-[calc(50%-6px)] bg-primary-600 rounded-[0.85rem] shadow-lg shadow-primary-600/20 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
            isAdmin ? "translate-x-full" : "translate-x-0"
          }`}
        />

        <button
          type="button"
          onClick={() => setIsAdmin(false)}
          className={`z-10 w-1/2 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
            !isAdmin ? "text-white" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <User size={16} weight={!isAdmin ? "fill" : "bold"} />
          Student
        </button>
        <button
          type="button"
          onClick={() => setIsAdmin(true)}
          className={`z-10 w-1/2 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
            isAdmin ? "text-white" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <UserIcon size={16} weight={isAdmin ? "fill" : "bold"} />
          Owner
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
            <CommonButton
              variant="primary"
              size="lg"
              className="w-full h-14 rounded-2xl shadow-lg shadow-primary-600/10 mt-6"
            >
              Start as Student
            </CommonButton>
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
            <CommonButton
              variant="primary"
              size="lg"
              className="w-full h-14 rounded-2xl shadow-lg shadow-primary-600/10 mt-6"
            >
              Register as Owner
            </CommonButton>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">First Name</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors">
              <IdentificationBadge size={18} weight="bold" />
            </div>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              placeholder="John"
              className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border-2 border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 focus:bg-white transition-all duration-300 font-jakarta text-sm text-gray-700"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
            placeholder="Doe"
            className="w-full px-4 py-3 bg-gray-50/50 border-2 border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 focus:bg-white transition-all duration-300 font-jakarta text-sm text-gray-700"
          />
        </div>
      </div>

      <div className="mb-6 space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Email Connection</label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors">
            <EnvelopeSimple size={18} weight="bold" />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="john@example.com"
            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border-2 border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 focus:bg-white transition-all duration-300 font-jakarta text-sm text-gray-700"
          />
        </div>
      </div>

      <div className="mb-6 space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Security Key</label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors">
            <LockSimple size={18} weight="bold" />
          </div>
          <input
            type={!showPassToggle ? "password" : "text"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className="w-full pl-12 pr-12 py-3 bg-gray-50/50 border-2 border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 focus:bg-white transition-all duration-300 font-jakarta text-sm text-gray-700"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {!showPassToggle ? (
              <EyeSlash size={18} className="text-gray-400 hover:text-gray-600 cursor-pointer" onClick={() => setshowPassToggle(true)} />
            ) : (
              <Eye size={18} className="text-gray-400 hover:text-gray-600 cursor-pointer" onClick={() => setshowPassToggle(false)} />
            )}
          </div>
        </div>
        {passwordError && (
          <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1 mt-1">{passwordError}</p>
        )}
      </div>

      <div className="mb-4 space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Confirm Identity</label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors">
            <LockSimple size={18} weight="bold" />
          </div>
          <input
            type={!showPassToggle ? "password" : "text"}
            name="confirmpassword"
            value={formData.confirmpassword}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className="w-full pl-12 pr-12 py-3 bg-gray-50/50 border-2 border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 focus:bg-white transition-all duration-300 font-jakarta text-sm text-gray-700"
          />
        </div>
        {confirmpasswordError && (
          <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1 mt-1">{confirmpasswordError}</p>
        )}
      </div>
    </>
  );
}
