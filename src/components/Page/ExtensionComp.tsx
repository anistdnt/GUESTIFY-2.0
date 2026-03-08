"use client";

import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { AttractionPlace, ExtensionResponseType } from "@/types/admin";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), {
  ssr: false,
});
import NoDataFound from "../NoDataFound/NoDataFound";
import { AttractionCard } from "../Attraction/AttractionCard";
import { AttractionSkeleton } from "../Attraction/Skeleton";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSuccess,
  setModalVisibility,
  triggerRefetch,
} from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import Card from "../Extensions/Card";

export default function ExtensionComp() {
  const [loading, setLoading] = useState<boolean>(false);
  const [extensions, setExtensions] = useState<ExtensionResponseType[]>([]);

  const dispatch = useDispatch();

  async function fetchExtensions() {
    setLoading(true);
    try {
      let url = `${API.ADMIN.EXTENSIONS.LIST}`;
      const res: ApiReturn<ExtensionResponseType[]> = await api_caller<any>("GET", url);
      if (res.success) {
        setExtensions(res?.data || []);
      } else {
        throw new Error(res?.message || "Failed to fetch data");
      }
    } catch (error) {
      setExtensions([]);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchExtensions();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Cinematic Heading Banner */}
      <div className="relative overflow-hidden bg-white rounded-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 group">
        {/* Decorative Background Element */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-50 rounded-full blur-3xl group-hover:bg-primary-100/50 transition-colors duration-700"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-[10px] font-bold uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-pulse"></span>
              Modular Ecosystem
            </div>
            <h1 className="text-gray-400 font-medium text-lg font-jakarta leading-none">
              View and
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-display tracking-tight">
              Explore the <span className="text-primary-600">Extensions</span>
            </h2>
            <p className="text-gray-500 max-w-2xl font-jakarta text-sm leading-relaxed pt-2">
              Empower your platform with modular extensions designed to streamline operations, enhance communication, and optimize your property management workflow.
            </p>
          </div>
          
          <div className="hidden lg:block text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Available Modules</p>
            <p className="text-3xl font-bold text-gray-900 font-display">{extensions.length}</p>
          </div>
        </div>
      </div>

      <div>

        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <AttractionSkeleton key={i} />
              ))}
            </div>
          ) : extensions?.length === 0 ? (
            <NoDataFound text="No Extensions are Enlisted" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {extensions?.map((extension: ExtensionResponseType) => (
                <Card key={extension._id} extension={extension} fetchExtensions={fetchExtensions}/>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
