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
    <div className="flex min-h-screen items-start justify-center">
      <div className="relative flex w-full max-w-[48rem] flex-row rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
        <div className="relative m-0 w-2/5 shrink-0 overflow-hidden rounded-xl rounded-r-none bg-white bg-clip-border text-gray-700">
          <Image
            src={extension.image_url}
            alt={extension.name}
            fill
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-6">
          <h6 className="mb-4 font-sans text-base font-semibold uppercase leading-relaxed tracking-normal text-yellow-800 antialiased flex flex-col">
            <span>{extension.category}</span>
            <span className="text-xs text-gray-500">
              Version {extension.version}
            </span>
          </h6>
          <h4 className="mb-2 block font-sans text-2xl font-semibold text-gray-700 leading-snug tracking-normal text-blue-gray-900 antialiased">
            {extension.name}
          </h4>
          <p className="mb-8 block font-sans font-normal text-sm leading-relaxed text-gray-600 antialiased">
            {extension.description?.substring(0, 150)}...
          </p>
          <div className="flex justify-end items-center pt-3">
            {/* Install / Uninstall Button */}
            {extension.is_installed ? (
              <div className="flex justify-center items-center gap-2">
                <button
                  disabled={loading}
                  onClick={() => handleUnInstall(extension._id)}
                  className={`px-3 py-2 text-sm rounded-md border transition flex justify-center items-center gap-2
                ${
                  loading
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "border-red-500 text-red-600 hover:bg-red-600 hover:text-white"
                }`}
                >
                  {loading && <Spinner size={14} />}
                  {loading ? "Uninstalling..." : "Uninstall"}
                </button>
                <Link
                  href={`${
                    process.env.NEXT_PUBLIC_EXTENSION_REDIRECT_URL
                  }/${extension?.slug}?token=${getCookie("authToken") || ""}`}
                  target="_blank"
                  className={`px-3 py-2 text-sm rounded-md border transition text-white bg-yellow-700 flex justify-center items-center gap-2 hover:bg-yellow-800 hover:text-white`}
                >
                  <span>Explore</span><ArrowSquareOutIcon size={20} />
                </Link>
              </div>
            ) : (
              <button
                disabled={loading}
                onClick={() => handleInstall(extension._id)}
                className={`px-3 py-2 text-sm rounded-md border transition flex justify-center items-center gap-2
                ${
                  loading
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "border-yellow-700 text-yellow-700 hover:bg-yellow-700 hover:text-white"
                }`}
              >
                {loading ? <Spinner size={14} /> : <CloudArrowDownIcon size={20} />}
                {loading ? "Installing..." : "Install"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
