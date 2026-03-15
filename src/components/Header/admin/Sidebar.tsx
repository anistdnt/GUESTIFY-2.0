"use client";
import { setModalVisibility } from "@/redux/slices/modalSlice";
import { NavItemsType, UserInfo } from "@/types/admin";
import { MagnetIcon, PuzzlePieceIcon, Receipt } from "@phosphor-icons/react";
import {
  BuildingApartment,
  CaretDown,
  Compass,
  HouseLine,
  PlusCircle,
  SignOut,
  Trash,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

interface Props {
  userInfo: UserInfo | null;
  isLoggedIn: boolean;
  logout_user: () => Promise<void>;
}

export default function Sidebar({ userInfo, isLoggedIn, logout_user }: Props) {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (title: string) => {
    setOpenAccordion(openAccordion === title ? null : title);
  };

  if (!userInfo) {
    return <SidebarSkeleton />;
  }

  const handleDeleteAccount = () => {
    dispatch(setModalVisibility({ open: true, type: "delete" }));
  };

  const NAVITEMS: Record<string, NavItemsType[]> = {
    menu: [
      {
        title: "Dashboard",
        path: `/admin/${userInfo.user_id}/dashboard`,
        iconEle: <HouseLine size={20} />,
      },
      {
        title: "Discover PGs",
        iconEle: <Compass size={20} />,
        children: [
          {
            title: "My Enlisted PGs",
            path: `/admin/${userInfo.user_id}/mypg`,
            iconEle: <BuildingApartment size={18} />,
          },
          {
            title: "Add New PG",
            path: `/admin/${userInfo.user_id}/pg/new`,
            iconEle: <PlusCircle size={18} />,
          },
        ],
      },
      {
        title: "Bookings",
        path: `/admin/${userInfo.user_id}/bookings`,
        iconEle: <BuildingApartment size={20} />,
      },
      {
        title: "Payments",
        path: `/admin/${userInfo.user_id}/payments`,
        iconEle: <Receipt size={20} />
      }
    ],
    tools: [
      {
        title: "Attractions",
        path: `/admin/${userInfo.user_id}/tools/attractions`,
        iconEle: <MagnetIcon size={20} />
      },
      {
        title: "Extensions",
        path: `/admin/${userInfo.user_id}/tools/extensions`,
        iconEle: <PuzzlePieceIcon size={20} />
      }
    ],
    account: [
      {
        title: "My Profile",
        path: `/admin/${userInfo.user_id}/profile`,
        iconEle: <UserCircle size={20} />,
      },
      {
        title: "Sign Out",
        iconEle: <SignOut size={20} />,
        onClick: logout_user,
      },
      {
        title: "Delete Account",
        iconEle: <Trash size={20} />,
        onClick: handleDeleteAccount,
        disabled: true,
        class: "text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed",
      },
    ],
  };

  return (
    <div className="flex flex-col h-full bg-white px-4 py-6">
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-8">
        {Object.keys(NAVITEMS).map((sectionKey) => {
          const section = NAVITEMS[sectionKey];
          return (
            <div key={sectionKey} className="flex flex-col gap-2">
              {section.length > 0 && (
                <span className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-2 px-3">
                  {sectionKey}
                </span>
              )}

              <ul className="space-y-1.5">
                {section.map((item, idx) => {
                  const isActive = pathname === item.path || (item.children?.some(child => pathname === child.path));
                  
                  return (
                    <li key={idx}>
                      {item.children ? (
                        <div className="flex flex-col">
                          <button
                            onClick={() => toggleAccordion(item.title)}
                            className={`flex justify-between items-center w-full py-3 px-4 rounded-xl font-bold font-jakarta text-sm transition-all duration-300 ${
                              isActive || openAccordion === item.title
                                ? "bg-primary-50 text-primary-600 shadow-sm"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={isActive || openAccordion === item.title ? "text-primary-600" : "text-gray-400"}>
                                {item.iconEle}
                              </span>
                              <span>{item.title}</span>
                            </div>
                            <CaretDown 
                              size={14} 
                              weight="bold" 
                              className={`transition-transform duration-300 ${
                                openAccordion === item.title ? "rotate-180" : ""
                              }`} 
                            />
                          </button>

                          {openAccordion === item.title && (
                            <div className="mt-1.5 ml-4 pl-4 border-l-2 border-primary-100 flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-300">
                              {item.children.map((child, cidx) => {
                                const isChildActive = pathname === child.path;
                                return child.path ? (
                                  <Link
                                    key={cidx}
                                    href={child.path}
                                    className={`flex items-center gap-3 py-2.5 px-4 rounded-xl font-bold font-jakarta text-xs tracking-wide transition-all duration-300 ${
                                      isChildActive
                                        ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                  >
                                    <span className={isChildActive ? "text-white" : "text-gray-400"}>
                                      {child?.iconEle}
                                    </span>
                                    <span>{child.title}</span>
                                  </Link>
                                ) : (
                                  <button
                                    key={cidx}
                                    onClick={child.onClick}
                                    className="flex items-center gap-3 py-2.5 px-4 rounded-xl font-bold font-jakarta text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all duration-300"
                                  >
                                    <span className="text-gray-400">
                                      {child?.iconEle}
                                    </span>
                                    <span>{child.title}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ) : item.onClick ? (
                        <button
                          disabled={item.disabled || false}
                          onClick={item.onClick}
                          className={`flex items-center gap-3 w-full py-3 px-4 rounded-xl font-bold font-jakarta text-sm transition-all duration-300 ${
                            item?.class || "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <span className="text-gray-400 group-hover:text-gray-900">
                            {item?.iconEle}
                          </span>
                          <span>{item.title}</span>
                        </button>
                      ) : (
                        <Link
                          href={item.path!}
                          className={`flex items-center gap-3 py-3 px-4 rounded-xl font-bold font-jakarta text-sm transition-all duration-300 ${
                            isActive
                              ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <span className={isActive ? "text-white" : "text-gray-400 group-hover:text-gray-900"}>
                            {item?.iconEle}
                          </span>
                          <span>{item.title}</span>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      
      {/* Sidebar Footer Info - Static */}
      <div className="pt-6 border-t border-gray-100 bg-white">
        <div className="bg-gray-300 rounded-2xl p-4 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary-600/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-[10px] font-bold text-gray-800 uppercase tracking-widest mb-1 relative z-10">Accomodation Owner</p>
          <p className="text-white text-xs font-bold relative z-10">v2.4.0 <span className="text-primary-400 ml-1">Premium Edition</span></p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Sidebar Skeleton ---------------- */

function SidebarSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white px-4 py-8 space-y-10 animate-pulse">
      <div className="space-y-6">
        {[1, 2, 3].map((section) => (
          <div key={section} className="space-y-3">
            <div className="h-2 w-20 bg-gray-100 rounded-full ml-3 mb-4"></div>
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-10 bg-gray-50 rounded-xl w-full"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
