"use client";
import React, { memo, useCallback, useEffect, useState } from "react";
// import Select from "react-select";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import toast from "react-hot-toast";
import { useDebounce } from "@/lib/useDebounce";
import NoDataFound from "../NoDataFound/NoDataFound";
import { useRouter } from "next/navigation";
import { CollegeListSkeleton } from "./CollegeListSkeleton";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";


const ExpandedComp = memo(
  ({
    query,
    handleChangePath,
  }: {
    query: string;
    handleChangePath: (coordinates: string,college_name:string,college_addr:string,college_pin:number,college_id:string) => void;
  }) => {
    const [Colleges, setColleges] = useState([]);
    const [loading, setloading] = useState<boolean>(true);

    useEffect(() => {
      const fetchColleges = async () => {
        setloading(true);
        const res: ApiReturn<any> = await api_caller(
          "GET",
          `${API.COLLEGE.LIST}?q=${query}`
        );
        if (res.success) {
          setColleges(res.data.colleges);
        } else {
          toast.error(`${res.message} : ${res.error}`);
        }
        setloading(false);
      };

      if (query) fetchColleges();
    }, [query]);

    if (loading) {
      return <CollegeListSkeleton />;
    } else {
      return (
        <ul
          id="Kolkata_Colleges"
          className="max-h-[400px] px-2 pb-3 overflow-y-auto text-sm text-gray-700 font-body transition-all duration-500 ease-out opacity-0 transform translate-y-4 animate-slideFadeIn"
        >
          {Colleges?.length === 0 ? (
            <NoDataFound text="No Colleges Found" />
          ) : (
            Colleges?.map((item: any) => (
              <li
                key={item._id}
                onClick={() => {
                  handleChangePath(item?.location?.coordinates?.join(","),item.college_name,item.address,item.pincode,item._id);
                }}
                className="group"
              >
                <div className="flex items-center p-3 rounded-2xl hover:bg-primary-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-primary-100">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      className="rounded-xl object-cover"
                      src={item.image_url}
                      alt={item.college_name + " logo"}
                      fill
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <span className="text-gray-900 font-bold group-hover:text-primary-700 transition-colors">{item.college_name}</span>{" "}
                    <br />
                    <span className="text-xs text-gray-500">
                      {item.address}
                    </span>
                  </div>
                  <div className="text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      );
    }
  }
);

ExpandedComp.displayName = "ExpandedComp";

const Searchbar = () => {
  const [searchString, setSearchString] = useState("");
  const debouncedQuery = useDebounce(searchString, 500);

  const router = useRouter();

  const commonSearches = ["MAKAUT", "Heritage", "Techno Main", "IEM", "JIS", "Jadavpur University", "Calcutta University", "NIT Durgapur", "GCECT"];

  const handleChangePath = useCallback(
    (coordinates: string,college_name:string,college_addr:string,college_pin:number,college_id:string) => {
      const url = new URLSearchParams(window?.location.search);
      url.set("coordinates", coordinates);
      url.set("kmradi", "20");
      url.set("clg_id", college_id);

      router.push(`/search?${url.toString()}`, { scroll: false });
      setSearchString("");
    },
    [router]
  );

  return (
    <div className="w-full relative" suppressHydrationWarning={true}>
      <div className={`mx-auto flex flex-col p-2 bg-white rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.08)] border border-gray-100 transition-all duration-500 ${searchString ? 'ring-4 ring-primary-100' : ''}`}>
        <div className="flex items-center w-full px-6 py-2 gap-4">
          <div className="text-primary-600 bg-primary-50 p-3 rounded-2xl">
            <MagnifyingGlass size={24} weight="bold"/>
          </div>
          <input
            type="text"
            placeholder="Search for your college (e.g. Heritage Institute...)"
            className="w-full text-lg font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none font-body bg-transparent"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
          {searchString && (
             <button 
                onClick={() => setSearchString('')}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
             >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
             </button>
          )}
        </div>
        
        {searchString && (
          <div className="px-4 py-4 border-t border-gray-50 mt-2">
            <ExpandedComp
              query={debouncedQuery}
              handleChangePath={handleChangePath}
            />
          </div>
        )}
      </div>
      
      {/* Search Hints */}
      {!searchString && (
        <div className="flex flex-col items-center justify-center gap-3 mt-6">
          <span className="text-sm text-gray-400 font-body text-nowrap">Common searches:</span>
          <div className="flex flex-wrap justify-center gap-3">
            {commonSearches?.map((hint) => (
            <button 
              key={hint}
              onClick={() => setSearchString(hint)}
              className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full hover:bg-primary-100 transition-colors font-body"
            >
              {hint}
            </button>
          ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Searchbar;
