"use client";

import { useState } from "react";
import { Canvas } from "fabric";
import {
  TextTIcon,
  ShapesIcon,
  UploadSimpleIcon,
  FolderOpenIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";

import TextPanel from "./panel/TextPanel";
import ShapesPanel from "./panel/ShapesPanel";
import UploadPanel from "./panel/UploadPanel";
import SavedDesignsPanel from "./panel/SavedDesignsPanel";

import Image from "next/image";

const tabs = [
  { id: "text", label: "Text", icon: TextTIcon },
  { id: "shapes", label: "Shapes", icon: ShapesIcon },
  { id: "upload", label: "Upload", icon: UploadSimpleIcon },
  { id: "saved", label: "Saved", icon: FolderOpenIcon },
];

interface Props {
  canvas: Canvas | null;
  name: string;
  email?: string;
  token: string;
}

export default function Sidebar({ canvas, name, email, token }: Props) {
  const [tab, setTab] = useState("text");
  const [collapsed, setCollapsed] = useState(false);

  const Logo = "/new_logo.png";
  const DefaultUser = "/profile.png";

  // Replace with actual logged-in user
  const user = {
    name: name || "Test User",
    email: email || "test@guestify.in",
    avatar: DefaultUser,
  };

  return (
    <aside
      className={`bg-white border-r flex flex-col transition-all duration-300
        ${collapsed ? "w-16" : "w-72"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Image src={Logo} alt="Logo" width={150} height={70} className="object-contain" />
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-100"
        >
          {collapsed ? (
            <CaretRightIcon size={18} />
          ) : (
            <CaretLeftIcon size={18} />
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors
                ${
                  tab === t.id
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-50 text-gray-600"
                }`}
            >
              <Icon size={18} />
              {!collapsed && <span>{t.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Panel Content */}
      <div
        className={`flex-1 overflow-y-auto transition-all duration-300 p-4
          ${collapsed ? "hidden" : "block"}`}
      >
        {tab === "text" && <TextPanel canvas={canvas} />}
        {tab === "shapes" && <ShapesPanel canvas={canvas} />}
        {tab === "upload" && <UploadPanel canvas={canvas} />}
        {tab === "saved" && <SavedDesignsPanel canvas={canvas} />}
      </div>

      {/* User Section */}
      <div className="border-t p-3">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={user.avatar}
              alt="User Avatar"
              width={30}
              height={30}
              className="object-cover"
            />
          </div>
          {!collapsed && (
            <div className="text-sm">
              <p className="font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
