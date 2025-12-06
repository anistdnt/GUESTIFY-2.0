"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "@/components/Header/admin/Topbar";
import Link from "next/link";
import Image from "next/image";
import { deleteCookie, hasCookie, getCookie } from "cookies-next/client";
import toast from "react-hot-toast";
import { decodeToken } from "@/lib/decodeToken";
import { setToken, setUserData } from "@/redux/slices/userSlice";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { setLoading } from "@/redux/slices/loaderSlice";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { UserInfo } from "@/types/admin";
import { useParams, usePathname, useRouter } from "next/navigation";
import path from "path";

type Props = {
  children: React.ReactNode;
};

export default function AdminLayoutComponent({ children }: Props) {
  // Get user data from Redux store
  const reduxUserData = useSelector(
    (state: RootState) => state.user_slice.userData
  );

  const [isLoggedIn, setisLoggedIn] = useState<boolean>(false);
  const [userInfo, setuserInfo] = useState<UserInfo | null>(null);

  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const tabValue = pathname.split("/")[3];

  //Sign-out function
  const logout_user = async () => {
    dispatch(setLoading({ loading: true }));
    const res: ApiReturn<any> = await api_caller<any>("GET", API.USER.LOGOUT);
    if (res.success) {
      deleteCookie("authToken");
      dispatch(setUserData({}));
      setuserInfo(null);
      setisLoggedIn(false);
      router.push("/login");
      toast.success(res.message || "Logged out successfully");
    } else {
      toast.error(`${res.message} : ${res.error}`);
    }
    dispatch(setLoading({ loading: false }));
  };

  // Fetching user details and store to cookie
  const fetcheUserProfile = async (uid: any) => {
    const res: ApiReturn<any> = await api_caller<any>(
      "GET",
      `${API.USER.INFO}/${uid}`
    );
    if (res.success) {
      dispatch(setUserData(res?.data));
      // console.log(res?.data)
    } else {
      toast.error(`${res.message} : ${res.error}`);
    }
  };

  useEffect(() => {
    if (hasCookie("authToken")) {
      if (Object.keys(reduxUserData).length !== 0) {
        // console.log(reduxUserData);
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
    } else {
      setisLoggedIn(false);
    }
    dispatch(setLoading({ loading: false }));
  }, [isLoggedIn, pathname, reduxUserData]);

  return (
    <div>
      {/* Sidebar - Always visible */}
      <div className="fixed left-0 top-0 w-64 h-full bg-white p-4 z-40 shadow-[2px_0_10px_rgba(0,0,0,0.12)]">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src={"/assets/logo-bg-removed.png"}
            alt="Logo"
            width={130}
            height={50}
            loading="eager"
          />
        </Link>

        <Sidebar
          userInfo={userInfo}
          isLoggedIn={isLoggedIn}
          logout_user={logout_user}
        />
      </div>

      {/* Main Content with Header */}
      <div className="ml-64 min-h-screen bg-gray-200">
        {/* Header */}
        <Topbar
          userInfo={userInfo}
          isLoggedIn={isLoggedIn}
          logout_user={logout_user}
          tabValue={tabValue}
        />

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
