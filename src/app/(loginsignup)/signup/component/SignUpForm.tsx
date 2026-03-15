"use client";

import { useEffect, useState } from "react";
import { Eye, EyeSlash, User, UserIcon, EnvelopeSimple, LockSimple, IdentificationBadge } from "@phosphor-icons/react";
import CommonButton from "@/components/AppComponents/CommonButton";

/* Google Brand Icon */
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

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

            {/* OAuth Divider */}
            <div className="flex items-center gap-3 mt-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em] whitespace-nowrap">Or continue with</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            {/* Student Google OAuth */}
            <a
              href={`${process.env.NEXT_PUBLIC_SERVER_URL}auth/google?role=user`}
              className="mt-3 flex items-center justify-center gap-3 w-full h-12 bg-white hover:bg-gray-50 border-2 border-gray-100 hover:border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group active:scale-95"
            >
              <GoogleIcon />
              <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-800 transition-colors">Continue with Google</span>
            </a>
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

            {/* OAuth Divider */}
            <div className="flex items-center gap-3 mt-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em] whitespace-nowrap">Or continue with</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            {/* Owner Google OAuth */}
            <a
              href={`${process.env.NEXT_PUBLIC_SERVER_URL}auth/google?role=admin`}
              className="mt-3 flex items-center justify-center gap-3 w-full h-12 bg-white hover:bg-gray-50 border-2 border-gray-100 hover:border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group active:scale-95"
            >
              <GoogleIcon />
              <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-800 transition-colors">Continue with Google</span>
            </a>
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
