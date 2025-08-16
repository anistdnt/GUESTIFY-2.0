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
import { set } from "mongoose";
import { pgInfo } from "../../Map/Map";
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
  const [values, setValues] = useState<number[]>([2]); // Maintaining Range Values
  const [selectedOption, setSelectedOption] = useState<sortType | null>(null); // Maintaining Selected Sort Option
  const [sortOrder, setSortOrder] = useState<string | null>(null); // 'asc', 'desc', or null
  const debouncedRange = useDebounce<number[]>(values, 500);
  const [showMap, setShowMap] = useState<boolean>(false);


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

  return (
    <div className="flex flex-col max-w-7xl p-4 mx-auto">
      <div className="flex justify-between items-center">
        <div className="w-1/2 flex justify-between items-center gap-4">
          <RangeSlider values={values} setValues={setValues} />
          <FilterIcon allowed_query_highlight={['pg_type', 'wifi_available', 'food_available', 'minRent', 'maxRent']} />
          <button
            type="button"
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
          <div className="relative bg-transparent w-[90%] h-[80%] max-w-5xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setShowMap(false)}
              className="absolute top-0 right-3 text-white font-bold z-10"
            >
              ✕
            </button>

            {/* Map */}
            <Map pgInfo={arr as pgInfo[]} clg_coords={[30,40]} />
          </div>
        </div>
      )}

    </div>
  );
};

export default FilterSection;
