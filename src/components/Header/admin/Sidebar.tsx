"use client";

import { setModalVisibility } from "@/redux/slices/modalSlice";
import { NavItemsType, UserInfo } from "@/types/admin";
import { BuildingApartment, HouseLine, SignOut, Trash, UserCircle } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";

interface Props {
  userInfo: UserInfo | null;
  isLoggedIn: boolean;
  logout_user: () => Promise<void>;
}

export default function Sidebar({ userInfo, isLoggedIn, logout_user }: Props) {
  const pathname = usePathname();
  const dispatch = useDispatch();

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
        iconEle: <HouseLine size={20} className="me-2"/>,
      },
      {
        title: "My Profile",
        path: `/admin/${userInfo.user_id}/profile`,
        iconEle: <UserCircle size={22} className="me-2"/>,
      },
      {
        title: "My Enlisted PGs",
        path: `/admin/${userInfo.user_id}/mypg`,
        iconEle: <BuildingApartment size={20} className="me-2" />,
      },
      {
        title: "Bookings",
        path: `/admin/${userInfo.user_id}/bookings`,
        iconEle: <BuildingApartment size={20} className="me-2" />,
      },
    ],
    account: [
      {
        title: "Sign Out",
        path: "", // No path, handled by onClick
        iconEle: <SignOut size={20} className="me-2"/>,
        onClick: logout_user,
      },
      {
        title: "Delete Account",
        path: "", // No path, handled by onClick
        iconEle: <Trash size={20} className="me-2"/>,
        onClick: handleDeleteAccount,
        class: "text-red-500 hover:text-red-600",
      },
    ],
    extensions: [
      {
        title: "Coming Soon",
        path: "#",
        icon: "fas fa-puzzle-piece",
        disabled: true,
      },
    ],
  };

  return (
    <ul className="mt-4">
      {Object.keys(NAVITEMS).map((sectionKey) => {
        const section = NAVITEMS[sectionKey];
        return (
          <div key={sectionKey} className="flex flex-col gap-1 mb-1">
            {section.length > 0 && (
              <span className="text-gray-400 font-bold text-xs uppercase mb-2 block">
                {sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}
              </span>
            )}

            <hr className="border-gray-400"/>

            {section.map((item, idx) => (
              <li key={idx} className="mb-1">
                {item.disabled ? (
                  <div className="flex justify-start font-semibold items-center py-2 px-4 text-gray-400 cursor-not-allowed rounded-md">
                    <i className={`${item.icon} text-base mr-3`}></i>
                    <span className="text-sm">{item.title}</span>
                  </div>
                ) : item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className={`flex font-semibold items-center w-full py-2 px-4 rounded-md transition-all text-gray-600 hover:text-yellow-600 ${item?.class ? item?.class : ''}`}
                  >
                    {item?.iconEle ? item.iconEle : <i className={`${item.icon} text-base mr-3`}></i>}
                    <span className="text-sm">{item.title}</span>
                  </button>
                ) : (
                  <Link
                    href={item.path}
                    className={`flex font-semibold items-center py-2 px-4 rounded-md transition-all text-gray-600 ${item?.class ? item?.class : ''} ${
                      pathname === item?.path
                        ? "bg-yellow-600 text-white"
                        : `hover:text-yellow-600`
                    }`}
                  >
                    {item?.iconEle ? item.iconEle : <i className={`${item.icon} text-base mr-3`}></i>}
                    <span className="text-sm">{item.title}</span>
                  </Link>
                )}
              </li>
            ))}
          </div>
        );
      })}
    </ul>
  );
}

/* ---------------- Sidebar Skeleton ---------------- */

function SidebarSkeleton() {
  return (
    <ul className="mt-4 space-y-4 animate-pulse">
      {/* Section 1 */}
      <div className="flex flex-col gap-2">
        <span className="block h-3 w-1/2 bg-gray-300 rounded"></span>
        {Array(3)
          .fill(0)
          .map((_, idx) => (
            <li key={idx} className="h-8 bg-gray-300 rounded-md w-full"></li>
          ))}
      </div>

      {/* Section 2 */}
      <div className="flex flex-col gap-2">
        <span className="block h-3 w-1/3 bg-gray-300 rounded"></span>
        {Array(2)
          .fill(0)
          .map((_, idx) => (
            <li key={idx} className="h-8 bg-gray-300 rounded-md w-full"></li>
          ))}
      </div>

      {/* Section 3 */}
      <div className="flex flex-col gap-2">
        <span className="block h-3 w-1/4 bg-gray-300 rounded"></span>
        <li className="h-8 bg-gray-300 rounded-md w-full"></li>
      </div>
    </ul>
  );
}
