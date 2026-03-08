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
      {/* Cinematic Heading Banner */}
      <div className="relative overflow-hidden bg-white rounded-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 group">
        {/* Decorative Background Element */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-50 rounded-full blur-3xl group-hover:bg-primary-100/50 transition-colors duration-700"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-[10px] font-bold uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-pulse"></span>
              Neighborhood Explorer
            </div>
            <h1 className="text-gray-400 font-medium text-lg font-jakarta leading-none">
              View and
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-display tracking-tight">
              Explore the <span className="text-primary-600">Neighborhood</span>
            </h2>
            <p className="text-gray-500 max-w-2xl font-jakarta text-sm leading-relaxed pt-2">
              Discover verified essentials and popular attractions around your property. Ensuring comfort, convenience, and peace of mind for all Guestify tenants.
            </p>
          </div>
          
          <div className="hidden lg:block text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Enlisted Places</p>
            <p className="text-3xl font-bold text-gray-900 font-display">{attractions.length}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
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
            className="group relative px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-bold font-jakarta overflow-hidden"
          >
            <Plus size={20} weight="bold" />
            <span>Add New Attraction</span>
          </button>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex flex-col items-end sm:items-start">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sort By</span>
              <span className="text-xs font-bold text-gray-700 uppercase">Place type</span>
            </div>
            <div className="w-52">
              <Select
                options={filterOptions}
                value={
                  filterOptions?.find((o) => o.value === selectedOption?.value) ||
                  null
                }
                onChange={(option: Options) => setSelectedOption(option)}
                placeholder="Select Type"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: '0.75rem',
                    padding: '2px',
                    borderColor: '#f3f4f6',
                    '&:hover': { borderColor: '#2563eb' },
                    boxShadow: 'none',
                    fontWeight: '600',
                    fontSize: '0.875rem'
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#eff6ff' : 'transparent',
                    color: state.isSelected ? 'white' : '#4b5563',
                    fontWeight: '600',
                    fontSize: '0.875rem'
                  })
                }}
              />
            </div>
          </div>
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
  );
}
