"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Noti from "../Noti";
import { UserInfo } from "@/types/admin";
import { User, SignOut, CaretDown } from "@phosphor-icons/react";

interface Props {
  userInfo: UserInfo;
  isLoggedIn: boolean;
  logout_user: () => Promise<void>;
  tabValue: string;
}

export default function Topbar({ userInfo, isLoggedIn, logout_user, tabValue }: Props) {
  const [showProfileDropdown, setshowProfileDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const getTabHeading = () => {
    switch (tabValue) {
      case "dashboard": return "Dashboard";
      case "profile": return "My Profile";
      case "mypg": return "My Enlisted PGs";
      case "pg": return "Enlist New PG";
      case "payments": return "Payments";
      case "bookings": return "Bookings";
      case "tools/attractions": return "Attractions and Essentials";
      case "tools/extensions": return "Extensions";
      default: return "";
    }
  };
  
  const tabHeading = getTabHeading();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | PointerEvent) {
      if (showProfileDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setshowProfileDropdown(false);
      }
    }
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [showProfileDropdown]);

  return (
    <header className="sticky z-40 top-0">
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="relative flex h-20 items-center justify-between">
            <div className="flex flex-col">
              <p className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.3em] mb-0.5">Owner Central</p>
              <h3 className="text-gray-900 font-normal text-2xl font-display tracking-tight">{tabHeading}</h3>
            </div>

            <div className="flex items-center gap-6">
              {/* Notification System */}
              {userInfo?.user_id && (
                <div className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                  <Noti user_id={userInfo?.user_id} />
                </div>
              )}

              <div className="h-8 w-[1px] bg-gray-100 hidden sm:block"></div>

              {/* Profile Section */}
              <div ref={dropdownRef} className="relative">
                {!userInfo ? (
                  <Skeleton />
                ) : (
                  <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => setshowProfileDropdown(!showProfileDropdown)}
                  >
                    <div className="hidden sm:flex flex-col items-end mr-1">
                      <p className="text-gray-900 text-xs font-bold uppercase tracking-widest">{userInfo?.full_name}</p>
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Owner</span>
                      </div>
                    </div>
                    <div className="relative h-11 w-11 p-0.5 rounded-2xl border-2 border-gray-100 group-hover:border-primary-200 transition-all duration-500 overflow-hidden shadow-sm">
                      <Image
                        src={userInfo?.image_url || "/assets/profile.png"}
                        alt="Profile"
                        className="rounded-xl object-cover"
                        fill
                      />
                    </div>
                    <CaretDown size={14} weight="bold" className={`text-gray-400 transition-transform duration-300 ${showProfileDropdown ? 'rotate-180' : ''}`} />
                  </div>
                )}

                {/* Profile Dropdown */}
                {showProfileDropdown && (
                  <div className="absolute right-0 top-16 z-50 w-64 origin-top-right rounded-[2rem] bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-50 animate-in fade-in zoom-in duration-200">
                    <div className="px-5 py-4 mb-2 bg-gray-50/50 rounded-[1.5rem] border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Authenticated As</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{userInfo?.email}</p>
                    </div>
                    
                    <Link
                      href={`/admin/${userInfo?.user_id}/profile`}
                      className="flex items-center gap-4 px-5 py-3 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-[1.2rem] transition-all duration-300 font-bold font-jakarta"
                      onClick={() => setshowProfileDropdown(false)}
                    >
                      <div className="p-2 bg-white rounded-xl shadow-sm">
                        <User size={18} weight="bold" />
                      </div>
                      Edit Profile
                    </Link>
                    
                    <button
                      className="w-full flex items-center gap-4 px-5 py-3 text-sm text-red-500 hover:bg-red-50 rounded-[1.2rem] transition-all duration-300 font-bold font-jakarta mt-1"
                      onClick={logout_user}
                    >
                      <div className="p-2 bg-white rounded-xl shadow-sm">
                        <SignOut size={18} weight="bold" />
                      </div>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

const Skeleton = () => {
  return (
    <div className="flex flex-row gap-3 items-center animate-pulse">
      <div className="hidden sm:flex flex-col items-end gap-1.5">
         <div className="w-24 h-3.5 bg-gray-100 rounded-full"></div>
         <div className="w-16 h-2.5 bg-gray-50 rounded-full"></div>
      </div>
      <div className="h-11 w-11 rounded-2xl bg-gray-100 border-2 border-gray-50"></div>
    </div>
  );
};
