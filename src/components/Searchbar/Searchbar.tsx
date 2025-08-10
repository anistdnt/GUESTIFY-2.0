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
          className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200 transition-all duration-500 ease-out opacity-0 transform translate-y-4 animate-slideFadeIn"
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
              >
                <div className="flex items-center py-2 pl-2 rounded hover:bg-gray-50 cursor-pointer">
                  <img
                    className="w-10 h-10 mr-2 rounded-md inline-block"
                    src={item.image_url}
                    alt={item.college_name + " logo"}
                  />
                  <div className="ml-2">
                    <span className="text-black">{item.college_name}</span>{" "}
                    <br />
                    <span className="text-xs text-gray-700">
                      {item.address}
                    </span>
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

const Searchbar = () => {
  // const [selectedOption, setSelectedOption] = useState({
  //   label: "College",
  //   value: "college",
  // });

  const [searchString, setSearchString] = useState("");
  const debouncedQuery = useDebounce(searchString, 500);

  const router = useRouter();

  const handleChangePath = useCallback(
    (coordinates: string,college_name:string,college_addr:string,college_pin:number,college_id:string) => {
      // console.log("Co-Ordinates",coordinates);
      const url = new URLSearchParams(window?.location.search);

      //Adding query params
      url.set("coordinates", coordinates);
      url.set("clg_name",college_name);
      url.set("clg_addr",college_addr);
      url.set("clg_pin", college_pin?.toString());
      url.set("clg_id", college_id);


      router.push(`/search?${url.toString()}`, { scroll: false });
      setSearchString("");
    },
    [debouncedQuery]
  );

  return (
    <div>
      {/* <Districts /> */}
      <div className="mx-auto flex flex-col p-2 lg:w-3/5 bg-white rounded-md">
        <div className="flex items-center border w-full rounded-lg">
          {/* <Select
            value={selectedOption}
            onChange={setSelectedOption}
            isSearchable={false}
            className="w-32 border-white"
            options={[
              { label: "Location", value: "location" },
              { label: "College", value: "college" },
            ]}
          /> */}
          <input
            type="text"
            // placeholder={
            //   selectedOption?.value === "college"
            //     ? "Search By College Name"
            //     : "Search By Location"
            // }
            placeholder="Search By College Name"
            className="w-full px-4 py-2 focus:outline-none"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
        </div>
        {searchString && (
          <div className="py-4">
            <ExpandedComp
              query={debouncedQuery}
              handleChangePath={handleChangePath}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Searchbar;
