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

export const FilterSection = () => {
  const [values, setValues] = useState<number[]>([2]); // Maintaining Range Values
  const [selectedOption, setSelectedOption] = useState<sortType | null>(null); // Maintaining Selected Sort Option
  const [sortOrder, setSortOrder] = useState<string | null>(null); // 'asc', 'desc', or null
  const debouncedRange = useDebounce<number[]>(values, 500);

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
          <FilterIcon allowed_query_highlight={['pg_type','wifi_available','food_available']}/>
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
    </div>
  );
};

export default FilterSection;
