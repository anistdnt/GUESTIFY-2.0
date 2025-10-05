"use client";
import { ArrowUp, List } from "@phosphor-icons/react/dist/ssr";
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
import { setModalVisibility } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import Notification from "./Notification";
import Noti from "./Noti";

const navigation: {
  name: string;
  href: string;
}[] = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Terms & Services", href: "/terms-and-services" },
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

// interface HeaderProps {
//   notification_response: ApiReturn<GetNotification_Type>;
// }

export default function Header() {
  // Get user data from Redux store
  const reduxUserData = useSelector(
    (state: RootState) => state.user_slice.userData
  );

  const [showProfileDropdown, setshowProfileDropdown] =
    useState<boolean>(false);
  const [showHamburger, setshowHamburger] = useState<boolean>(false);
  const [isLoggedIn, setisLoggedIn] = useState<boolean>(false);
  const [userInfo, setuserInfo] = useState<UserInfo | null>(null);

  // const [isloading,setisloading] = useState<boolean>(false);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  //Sign-out function
  const logout_user = async () => {
    dispatch(setLoading({ loading: true }));
    const res: ApiReturn<any> = await api_caller<any>("GET", API.USER.LOGOUT);
    if (res.success) {
      deleteCookie("authToken");
      dispatch(setUserData({}));
      setuserInfo(null);
      setisLoggedIn(false);
      setshowProfileDropdown(false);
      router.push("/");
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
      dispatch(setUserData(res?.data[0]));
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
    }
    else {
      setisLoggedIn(false);
    }
    dispatch(setLoading({ loading: false }));
  }, [isLoggedIn, pathname, reduxUserData]);

  return (
    <header className="sticky z-40 top-0">
      <nav className="bg-white">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button */}
              <button
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                aria-label="Open main menu"
                onClick={() => {
                  setshowHamburger((prev) => !prev);
                }}
              >
                {showHamburger ? <ArrowUp size={32} /> : <List size={32} />}
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center gap-8 sm:items-stretch sm:justify-start">
              <Link href="/" className="flex shrink-0 items-center">
                <Image
                  src={"/assets/new_logo.png"}
                  alt="Logo"
                  width={130}
                  height={50}
                  loading="eager"
                />
              </Link>
              <div className="hidden sm:flex flex-row justify-center items-center space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-sm ${item.href === pathname ? "font-semibold" : ""
                      }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* Profile dropdown */}
              <div className="relative ml-3 flex justify-center items-center gap-5">
                {/* Login or Signup section and Profile Section  */}
                
                
                {/* <Notification/> */}
                {userInfo?.user_id && <Noti user_id={userInfo?.user_id}/>}

                <div className="border-2" style={{ height: "3em" }}></div>

                {isLoggedIn ? (
                  <div>
                    {userInfo === null ? <Skeleton /> : <div
                      className="flex flex-row justify-center items-center gap-3 cursor-pointer"
                      onClick={() => {
                        setshowProfileDropdown((prev) => !prev);
                      }}
                    >
                      <span className="text-gray-700 text-sm hidden sm:block font-semibold">
                        {userInfo?.full_name}
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
                    </div>}
                  </div>
                ) : (
                  <div className="hidden sm:block">
                    <Link href="/login">
                      <button className="bg-buttons hover:bg-buttonsHover text-white font-semibold text-sm px-4 py-2 rounded-lg">
                        Login/Sign-Up
                      </button>
                    </Link>
                  </div>
                )}

                {/* Dropdown  */}
                {showProfileDropdown && (
                  <div className="absolute right-0 top-14 z-40 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg">
                    <div className="block px-4 py-2 text-sm text-gray-700 border-b-2">
                      Welcome,{" "}
                      <span className="font-bold">{userInfo?.full_name}</span>
                    </div>
                    <Link
                      href={`/profile/${userInfo?.user_id}`}
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

        {showHamburger && (
          <div
            className={`sm:hidden ${showHamburger
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
              } transition-opacity duration-300`}
          >
            <div className="flex flex-col gap-3 space-y-1 px-2 pb-3 pt-2">
              {isLoggedIn ? (
                <p>Welcome, Username</p>
              ) : (
                <div>
                  <Link href="/login">
                    <button className="bg-buttons text-white font-semibold text-sm px-4 py-2 rounded-lg">
                      Login/Sign-Up
                    </button>
                  </Link>
                </div>
              )}
              <hr />
              {navigation.map((item) => (
                <Link className="text-sm" key={item.name} href={item.href}>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
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
}