"use client";

import { useState } from "react";
// import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeSlash } from "@phosphor-icons/react/dist/ssr";
import { useDispatch } from "react-redux";
import { setLoading } from "@/redux/slices/loaderSlice";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SlidingSignupForm from "./component/SignUpForm";
import { ShieldCheck, ArrowLeft } from "@phosphor-icons/react";

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
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

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

    const payload = {
      ...formData,
      is_admin: isAdmin,
    };

    const res: ApiReturn<any> = await api_caller<any>(
      "POST",
      API.USER.REGISTER,
      payload
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
      {/* <Head>
        <title>Sign Up - Guestify</title>
        <meta
          name="description"
          content="Sign Up to your Guestify account and explore paying guest accommodations."
        />
      </Head> */}

      <div className="h-screen flex flex-col lg:flex-row bg-[#FAFAFA] font-jakarta overflow-hidden relative">
        {/* Cinematic Left Banner */}
        <div className="hidden lg:flex lg:w-1/2 h-full relative overflow-hidden group border-r border-gray-100">
          <Image
            src="https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=2070"
            fill
            alt="Community Living"
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-neutral-900/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-900/20 to-neutral-950/40" />
          
          <div className="absolute inset-0 p-20 flex flex-col justify-between text-white z-10">
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
              <h1 className="text-6xl font-semibold font-display leading-[1.1] tracking-tight">
                Join the <span className="italic-serif text-primary-400">Student</span> Elite.
              </h1>
              <p className="text-white/70 text-lg font-jakarta leading-relaxed">
                Step into a world of curated accommodations designed for the modern scholar. Your journey starts here.
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div>
                  <p className="text-3xl font-bold font-display">100%</p>
                  <p className="text-white/50 text-xs uppercase tracking-widest font-bold">Verified Hosts</p>
                </div>
                <div>
                  <p className="text-3xl font-bold font-display">Fast</p>
                  <p className="text-white/50 text-xs uppercase tracking-widest font-bold">Booking Flow</p>
                </div>
              </div>
            </div>

            <div className="text-white/40 text-sm">
              Secured & Verified by Guestify Trust Systems.
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
          <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-primary-100/50 rounded-full blur-[100px] lg:hidden" />

          <div className="w-full max-w-lg mx-auto my-auto relative animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Main Card */}
            <div className="bg-white/80 backdrop-blur-3xl p-8 lg:p-14 rounded-[2.5rem] lg:rounded-[3rem] shadow-[0_32px_80px_rgba(0,0,0,0.06)] border border-white/50 relative z-10 transition-all duration-500 hover:shadow-[0_40px_100px_rgba(0,0,0,0.08)]">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-primary-100 lg:hidden">
                  <ShieldCheck size={28} weight="duotone" className="text-primary-600" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 font-display tracking-tight mb-2">
                  Join our <span className="italic-serif text-primary-600">Community</span>
                </h2>
                <p className="text-gray-500 font-jakarta text-sm">Elevate your living standard with Guestify</p>
              </div>

              <SlidingSignupForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                showPassToggle={showPassToggle}
                setshowPassToggle={setshowPassToggle}
                passwordError={passwordError}
                confirmpasswordError={confirmpasswordError}
                onFormTypeChange={(type: "user" | "admin") => setIsAdmin(type === "admin")}
              />

              <div className="mt-10 pt-8 border-t border-gray-50 text-center">
                <p className="text-gray-400 text-sm">
                  Already part of the family?{" "}
                  <Link href="/login" className="text-primary-600 font-bold hover:underline transition-all">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>

            {/* Background Decorative Card */}
            <div className="absolute top-10 right-10 -left-4 -bottom-4 bg-primary-600/5 rounded-[2.5rem] lg:rounded-[3rem] -z-0" />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
