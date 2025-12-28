"use client";

import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { ExtensionResponseType } from "@/types/admin";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  extension: ExtensionResponseType;
  fetchExtensions: () => Promise<void>;
};

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
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <img
        src={extension.image_url}
        alt={extension.name}
        className="w-full h-40 object-cover rounded-md"
      />

      <div className="mt-3 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">
          {extension.name}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-3">
          {extension.description}
        </p>

        <div className="flex justify-between items-center pt-3">
          <span className="text-xs text-gray-500">
            Version {extension.version}
          </span>

          {/* Install / Uninstall Button */}
          {extension.is_installed ? (
            <div className="flex justify-center items-center gap-2">
              <button
                disabled={loading}
                onClick={() => handleUnInstall(extension._id)}
                className={`px-3 py-1 text-sm rounded-md border transition
                ${
                  loading
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "border-red-500 text-red-600 hover:bg-red-50"
                }`}
              >
                {loading ? "Uninstalling..." : "Uninstall"}
              </button>
              <Link
                href={`${process.env.NEXT_PUBLIC_EXTENSION_REDIRECT_URL}/extension/${extension?.slug}?token=${'abcd'}`}
                target="_blank"
                className={`px-3 py-1 text-sm rounded-md border transition text-gray-300 bg-gray-600`}
              >
                Explore
              </Link>
            </div>
          ) : (
            <button
              disabled={loading}
              onClick={() => handleInstall(extension._id)}
              className={`px-3 py-1 text-sm rounded-md border transition
                ${
                  loading
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "border-green-600 text-green-600 hover:bg-green-50"
                }`}
            >
              {loading ? "Installing..." : "Install"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
