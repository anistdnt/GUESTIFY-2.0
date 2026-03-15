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
import { EnvelopeSimple, LockSimple, ShieldCheck, ArrowLeft } from "@phosphor-icons/react";
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
            <div className="flex w-full justify-between items-center">
              <Link href="/" className="flex items-center transform transition-transform hover:scale-105 active:scale-95">
                <Image
                  src={"/assets/new_logo.png"}
                  alt="Logo"
                  width={180}
                  height={70}
                  className="w-auto h-12 sm:h-14 lg:h-16"
                  loading="eager"
                />
              </Link>
              <Link 
                href="/" 
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 text-sm font-medium rounded-full shadow-sm border border-white/20 group cursor-pointer"
              >
                <ArrowLeft size={16} weight="bold" className="transform group-hover:-translate-x-1 transition-transform" />
                <span>Back to Home</span>
              </Link>
            </div>

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
          {/* Back to Home Button (Mobile Only) */}
          <Link 
            href="/" 
            className="absolute top-6 left-6 z-50 flex lg:hidden items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors bg-white/80 hover:bg-white backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-gray-200/50 hover:shadow-md text-sm font-medium group"
          >
            <ArrowLeft size={16} weight="bold" className="transform group-hover:-translate-x-1 transition-transform" />
            <span>Home</span>
          </Link>

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

              {/* OAuth Divider */}
              <div className="flex items-center gap-4 mt-8">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] whitespace-nowrap">Or continue with</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Google OAuth Button */}
              <a
                href={`${process.env.NEXT_PUBLIC_SERVER_URL}auth/google?role=user`}
                className="mt-4 flex items-center justify-center gap-3 w-full h-14 bg-white hover:bg-gray-50 border-2 border-gray-100 hover:border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group active:scale-95"
              >
                <GoogleIcon />
                <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-800 transition-colors">Continue with Google</span>
              </a>

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
