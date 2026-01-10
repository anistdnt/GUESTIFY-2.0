"use client";

import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { AttractionPlace } from "@/types/admin";
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

interface Options {
  label: string;
  value: string | number;
}

const filterOptions: Options[] = [
  {
    label: "All",
    value: "all",
  },
  { label: "Medical", value: "medical" },
  { label: "Museum", value: "museum" },
  { label: "Park", value: "park" },
  { label: "Market", value: "market" },
  { label: "Grocery", value: "grocery" },
  { label: "Cafe", value: "cafe" },
];

export default function LocalAttractionsComp() {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Options>({
    label: "All",
    value: "all",
  });
  const [attractions, setAttractions] = useState<AttractionPlace[]>([]);

  const isRefetch = useSelector(
    (state: RootState) => state.modal_slice.isRefetch
  );
  const isDeleted = useSelector(
    (state: RootState) => state.modal_slice.isDeleted
  );

  const dispatch = useDispatch();

  async function fetchAttractions(type?: string) {
    setLoading(true);
    try {
      let url = `${API.ADMIN.ATTRACTIONS.LIST}`;
      if (type && type !== "all") {
        url += `?type=${type}`;
      }
      const res: ApiReturn<any> = await api_caller<any>("GET", url);

      if (res.success) {
        setAttractions(res?.data || []);
      } else {
        throw new Error(res?.message || "Failed to fetch data");
      }
    } catch (error) {
      setAttractions([]);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  function onDelete(id: string) {
    dispatch(
      setModalVisibility({
        open: true,
        type: "genericConfirmation",
        modalData: {
          caption: "Delete Attraction",
          placeholder: "delete this attraction?",
          btnText: "Delete",
          endpoint: API.ADMIN.ATTRACTIONS.DELETE.replace(
            ":id",
            id
          ),
          method: "DELETE",
        },
      })
    );
  }

  useEffect(() => {
    fetchAttractions(selectedOption?.value as string);
    dispatch(triggerRefetch(false));
    dispatch(deleteSuccess(true));
  }, [selectedOption?.value, isRefetch, isDeleted]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-gray-500">
          <span>View and </span> <br />
          <span className="text-4xl font-semibold text-gray-700">
            Explore the <span className="text-yellow-700">Neighborhood</span>
          </span>
        </h1>
        <p className="text-gray-500 mt-2">
          Explore verified essentials and popular attractions around your PG,
          ensuring comfort, convenience, and peace of mind
        </p>
      </div>

      <hr />

      <div>
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              dispatch(
                setModalVisibility({
                  open: true,
                  type: "enlistattraction",
                  modalData: {
                    caption: "Enlist Attraction for your Paying Guest House",
                  },
                })
              );
            }}
            className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md flex items-center justify-center gap-1"
          >
            <Plus size={20} />
            <span>Add New</span>
          </button>
          <div className="flex justify-end items-center gap-3">
            <span className="text-gray-700 font-semibold">
              Filter By Place type
            </span>
            <Select
              options={filterOptions}
              value={
                filterOptions?.find((o) => o.value === selectedOption?.value) ||
                null
              }
              onChange={(option: Options) => setSelectedOption(option)}
              placeholder="Select Type"
              className="w-40 rounded-md"
            />
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <AttractionSkeleton key={i} />
              ))}
            </div>
          ) : attractions?.length === 0 ? (
            <NoDataFound text="No Local Attractions are Enlisted" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {attractions?.map((attraction) => (
                <AttractionCard key={attraction._id} attraction={attraction} onDelete={onDelete}/>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
