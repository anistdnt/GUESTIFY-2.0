"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setModalVisibility } from "@/redux/slices/modalSlice";
import Noti from "../Noti";
import { UserInfo } from "@/types/admin";

interface Props {
  userInfo: UserInfo;
  isLoggedIn: boolean;
  logout_user: () => Promise<void>;
}

export default function Topbar({ userInfo, isLoggedIn, logout_user }: Props) {
  // for handling profile dropdown
  const [showProfileDropdown, setshowProfileDropdown] =
    useState<boolean>(false);

  const dispatch = useDispatch();

  return (
    <header className="sticky z-40 top-0">
      <nav className="bg-[#f8f4f3] shadow-md shadow-black/5">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <h3 className="text-gray-700 font-semibold">Dashboard</h3>

            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* Profile dropdown */}
              <div className="relative ml-3 flex justify-center items-center gap-5">
                {/* <Notification/> */}
                {userInfo?.user_id && <Noti user_id={userInfo?.user_id} />}

                <div>
                  {userInfo === null ? (
                    <Skeleton />
                  ) : (
                    <div
                      className="flex flex-row justify-center items-center gap-3 cursor-pointer"
                      onClick={() => {
                        setshowProfileDropdown((prev) => !prev);
                      }}
                    >
                      <span className="text-gray-700 text-sm hidden sm:block font-semibold">
                        {userInfo?.full_name}
                        <br />
                        <span className="text-xs text-gray-500 float-end">
                          ADMIN
                        </span>
                      </span>
                      <button
                        className="relative flex rounded-full text-sm border border-gray-500 h-10 w-10"
                        aria-label="Open user menu"
                      >
                        <Image
                          src={
                            userInfo?.image_url
                              ? userInfo?.image_url
                              : "/assets/profile.png"
                          }
                          alt="Profile Avatar"
                          className="rounded-full"
                          fill
                          objectFit="cover"
                        />
                      </button>
                    </div>
                  )}
                </div>

                {/* Dropdown  */}
                {showProfileDropdown && (
                  <div className="absolute right-0 top-14 z-40 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg">
                    <div className="block px-4 py-2 text-sm text-gray-700 border-b-2">
                      Welcome,{" "}
                      <span className="font-bold">{userInfo?.full_name}</span>
                    </div>
                    <Link
                      href={`/admin/${userInfo?.user_id}/profile`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setshowProfileDropdown((prev) => !prev);
                      }}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={logout_user}
                    >
                      Sign out
                    </Link>
                    <div
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setshowProfileDropdown((prev) => !prev);
                        dispatch(
                          setModalVisibility({ open: true, type: "delete" })
                        );
                      }}
                    >
                      Delete Profile
                    </div>
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
    <div className="flex flex-row gap-3 items-center">
      <span className="hidden sm:block w-24 h-4 bg-gray-300 rounded animate-pulse"></span>
      <div className="h-10 w-10 rounded-full bg-gray-300 animate-pulse"></div>
    </div>
  );
};
