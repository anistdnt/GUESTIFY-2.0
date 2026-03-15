"use client";

import { ArrowUp, List, X, User, SignOut, House, Info, PhoneCall, Scroll } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { deleteCookie, hasCookie, getCookie } from "cookies-next/client";
import toast from "react-hot-toast";
import { decodeToken } from "@/lib/decodeToken";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUserData } from "@/redux/slices/userSlice";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { setLoading } from "@/redux/slices/loaderSlice";
import { hideModal, setModalVisibility } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import Notification from "./Notification";
import Noti from "./Noti";
import CommonButton from "../AppComponents/CommonButton";

const navigation: {
  name: string;
  href: string;
  icon: any;
}[] = [
    { name: "Home", href: "/", icon: House },
    { name: "About Us", href: "/about", icon: Info },
    { name: "Contact Us", href: "/contact", icon: PhoneCall },
    { name: "Terms & Services", href: "/terms-and-services", icon: Scroll },
  ];

interface UserInfo {
  user_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  image_url: string | null;
}

export interface GetNotification_Type {
  notification: string
}

export default function Header() {
  const reduxUserData = useSelector(
    (state: RootState) => state.user_slice.userData
  );

  const [showProfileDropdown, setshowProfileDropdown] =
    useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [isLoggedIn, setisLoggedIn] = useState<boolean>(false);
  const [userInfo, setuserInfo] = useState<UserInfo | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const logout_user = async () => {
    dispatch(setLoading({ loading: true }));
    const res: ApiReturn<any> = await api_caller<any>("GET", API.USER.LOGOUT);
    if (res.success) {
      deleteCookie("authToken");
      dispatch(setUserData({}));
      setuserInfo(null);
      setisLoggedIn(false);
      setshowProfileDropdown(false);
      setShowMobileMenu(false);
      window.location.href = "/login";
      toast.success(res.message || "Logged out successfully");
    } else {
      toast.error(`${res.message} : ${res.error}`);
    }
    dispatch(setLoading({ loading: false }));
  };

  const fetcheUserProfile = async (uid: any) => {
    const res: ApiReturn<any> = await api_caller<any>(
      "GET",
      `${API.USER.INFO}/${uid}`
    );
    if (res.success) {
      dispatch(setUserData(res?.data));
    } else {
      toast.error(`${res.message} : ${res.error}`);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | PointerEvent) {
      if (showProfileDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setshowProfileDropdown(false);
      }
      if (showMobileMenu && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && !(event.target as HTMLElement).closest('.mobile-menu-trigger')) {
        setShowMobileMenu(false);
      }
    }

    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [showProfileDropdown, showMobileMenu]);

  const [isScrolled, setisScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setisScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (hasCookie("authToken")) {
      if (Object.keys(reduxUserData).length !== 0) {
        setuserInfo({
          user_id: reduxUserData?._id ?? "",
          first_name: reduxUserData?.first_name ?? "",
          last_name: reduxUserData?.last_name ?? "",
          full_name: reduxUserData?.first_name + " " + reduxUserData?.last_name,
          email: reduxUserData?.email ?? "",
          image_url: reduxUserData?.image_url ?? null,
        });
      } else {
        const user_info_fromToken = decodeToken("authToken");
        dispatch(setToken("authToken"));
        fetcheUserProfile(user_info_fromToken.user_id);
      }
      setisLoggedIn(true);
    }
    else {
      setisLoggedIn(false);
    }
    dispatch(setLoading({ loading: false }));
    dispatch(hideModal());
  }, [isLoggedIn, pathname, reduxUserData]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showMobileMenu]);

  return (
    <header className="sticky z-40 top-0">
      <nav className={`transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm py-1" : "bg-white py-3"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            {/* Mobile Menu Icon Left */}
            <div className="flex items-center lg:hidden">
              <button
                className="mobile-menu-trigger inline-flex items-center justify-center rounded-xl p-2.5 text-gray-600 hover:bg-gray-100 transition-all active:scale-95"
                onClick={() => setShowMobileMenu(true)}
              >
                <List size={28} weight="bold" />
              </button>
            </div>

            {/* Logo Section */}
            <div className="flex items-center justify-center lg:justify-start">
              <Link href="/" className="flex items-center transform transition-transform hover:scale-105 active:scale-95">
                <Image
                  src={"/assets/new_logo.png"}
                  alt="Logo"
                  width={160}
                  height={60}
                  className="w-auto h-8 sm:h-10 lg:h-12"
                  loading="eager"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative text-sm font-semibold tracking-wide transition-all duration-300 py-2 group ${
                    item.href === pathname 
                      ? "text-primary-600" 
                      : "text-gray-600 hover:text-primary-600"
                  }`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 transform origin-left transition-transform duration-300 ${item.href === pathname ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}></span>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 sm:gap-6">
              {/* Notification - Hidden on very small screens if needed, but handled by Noti */}
              {userInfo?.user_id && (
                <div className="flex items-center">
                   <Noti user_id={userInfo?.user_id}/>
                </div>
              )}

              <div className="hidden sm:block h-6 w-[1.5px] bg-gray-200"></div>

              {isLoggedIn ? (
                <div ref={dropdownRef} className="relative">
                  {userInfo === null ? <Skeleton /> : (
                    <div
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => setshowProfileDropdown(!showProfileDropdown)}
                    >
                      <div className="hidden sm:flex flex-col items-end mr-1">
                        <span className="text-gray-900 text-xs font-bold uppercase tracking-widest">{userInfo?.first_name} {userInfo?.last_name}</span>
                        <span className="text-gray-400 text-[10px] font-medium">Account</span>
                      </div>
                      <div className="relative h-10 w-10 p-0.5 rounded-full border-2 border-gray-100 group-hover:border-primary-200 transition-all duration-300">
                        <Image
                          src={userInfo?.image_url || "/assets/profile.png"}
                          alt="Profile"
                          className="rounded-full object-cover"
                          fill
                        />
                      </div>
                    </div>
                  )}

                  {/* Desktop Profile Dropdown */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 top-14 z-50 w-56 origin-top-right rounded-2xl bg-white p-2 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
                      <div className="px-4 py-3 mb-2 bg-gray-50 rounded-xl">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Logged in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{userInfo?.full_name}</p>
                      </div>
                      <Link
                        href={`/profile/${userInfo?.user_id}`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors font-medium"
                        onClick={() => setshowProfileDropdown(false)}
                      >
                        <User size={18} weight="bold" />
                        Your Profile
                      </Link>
                      <button
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium mt-1"
                        onClick={logout_user}
                      >
                        <SignOut size={18} weight="bold" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login" className="hidden sm:block">
                    <CommonButton variant="ghost" size="sm" className="text-xs font-bold tracking-widest uppercase py-2.5 px-6">
                      LOGIN
                    </CommonButton>
                  </Link>
                  <Link href="/signup">
                    <CommonButton variant="primary" size="sm" className="text-xs font-bold tracking-widest uppercase py-2.5 px-6 rounded-xl shadow-lg shadow-primary-500/20">
                      SIGN UP
                    </CommonButton>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

      </nav>

      {/* Mobile Drawer (Side Sidebar) */}
      <div className={`fixed inset-0 z-[100] lg:hidden overflow-hidden transition-all duration-500 ${showMobileMenu ? "visible" : "invisible"}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${showMobileMenu ? "opacity-100" : "opacity-0"}`}
          onClick={() => setShowMobileMenu(false)}
        />
        
        {/* Drawer Content */}
        <div 
          ref={mobileMenuRef}
          className={`absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out flex flex-col ${showMobileMenu ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-50">
            <Link href="/" onClick={() => setShowMobileMenu(false)}>
              <Image src="/assets/new_logo.png" alt="Logo" width={120} height={50} />
            </Link>
            <button 
              className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              <X size={24} weight="bold" />
            </button>
          </div>

          {/* User Info Section */}
          <div className="p-6 bg-gray-50/50">
            {isLoggedIn && userInfo ? (
               <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full border-4 border-white shadow-sm overflow-hidden relative">
                     <Image src={userInfo.image_url || "/assets/profile.png"} alt="User" fill className="object-cover" />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Welcome back,</p>
                     <p className="text-lg font-bold text-gray-900">{userInfo.first_name}</p>
                  </div>
               </div>
            ) : (
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-4">Discover your perfect PG stay with Guestify.</p>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/login" onClick={() => setShowMobileMenu(false)}>
                    <button className="w-full py-2.5 text-xs font-bold border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors uppercase tracking-widest">Login</button>
                  </Link>
                  <Link href="/signup" onClick={() => setShowMobileMenu(false)}>
                    <button className="w-full py-2.5 text-xs font-bold bg-gray-900 text-white rounded-xl hover:bg-black transition-colors uppercase tracking-widest">Sign Up</button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto p-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Main Menu</p>
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                      pathname === item.href 
                        ? "bg-primary-50 text-primary-600 shadow-sm" 
                        : "text-gray-600 hover:bg-gray-50 hover:px-5"
                    }`}
                  >
                    <div className={`p-2 rounded-xl transition-colors ${pathname === item.href ? "bg-white text-primary-600 shadow-sm" : "bg-gray-100/50 text-gray-400"}`}>
                      <Icon size={20} weight={pathname === item.href ? "fill" : "bold"} />
                    </div>
                    <span className="font-bold text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Footer / Account Actions */}
          <div className="p-6 border-t border-gray-50 mt-auto">
            {isLoggedIn ? (
              <div className="space-y-2">
                <Link 
                  href={`/profile/${userInfo?.user_id}`} 
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl text-gray-600 hover:bg-gray-50 font-bold text-sm transition-colors"
                >
                  <User size={20} weight="bold" className="text-gray-400" />
                  My Account
                </Link>
                <button 
                  onClick={logout_user}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 font-bold text-sm transition-colors"
                >
                  <SignOut size={20} weight="bold" className="text-red-400" />
                  Sign Out
                </button>
              </div>
            ) : (
              <p className="text-center text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium">Guestify &copy; 2024</p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

const Skeleton = () => {
  return (
    <div className="flex flex-row gap-3 items-center">
      <div className="hidden sm:flex flex-col items-end gap-1">
         <div className="w-16 h-3 bg-gray-100 rounded animate-pulse"></div>
         <div className="w-10 h-2 bg-gray-50 rounded animate-pulse"></div>
      </div>
      <div className="h-10 w-10 rounded-full bg-gray-100 animate-pulse border-2 border-gray-50"></div>
    </div>
  );
}
