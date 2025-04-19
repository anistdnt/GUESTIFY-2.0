"use client";
import { ArrowUp, Bell, List } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteCookie, hasCookie } from "cookies-next/client";
import { CrudService } from "@/lib/crud_services";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { decodeToken } from "@/lib/decodeToken";

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

export default function Header() {
  const [showProfileDropdown, setshowProfileDropdown] =
    useState<boolean>(false);
  const [showHamburger, setshowHamburger] = useState<boolean>(false);
  const [isLoggedIn, setisLoggedIn] = useState<boolean>(false);
  const [showNotification,setshowNotification] = useState<boolean>(false);
  const [userInfo, setuserInfo] = useState<UserInfo | null>(null);
  // const [isloading,setisloading] = useState<boolean>(false);

  const pathname = usePathname();
  const router = useRouter();

  //Sign-out function
  const logout_user = async () => {
    try {
      // setisloading(true);
      const res = await CrudService.getAll("logoutUser");
      if (res.status === 200) {
        deleteCookie("authToken");
        setisLoggedIn(false);
        setshowProfileDropdown(false);
        router.push("/");
        toast.success(res.data?.message || "Loggged out successfully");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || "Something went wrong");
      }
    } finally {
      // setisloading(false);
    }
  };

  useEffect(() => {
    if (hasCookie("authToken")) {
      setisLoggedIn(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (hasCookie("authToken")) {
      const user_info_fromToken = decodeToken("authToken");

      console.log("Header input",user_info_fromToken);
      
      setuserInfo({
        user_id: user_info_fromToken.user_id,
        first_name: user_info_fromToken.first_name,
        last_name: user_info_fromToken.last_name,
        full_name : user_info_fromToken.first_name + " " + user_info_fromToken.last_name,
        email: user_info_fromToken.email,
        image_url: user_info_fromToken.image_url,
      });
    }
  }, [isLoggedIn,pathname]);

  return (
    <header className="sticky z-50 top-0">
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
                    className={`text-sm ${
                      item.href === pathname ? "font-semibold" : ""
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

                <Bell size={24} weight="bold" onClick={()=>{setshowNotification((prev)=>!prev);setshowProfileDropdown(false)}} className="cursor-pointer"/>

                {/* Notification Dropdown  */}
                {showNotification && <div className="absolute left-0 top-14 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg">
                  <ul>
                    <li className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hello</li>
                    <li className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hello</li>
                    <li className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hello</li>
                  </ul>
                  </div>}

                <div className="border-2" style={{height : "3em"}}></div>

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
                      className="relative flex rounded-full text-sm border border-gray-500"
                      aria-label="Open user menu"
                    >
                      <img
                        alt="profile-picture"
                        src={userInfo?.image_url ? userInfo?.image_url : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                        className="h-10 w-10 rounded-full"
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
                    <div className="block px-4 py-2 text-sm text-gray-700 border-b-2">Welcome, <span className="font-bold">{userInfo?.full_name}</span></div>
                    <Link
                      href="/profile"
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
            className={`sm:hidden ${
              showHamburger
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
