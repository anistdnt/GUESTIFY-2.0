"use client";

import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { ExtensionResponseType } from "@/types/admin";
import { ArrowSquareOutIcon, CloudArrowDownIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {getCookie} from "cookies-next/client";

type Props = {
  extension: ExtensionResponseType;
  fetchExtensions: () => Promise<void>;
};

function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg
      className="animate-spin"
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}


export default function Card({ extension, fetchExtensions }: Props) {
  const [loading, setLoading] = useState<boolean>(false);

  async function handleInstall(extension_id: string) {
    setLoading(true);
    try {
      const url = API.ADMIN.EXTENSIONS.INSTALL.replace(":ext_id", extension_id);

      const res: ApiReturn<any> = await api_caller("PATCH", url);

      if (res.success) {
        toast.success("Extension installed");
        await fetchExtensions();
      } else {
        throw new Error(res.message || "Failed to install extension");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUnInstall(extension_id: string) {
    setLoading(true);
    try {
      const url = API.ADMIN.EXTENSIONS.UNINSTALL.replace(
        ":ext_id",
        extension_id
      );

      const res: ApiReturn<any> = await api_caller("PATCH", url);

      if (res.success) {
        toast.success("Extension uninstalled");
        await fetchExtensions();
      } else {
        throw new Error(res.message || "Failed to uninstall extension");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="relative flex flex-col sm:flex-row w-full rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500 group">
        {/* Image Section */}
        <div className="relative w-full sm:w-1/3 aspect-[4/3] sm:aspect-auto overflow-hidden">
          <Image
            src={extension.image_url}
            alt={extension.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
            <div className="text-[10px] font-bold text-white uppercase tracking-widest bg-white/20 backdrop-blur-md rounded-lg px-2 py-1">
              Active Module
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-0.5">
                  {extension.category}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  v{extension.version}
                </span>
              </div>
            </div>

            <h4 className="text-xl font-bold text-gray-900 font-display mb-2 group-hover:text-primary-600 transition-colors">
              {extension.name}
            </h4>
            
            <p className="text-sm text-gray-500 font-jakarta leading-relaxed line-clamp-2">
              {extension.description}
            </p>
          </div>

          <div className="flex justify-end items-center gap-3 pt-6">
            {extension.is_installed ? (
              <>
                <button
                  disabled={loading}
                  onClick={() => handleUnInstall(extension._id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 border
                    ${loading
                      ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                      : "bg-white border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 active:scale-95"
                    }`}
                >
                  {loading && <Spinner size={12} />}
                  {loading ? "Uninstalling..." : "Uninstall"}
                </button>
                <Link
                  href={`${process.env.NEXT_PUBLIC_EXTENSION_REDIRECT_URL}/${extension?.slug}?token=${getCookie("authToken") || ""}`}
                  target="_blank"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-all duration-300 active:scale-95 flex items-center gap-2"
                >
                  <span>Launch Extension</span>
                  <ArrowSquareOutIcon size={16} weight="bold" />
                </Link>
              </>
            ) : (
              <button
                disabled={loading}
                onClick={() => handleInstall(extension._id)}
                className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2
                  ${loading
                    ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                    : "bg-primary-600 text-white hover:bg-primary-700 shadow-[0_10px_30px_rgba(37,99,235,0.2)]"
                  }`}
              >
                {loading ? <Spinner size={14} /> : <CloudArrowDownIcon size={18} weight="bold" />}
                {loading ? "Installing..." : "Install Extension"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
