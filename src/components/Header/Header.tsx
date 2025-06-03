"use client";
import { ArrowUp, Bell, EnvelopeSimple, List, XCircle } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteCookie, hasCookie } from "cookies-next/client";
import toast from "react-hot-toast";
import { decodeToken } from "@/lib/decodeToken";
import { useDispatch } from "react-redux";
import { setToken } from "@/redux/slices/userSlice";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { setLoading } from "@/redux/slices/loaderSlice";

const navigation: {
  name: string;
  href: string;
}[] = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact Us", href: "/contact" },
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

  const [showProfileDropdown, setshowProfileDropdown] =
    useState<boolean>(false);
  const [showHamburger, setshowHamburger] = useState<boolean>(false);
  const [isLoggedIn, setisLoggedIn] = useState<boolean>(false);
  const [showNotification, setshowNotification] = useState<boolean>(false);
  const [userInfo, setuserInfo] = useState<UserInfo | null>(null);
  const [notifications, setNotifications] = useState<any[]>()
  const [loadingNotifications, setLoadingNotifications] = useState<boolean>(false);

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
      setisLoggedIn(false);
      setshowProfileDropdown(false);
      router.push("/");
      toast.success(res.message || "Loggged out successfully");
    } else {
      toast.error(`${res.message} : ${res.error}`);
    }
    dispatch(setLoading({ loading: false }));
  };

  // notification api handler
  async function handleNotification(e: React.MouseEvent<HTMLButtonElement>) {
    setshowNotification((prev) => !prev);
    setshowProfileDropdown(false);

    if (!showNotification) {
      setLoadingNotifications(true);

      try {
        const resData: ApiReturn<any> = await api_caller<any>(
          "GET",
          API.NOTIFICATION.ALL_NOTIFICATIONS
        );
        console.log(resData);
        setNotifications(resData?.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoadingNotifications(false);
      }
    }
  }


  useEffect(() => {
    if (hasCookie("authToken")) {
      setisLoggedIn(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (hasCookie("authToken")) {
      const user_info_fromToken = decodeToken("authToken");

      dispatch(setToken("authToken"));


      setuserInfo({
        user_id: user_info_fromToken.user_id,
        first_name: user_info_fromToken.first_name,
        last_name: user_info_fromToken.last_name,
        full_name: user_info_fromToken.first_name + " " + user_info_fromToken.last_name,
        email: user_info_fromToken.email,
        image_url: user_info_fromToken.image_url,
      });
    }
  }, [isLoggedIn, pathname]);

  useEffect(() => {
    console.log(userInfo?.image_url)
  }, [userInfo])

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
                <div className="relative">
                  <button onClick={handleNotification}>
                    <Bell size={24} weight="bold" className="cursor-pointer" />
                  </button>
                  {Array.isArray(notifications) && notifications.length > 0 && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>}
                </div>

                {/* Notification Dropdown  */}
                {showNotification && (
                  <div className="absolute right-1 top-14 z-10 mt-2 w-80 max-h-80 origin-top-right rounded-md bg-white py-1 shadow-lg">
                    <span className="px-4"> Notifications</span>
                    <ul className="border-t-[1px] border-black max-h-64 overflow-y-scroll py-2">
                      {loadingNotifications ? (
                        Array(3)
                          .fill(0)
                          .map((_, idx) => (
                            <li
                              key={idx}
                              className="px-4 py-2 animate-pulse text-sm text-gray-700"
                            >
                              <div className="h-4 bg-gray-300 rounded w-full"></div>
                            </li>
                          ))
                      ) : (
                        Array.isArray(notifications) && notifications.map((notif: any, idx: number) => (
                          <li
                            key={idx}
                            className="flex flex-row gap-8 justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <span className={` ${!notif?.isRead ? "font-bold" : ""} flex flex-row items-start gap-2`}>

                              {notif?.notification_type === "transactional" ? <Bell className="bg-blue-400 p-1 h-7 w-7 text-white rounded-full" /> : <></>}{notif.message}
                            </span>
                            <div className="flex flex-row items-start gap-2 text-gray-400">
                              <EnvelopeSimple className="hover:text-gray-600" size={24} />
                              <XCircle className="hover:text-gray-600" size={24} />
                            </div>
                          </li>

                        ))
                      )}
                    </ul>
                    <div className="flex flex-row items-center justify-end h-10 gap-4 px-4">
                      <button className="text-gray-500 hover:text-gray-800">Read All</button>
                      <button className="text-gray-500 hover:text-gray-800">Clear All</button>
                    </div>
                  </div>
                )}


                <div className="border-2" style={{ height: "3em" }}></div>

                {isLoggedIn ? (
                  <div
                    className="flex flex-row justify-center items-center gap-3 cursor-pointer"
                    onClick={() => {
                      setshowProfileDropdown((prev) => !prev);
                      setshowNotification(false);
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
                  </div>
                ) : (
                  <div className="hidden sm:block">
                    <Link href="/login">
                      <button className="bg-buttons text-white font-semibold text-sm px-4 py-2 rounded-lg">
                        Login/Sign-Up
                      </button>
                    </Link>
                  </div>
                )}

                {/* Dropdown  */}
                {showProfileDropdown && (
                  <div className="absolute right-0 top-14 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg">
                    <div className="block px-4 py-2 text-sm text-gray-700 border-b-2">
                      Welcome,{" "}
                      <span className="font-bold">{userInfo?.full_name}</span>
                    </div>
                    <Link
                      href={`/profile/${userInfo?.user_id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setshowProfileDropdown((prev) => !prev);
                      }}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setshowProfileDropdown((prev) => !prev);
                      }}
                    >
                      Settings
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={logout_user}
                    >
                      Sign out
                    </Link>
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
