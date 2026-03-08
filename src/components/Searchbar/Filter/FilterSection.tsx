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
import CommonButton from "@/components/AppComponents/CommonButton";
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
    router.replace(newUrl, { scroll: false });
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
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-normal text-gray-900 font-display tracking-tight">
            Refine Your <span className="text-primary-600 italic-serif">Search</span>
          </h2>
          <p className="text-sm text-gray-400 font-jakarta">Adjust filters to find the perfect accommodation</p>
        </div>
        <div className="flex items-center gap-3">
          <CommonButton
            variant={showMap ? "dark" : "outline"}
            size="md"
            onClick={() => setShowMap(!showMap)}
            className={`rounded-xl px-6 py-3 transition-all duration-300 ${showMap ? 'shadow-gray-900/20' : ''}`}
            icon={<MapTrifold size={20} weight={showMap ? "fill" : "bold"} />}
          >
            {showMap ? "HIDE MAP" : "VIEW MAP"}
          </CommonButton>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center bg-white/70 backdrop-blur-md p-4 lg:p-2 rounded-[1.5rem] lg:rounded-full border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] gap-4 lg:gap-2">
        <div className="w-full lg:w-[45%] flex items-center">
           <RangeSlider values={values} setValues={setValues} />
        </div>
        
        <div className="hidden lg:block w-px h-10 bg-gray-100 mx-2"></div>
        
        <div className="w-full lg:flex-1 flex flex-col md:flex-row items-center gap-4 lg:gap-2">
          <div className="w-full md:w-auto flex items-center justify-between gap-4 px-2">
            <span className="lg:hidden text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">More Filters</span>
            <FilterIcon allowed_query_highlight={['pg_type', 'wifi_available', 'food_available', 'minRent', 'maxRent']} />
          </div>

          <div className="hidden md:block w-px h-10 bg-gray-100 mx-2"></div>

          <div className="w-full md:flex-1 flex items-center justify-between md:justify-end gap-4 px-2">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Sort By</span>
              <SortComp
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
              />
            </div>
            <div className={`${!selectedOption ? "pointer-events-none opacity-30" : "opacity-100"} transition-all duration-300`}>
              <SortIcon sortOrder={sortOrder} setSortOrder={setSortOrder} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <AppliedFilters />
      </div>

      {showMap && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/40 backdrop-blur-md transition-all duration-500" style={{margin: 0}}>
          <div className="relative bg-white w-[95%] h-[85%] max-w-6xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
            {/* Map Header */}
            <div className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-center pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-gray-100 pointer-events-auto">
                    <h3 className="text-lg font-display font-semibold text-gray-900">Live Map View</h3>
                    <p className="text-xs text-gray-500 font-jakarta">Showing PGs near {clg_name || 'selected college'}</p>
                </div>
                <button
                  onClick={() => setShowMap(false)}
                  className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-all duration-300 pointer-events-auto group"
                  aria-label="Close Map"
                >
                 <X size={24} weight="bold" className="text-gray-900 group-hover:scale-110 transition-transform" />
                </button>
            </div>
            
            {/* Map content */}
            <div className="w-full h-full">
               <Map pgInfo={pgInfo} clg_coords={coordinates?.split(",").map(Number).reverse() as [number, number]} {...{clg_addr,clg_name,clg_id,clg_pin}} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;
