"use client";

import React, { use, useEffect, useState } from "react";
import { RangeSlider } from "./RangeSlider";
import { FilterIcon } from "./FilterIcon";
import { SortIcon } from "./SortIcon";
import { sortType } from "@/types/generic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useDebounce } from "@/lib/useDebounce";
import { AppliedFilters } from "./AppliedFilters";
import { MapTrifold } from "@phosphor-icons/react";
import { pgInfo } from "../../Map/Map";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import toast from "react-hot-toast";
import { X } from "@phosphor-icons/react/dist/ssr";
const Map = dynamic(() => import("../../Map/Map"), { ssr: false }); // <-- Update this path as needed
const SortComp = dynamic(
  () => import("@/components/Searchbar/Filter/SortComp"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center space-x-4 h-12 p-3 rounded-md">
        <span className="text-gray-400 font-semibold">Sort By</span>
        <div className="w-48 animate-pulse bg-gray-200 h-10 rounded"></div>
      </div>
    ),
  }
);

const arr = [
  { position: [20, 40] },
  { position: [25, 45] },
  { position: [30, 50] }
];


export const FilterSection = () => {
  const [values, setValues] = useState<number[]>([20]); // Maintaining Range Values
  const [selectedOption, setSelectedOption] = useState<sortType | null>(null); // Maintaining Selected Sort Option
  const [sortOrder, setSortOrder] = useState<string | null>(null); // 'asc', 'desc', or null
  const debouncedRange = useDebounce<number[]>(values, 500);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [pgInfo, setPgInfo] = useState<pgInfo[]>([]);


  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("kmradi", debouncedRange[0].toString());

    if (selectedOption?.value) {
      if (sortOrder === null || sortOrder === "desc") {
        params.set("sort", `-${selectedOption.value}`);
      } else {
        params.set("sort", `${selectedOption.value}`);
      }
    } else {
      params.delete("sort");
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl);
  }, [
    debouncedRange,
    selectedOption,
    sortOrder,
    router,
    pathname,
    searchParams,
  ]);

  const query = useSearchParams();
  const {coordinates , clg_name , clg_addr, clg_pin, clg_id} = Object.fromEntries(query.entries());
  const [loading, setloading] = useState<boolean>(false);
  useEffect(() => {
      if (query.size !== 0) {
        let queryArray = [];
  
        if (query.get("kmradi")) {
          queryArray?.push(`kmradi=${query.get("kmradi")}`);
        }else{
          queryArray?.push(`kmradi=20`);
        }
  
        if (query.get("coordinates")) {
          queryArray?.push(`coordinates=${query.get("coordinates")}`);
        }
  
        if(query.get("sort")){
          queryArray?.push(`sort=${query.get("sort")}`);
        }
  
        if(query.get("pg_type")){
          queryArray?.push(`pg_type=${query.get("pg_type")}`);
        }
  
        if(query.get("minRent")){
          queryArray?.push(`minRent=${query.get("minRent")}`);
        }
  
        if(query.get("maxRent")){
          queryArray?.push(`maxRent=${query.get("maxRent")}`);
        }
  
        if(query.get("wifi_available")){
          queryArray?.push(`wifi_available=${query.get("wifi_available")}`);
        }
  
        if(query.get("food_available")){
          queryArray?.push(`food_available=${query.get("food_available")}`);
        }
  
        const urlquery = queryArray?.join("&");
  
        const fetchPgs = async (searchQuery: string) => {
          setloading(true);
          const res: ApiReturn<any> = await api_caller<any>(
            "GET",
            `${API.PG.FOR_MAP}?${searchQuery}`
          );
          if (res.success) {
            // setCards(res?.data);
            setPgInfo(res?.data.map((pg: any) => ({
              position: pg.location.coordinates.reverse(),
              name: pg.pg_name,
              address: pg.address,
              pg_idno: pg._id,
            })));
          } else {
            toast.error(`${res.message} : ${res.error}`);
            setPgInfo([]);
          }
          setloading(false);
        };
  
        fetchPgs(urlquery);
      }
    }, [query]);
  
    if (query.size === 0) {
      return null;
    }

  return (
    <div className="flex flex-col max-w-7xl p-4 mx-auto">
      <div className="flex justify-between items-center">
        <div className="w-1/2 flex justify-between items-center gap-4">
          <RangeSlider values={values} setValues={setValues} />
          <FilterIcon allowed_query_highlight={['pg_type', 'wifi_available', 'food_available', 'minRent', 'maxRent']} />
          <button
            type="button"
            data-tooltip="Display Map"
            onClick={() => {
              // Handle map toggle/open here
              setShowMap(!showMap);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition"
          >
            <MapTrifold size={20} weight="fill" />
            <span className="text-gray-700 font-medium">Map</span>
          </button>

        </div>
        <div className="w-1/2 flex justify-end items-center gap-4">
          <SortComp
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
          <div className={`${!selectedOption ? "pointer-events-none" : ""}`}>
            <SortIcon sortOrder={sortOrder} setSortOrder={setSortOrder} />
          </div>
        </div>
      </div>
      <div>
        <AppliedFilters />
      </div>
      {showMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          
          <div className="relative bg-transparent w-[90%] h-[80%] max-w-5xl overflow-hidden mt-10">
            {/* Map */}
            <Map pgInfo={pgInfo} clg_coords={coordinates?.split(",").map(Number).reverse() as [number, number]} {...{clg_addr,clg_name,clg_id,clg_pin}} />
          </div>
          {/* Close Button */}
            <button
              onClick={() => setShowMap(false)}
              className="float-end text-black font-bold z-10 self-start mt-8 bg-white p-2 rounded-full"
              data-tooltip="Close Map"
              data-tooltip-pos="bottom"
            >
             <X size={25} weight="bold" />
            </button>
        </div>
      )}

    </div>
  );
};

export default FilterSection;
