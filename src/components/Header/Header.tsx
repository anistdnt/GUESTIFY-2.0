"use client";
import { ArrowUp, Bell, EnvelopeSimple, List, XCircle } from "@phosphor-icons/react/dist/ssr";
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
import { space } from "postcss/lib/list";
import Loadercomp from "../Loader/Loadercomp";

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
  // Get user data from Redux store
  const reduxUserData = useSelector(
    (state: RootState) => state.user_slice.userData
  );

  const [showProfileDropdown, setshowProfileDropdown] =
    useState<boolean>(false);
  const [showHamburger, setshowHamburger] = useState<boolean>(false);
  const [isLoggedIn, setisLoggedIn] = useState<boolean>(false);
  const [showNotification, setshowNotification] = useState<boolean>(false);
  const [userInfo, setuserInfo] = useState<UserInfo | null>(null);
  const [notifications, setNotifications] = useState<any[]>()
  const [loadingNotifications, setLoadingNotifications] = useState<boolean>(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [bulkActionLoading, setBulkActionLoading] = useState<"read" | "delete" | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);


  // const [isloading,setisloading] = useState<boolean>(false);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  //Sign-out function
  const logout_user = async () => {
    dispatch(setLoading({ loading: true }));
    const res: ApiReturn<any> = await api_caller<any>("GET", API.USER.LOGOUT);
    if (res.success) {
      // Close SSE connection when logging out
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      deleteCookie("authToken");
      setisLoggedIn(false);
      setshowProfileDropdown(false);
      setNotifications([]); // Clear notifications
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

  // useEffect(() => {
  //   if (hasCookie("authToken")) {
  //     setisLoggedIn(true);
  //   }
  // }, [pathname]);
  // notification api handler


  async function handleNotification(e: React.MouseEvent<HTMLButtonElement>) {
    setshowNotification((prev) => !prev);
    setshowProfileDropdown(false);

    // Only fetch notifications if we're opening the dropdown and there are no notifications yet
    // if (!showNotification && (!notifications || notifications.length === 0)) {
    //   await fetchAllNotifications();
    // }
  }

  const fetchAllNotifications = async () => {
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
  };


  const markNotificationAsRead = async (id: string) => {
    setActionLoadingId(id);
    try {
      const resData: ApiReturn<any> = await api_caller<any>("PATCH", `${API.NOTIFICATION.UPDATE_NOTIFICATION}/${id}`);
      if (resData.success) {
        toast.success(resData.message);
        // await fetchAllNotifications();
      } else {
        toast.error(resData.message);
      }
    } catch (error) {
      console.error("Error updating notification:", error);
    } finally {
      setActionLoadingId(null);
    }
  };


  const markAllNotificationsAsRead = async () => {
    setBulkActionLoading("read");
    try {
      const resData: ApiReturn<any> = await api_caller<any>("PUT", API.NOTIFICATION.UPDATE_NOTIFICATIONs);
      if (resData.success) {
        toast.success(resData.message);
        // await fetchAllNotifications();
      } else {
        toast.error(resData.message);
      }
    } catch (error) {
      console.error("Error updating all notifications:", error);
    } finally {
      setBulkActionLoading(null);
    }
  };


  const deleteNotification = async (id: string) => {
    setActionLoadingId(id);
    try {
      const resData: ApiReturn<any> = await api_caller<any>("DELETE", `${API.NOTIFICATION.DELETE_NOTIFICATION}/${id}`);
      if (resData.success) {
        toast.success(resData.message);
        // await fetchAllNotifications();
      } else {
        toast.error(resData.message);
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    } finally {
      setActionLoadingId(null);
    }
  };


  const deleteAllNotifications = async () => {
    setBulkActionLoading("delete");
    try {
      const resData: ApiReturn<any> = await api_caller<any>("DELETE", API.NOTIFICATION.DELETE_NOTIFICATIONS);
      if (resData.success) {
        toast.success(resData.message);
        // await fetchAllNotifications();
      } else {
        toast.error(resData.message);
      }
    } catch (error) {
      console.error("Error deleting all notifications:", error);
    } finally {
      setBulkActionLoading(null);
    }
  };




  // Setup SSE connection for real-time notifications
  const setupSSEConnection = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    if (!hasCookie("authToken")) return;

    const auth_token = getCookie("authToken");
    const device_token = getCookie("device_token");
    const baseUrl = (process.env.NEXT_PUBLIC_SERVER_URL || "").replace(/\/+$/, "");
    const apiPath = API.NOTIFICATION.ALL_NOTIFICATIONS.replace(/^\/+/, "");
    const sseUrl = `${baseUrl}/${apiPath}`;

    const eventSource = new EventSource(`${sseUrl}?auth_token=${auth_token}&device_token=${device_token}`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log("SSE connection established");
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data, "event update data")

        if (data.initialNotifications) {
          // Initial load of notifications
          setNotifications(data.initialNotifications);
        } else if (data.error) {
          toast.error(data.error);
        } else if (data.updateType) {
          switch (data.updateType) {
            case "all_deleted":
              // Remove all notifications whose _id is in batchIds from state
              setNotifications(prev => prev.filter(n => !data.batchIds.includes(n._id)));
              toast.success("All notifications deleted");
              break;

            case "all_read":
              // Mark notifications in batchIds as read
              setNotifications(prev => prev.map(n =>
                data.batchIds.includes(n._id) ? { ...n, isRead: true } : n
              ));
              toast.success("All notifications marked as read");
              break;

            case "deleted":
              // Remove single notification
              setNotifications(prev => prev.filter(n => n._id !== data.notification._id));
              toast.success("Notification deleted");
              break;

            case "updated":
            case "new":
              // Add or update a single notification
              const notif = data.notification ?? data.newNotification;
              setNotifications(prev => {
                if (!prev) return [notif];
                const exists = prev.find(n => n._id === notif._id);
                if (exists) {
                  return prev.map(n => n._id === notif._id ? notif : n);
                }
                return [notif, ...prev];
              });
              toast.success("Notification updated");
              break;

            default:
              // Unknown updateType, optionally ignore or log
              console.warn("Unknown SSE updateType:", data.updateType);
              break;
          }
        } else if (data.notification || data.newNotification) {
          // Fallback case if no updateType but notification present
          const newNotif = data.notification ?? data.newNotification;
          setNotifications(prev => {
            if (!prev) return [newNotif];
            if (prev.find(n => n._id === newNotif._id)) return prev;
            return [newNotif, ...prev];
          });
          toast.success("New notification received!");
        }
      } catch (error) {
        console.error("Error processing SSE message:", error);
      }
    };


    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      eventSource.close();
      eventSourceRef.current = null;
      setisLoggedIn(false);
    };
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
      // Setup SSE connection when user is logged in
      setupSSEConnection();
      // Initial fetch of notifications
      // fetchAllNotifications();
    }
    else {
      setisLoggedIn(false);

      // Close SSE connection when user logs out
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setNotifications([]);
    }

    // Cleanup function to close SSE connection when component unmounts
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
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
                
                {/* <div className="relative mt-2">
                  <button onClick={handleNotification} data-tooltip="Notifications" data-tooltip-pos="bottom">
                    <Bell size={24} weight="bold" className="cursor-pointer" />
                  </button>
                  {Array.isArray(notifications) && notifications.length > 0 && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>}
                </div> */}

                {/* Notification Dropdown  */}
                {showNotification && (
                  <div className="absolute right-1 top-14 z-10 mt-2 w-80 max-h-80 origin-top-right rounded-md bg-white py-1 shadow-lg">
                    <span className="px-4"> Notifications</span>
                    <ul className="border-t-[1px] border-black py-2  max-h-64 overflow-y-scroll">
                      {loadingNotifications ? (
                        Array(3)
                          .fill(0)
                          .map((_, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-4 px-4 py-3 animate-pulse text-sm text-gray-700"
                            >
                              <div className="h-6 w-6 bg-gray-300 rounded-full" />
                              <div className="h-4 bg-gray-300 rounded w-3/4" />
                            </li>
                          ))
                      ) : Array.isArray(notifications) && notifications.length > 0 ? (
                        notifications.map((notif: any, idx: number) => (
                          <li
                            key={idx}
                            className="flex flex-row gap-8 justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <span className={`flex flex-row items-start gap-2 ${!notif?.isRead ? "font-bold" : ""}`}>
                              {notif?.notification_type === "transactional" && (
                                <Bell className="bg-blue-400 p-1 h-7 w-7 text-white rounded-full" />
                              )}
                              {notif.message}
                            </span>
                            <div className="flex flex-row items-start gap-2 text-gray-400">
                              <EnvelopeSimple
                                size={24}
                                className={`cursor-pointer transition-colors duration-200 ${actionLoadingId === notif._id ? "opacity-50 pointer-events-none" : "hover:text-gray-600"}`}
                                onClick={() => markNotificationAsRead(notif._id)}
                              />
                              <XCircle
                                size={24}
                                className={`cursor-pointer transition-colors duration-200 ${actionLoadingId === notif._id ? "opacity-50 pointer-events-none" : "hover:text-gray-600"}`}
                                onClick={() => deleteNotification(notif._id)}
                              />

                              {actionLoadingId === notif._id && (
                                <div className="flex items-center justify-center ml-1">
                                  <Loadercomp size={16} />
                                </div>
                              )}


                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-gray-600 px-4 py-3 h-24 flex items-center justify-center w-full">
                          No Notifications to display
                        </li>
                      )}
                    </ul>

                    <div className="flex flex-row items-center justify-end h-10 gap-4 px-4">
                      <button
                        className="text-gray-500 hover:text-gray-800 flex items-center gap-1"
                        onClick={markAllNotificationsAsRead}
                        disabled={bulkActionLoading === "read"}
                      >
                        {bulkActionLoading === "read" ? (
                          <Loadercomp size={14} />
                        ) : (
                          "Read All"
                        )}
                      </button>

                      <button
                        className="text-gray-500 hover:text-gray-800 flex items-center gap-1"
                        onClick={deleteAllNotifications}
                        disabled={bulkActionLoading === "delete"}
                      >
                        {bulkActionLoading === "delete" ? (
                          <Loadercomp size={14} />
                        ) : (
                          "Clear All"
                        )}
                      </button>


                    </div>
                  </div>
                )}


                <div className="border-2" style={{ height: "3em" }}></div>

                {isLoggedIn ? (
                  <div>
                    {userInfo === null ? <Skeleton /> : <div
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