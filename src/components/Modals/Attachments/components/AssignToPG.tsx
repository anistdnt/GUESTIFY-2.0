"use client";

import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { AttractionPlace } from "@/types/admin";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { triggerRefetch } from "@/redux/slices/modalSlice";

type Props = {
  pg_id: string;
  local_attachments?: string[];
};

function AttractionSkeleton() {
  return (
    <div className="flex gap-4 p-4 border rounded-lg animate-pulse">
      <div className="w-24 h-24 bg-gray-200 rounded-lg" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}

function ButtonLoader({text}:{text: string}) {
  return (
    <span className="flex items-center gap-1">
      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      {text}
    </span>
  );
}

export default function AssignToPG({ local_attachments = [], pg_id }: Props) {
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [attractions, setAttractions] = useState<AttractionPlace[]>([]);
  const [alreadyAttached, setAlreadyAttached] =
    useState<string[]>(local_attachments);

  const dispatch = useDispatch();

  async function fetchAttractions() {
    setLoading(true);
    try {
      const res: ApiReturn<AttractionPlace[]> = await api_caller(
        "GET",
        API.ADMIN.ATTRACTIONS.LIST
      );

      if (!res.success) throw new Error(res.message);
      setAttractions(res.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch attractions");
    } finally {
      setLoading(false);
    }
  }

  async function toggleAttraction(id: string, action: string) {
    setActionLoading(id);
    try {
      const url = API.ADMIN.ATTRACTIONS.TOGGLE.replace(":id", pg_id);
      const res = await api_caller("PATCH", url, {
        attraction_id: id,
        action: action,
      });

      if (!res.success) throw new Error(res.message);

      if (action === "remove") {
        setAlreadyAttached((prev) => prev.filter((a) => a !== id));
      } else if (action === "add") {
        setAlreadyAttached((prev) => [...prev, id]);
      }
      dispatch(triggerRefetch(true));
      toast.success(res.message || "Attraction toggle");
    } catch (err: any) {
      toast.error(err.message || "Failed to add");
    } finally {
      setActionLoading(null);
    }
  }

  useEffect(() => {
    fetchAttractions();
  }, []);

  return (
    <div className="space-y-4 w-[600px]">
      {loading &&
        Array.from({ length: 4 }).map((_, i) => <AttractionSkeleton key={i} />)}

      {!loading &&
        attractions.map((attraction) => {
          const isAttached = alreadyAttached.includes(attraction._id);

          return (
            <div
              key={attraction._id}
              className="flex gap-4 p-4 border rounded-lg hover:shadow-sm transition"
            >
              {/* IMAGE */}
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                {attraction.image_url && (
                  <Image
                    src={attraction.image_url}
                    alt={attraction.place_name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              {/* CONTENT */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800">
                    {attraction.place_name}
                  </h3>

                  <span className="">
                    {isAttached ? (
                      <button
                        disabled={actionLoading === attraction._id}
                        onClick={() =>
                          toggleAttraction(attraction._id, "remove")
                        }
                        className="px-3 py-1 text-sm rounded-md bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                      >
                        {actionLoading === attraction._id ? <ButtonLoader text="Removing" /> : "Remove"}
                      </button>
                    ) : (
                      <button
                        disabled={actionLoading === attraction._id}
                        onClick={() => toggleAttraction(attraction._id, "add")}
                        className="px-3 py-1 text-sm rounded-md bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
                      >
                        {actionLoading === attraction._id ? <ButtonLoader text="Adding" /> : "Add"}
                      </button>
                    )}
                  </span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {attraction.description}
                </p>

                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 capitalize mt-2">
                  {attraction.type}
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
}
