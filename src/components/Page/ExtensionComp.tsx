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
      <div>
        <h1 className="text-gray-500">
          <span>View and </span> <br />
          <span className="text-4xl font-semibold text-gray-700">
            Explore the <span className="text-yellow-700">Extensions</span>
          </span>
        </h1>
        <p className="text-gray-500 mt-2">
          Empower your platform with modular extensions that help manage operations, improve communication,<br/> and optimize day-to-day workflows
        </p>
      </div>

      <hr />

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
