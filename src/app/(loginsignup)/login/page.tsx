"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeSlash } from "@phosphor-icons/react/dist/ssr";
import { LoginFormData } from "@/types/auth_type";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteCookie, getCookie, setCookie } from "cookies-next/client";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { useDispatch } from "react-redux";
import { setLoading } from "@/redux/slices/loaderSlice";
import { setModalVisibility } from "@/redux/slices/modalSlice";
import CommonButton from "@/components/AppComponents/CommonButton";
import { EnvelopeSimple, LockSimple, ShieldCheck } from "@phosphor-icons/react";
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
  const [loginloading, setLoginLoading] = useState<boolean>(false);
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
    setLoginLoading(true);
    const res: ApiReturn<any> = await api_caller<any>(
      "POST",
      API.USER.LOGIN,
      formData
    );
    if (res.success) {
      const callback_url = getCookie("callback_url");
      let redirectUrl = "";
      if (res?.data?.is_admin) {
        redirectUrl = callback_url || `/admin/${res?.data?.user_id}/dashboard`;
      } else {
        redirectUrl = callback_url || "/";
      }
      setCookie("authToken", res?.data?.token, {
        maxAge: 2 * 60 * 60, // 2 hours
      });

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay
      setLoginLoading(false);
      // dispatch(setModalVisibility({
      //   open: true,
      //   type: "signingin"
      // }))
      router?.push(redirectUrl);
      deleteCookie("callback_url");
      toast.success(res.message || "Loggged In successfully");
    } else {
      setLoginLoading(false);
      toast.error(`${res.message} : ${res.error}`);
    }
  };

  return (
    <>
      <div className="h-screen flex flex-col lg:flex-row bg-[#FAFAFA] font-jakarta overflow-hidden relative">
        {/* Cinematic Left Banner */}
        <div className="hidden lg:flex lg:w-1/2 h-full relative overflow-hidden group border-r border-gray-100">
          <Image
            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=2070"
            fill
            alt="Cinematic Interior"
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-neutral-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-900/20 to-neutral-950/40" />
          
          <div className="absolute inset-0 p-20 flex flex-col justify-between z-10">
            <Link href="/" className="flex items-center gap-2 group/logo">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg transform transition-transform group-hover/logo:scale-110">
                <ShieldCheck size={26} weight="fill" className="text-primary-600" />
              </div>
              <span className="text-3xl font-bold text-white font-display tracking-tight">Guestify</span>
            </Link>

            <div className="max-w-md space-y-6">
              <h1 className="text-6xl font-semibold text-white font-display leading-[1.1] tracking-tight">
                Your <span className="italic-serif text-primary-400">Premium</span> Stay Awaits.
              </h1>
              <p className="text-white/70 text-lg font-jakarta leading-relaxed">
                Connect with the finest student accommodations across West Bengal. Experience living like never before.
              </p>
              
              <div className="flex items-center gap-8 pt-6">
                <div className="text-white">
                  <p className="text-3xl font-bold font-display">2k+</p>
                  <p className="text-white/50 text-xs uppercase tracking-widest font-bold">Verified PGs</p>
                </div>
                <div className="h-10 w-px bg-white/20" />
                <div className="text-white">
                  <p className="text-3xl font-bold font-display">15k+</p>
                  <p className="text-white/50 text-xs uppercase tracking-widest font-bold">Happy Students</p>
                </div>
              </div>
            </div>

            <div className="text-white/40 text-sm">
              © 2024 Guestify. All rights reserved. Professional Accommodation Services.
            </div>
          </div>
        </div>

        {/* Right Auth Section */}
        <div className="w-full lg:w-1/2 h-full flex flex-col p-6 lg:p-20 relative overflow-y-auto scrollbar-hide">
          {/* Decorative shapes on mobile */}
          <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary-100/50 rounded-full blur-[100px] lg:hidden" />
          
          <div className="w-full max-w-lg mx-auto my-auto relative animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Main Card */}
            <div className="bg-white/80 backdrop-blur-3xl p-8 lg:p-14 rounded-[2.5rem] lg:rounded-[3rem] shadow-[0_32px_80px_rgba(0,0,0,0.06)] border border-white/50 relative z-10 transition-all duration-500 hover:shadow-[0_40px_100px_rgba(0,0,0,0.08)]">
              <div className="flex flex-col items-center text-center mb-10">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-primary-100 lg:hidden">
                  <ShieldCheck size={28} weight="duotone" className="text-primary-600" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 font-display tracking-tight mb-2">
                  Welcome <span className="italic-serif text-primary-600">Back</span>
                </h2>
                <p className="text-gray-500 font-jakarta text-sm">Enter your credentials to access your portal</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
                {/* Email Input */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Identity</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors">
                      <EnvelopeSimple size={20} weight="bold" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border-2 border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 focus:bg-white transition-all duration-300 font-jakarta text-gray-700 placeholder:text-gray-300"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Access Key</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors">
                      <LockSimple size={20} weight="bold" />
                    </div>
                    <input
                      type={!showPassToggle ? "password" : "text"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full pl-14 pr-14 py-4 bg-gray-50/50 border-2 border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 focus:bg-white transition-all duration-300 font-jakarta text-gray-700 placeholder:text-gray-300"
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                      {!showPassToggle ? (
                        <EyeSlash
                          size={20}
                          className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                          onClick={() => setshowPassToggle(true)}
                        />
                      ) : (
                        <Eye
                          size={20}
                          className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                          onClick={() => setshowPassToggle(false)}
                        />
                      )}
                    </div>
                  </div>
                  {passwordError && (
                    <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1 mt-2">{passwordError}</p>
                  )}
                </div>

                <div className="flex items-center justify-between px-1">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-200 transition-all checked:border-primary-600 checked:bg-primary-600"
                        defaultChecked
                      />
                      <svg className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">Remember Me</span>
                  </label>
                  <button
                    type="button"
                    className={`text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors ${loginloading ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => !loginloading && dispatch(setModalVisibility({ open: true, type: "reset" }))}
                  >
                    Lost Access?
                  </button>
                </div>

                <CommonButton
                  variant="primary"
                  size="lg"
                  disabled={loginloading}
                  className="w-full h-16 rounded-2xl shadow-xl shadow-primary-600/20 text-lg transition-transform active:scale-95"
                >
                  {loginloading ? "Authenticating..." : "Enter Portal"}
                </CommonButton>
              </form>

              <div className="mt-10 pt-8 border-t border-gray-50 text-center">
                <p className="text-gray-400 text-sm">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-primary-600 font-bold hover:underline transition-all">
                    Register now
                  </Link>
                </p>
              </div>
            </div>

            {/* Background Decorative Card */}
            <div className="absolute top-10 left-10 -right-4 -bottom-4 bg-primary-600/5 rounded-[2.5rem] lg:rounded-[3rem] -z-0" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
