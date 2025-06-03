"use client";
import React from "react";
import { useState } from "react";
import Image from "next/image";
import Select from "react-select";
import { Colleges } from "@/data/sample_colleges";

interface distType {
  id: number;
  name: string;
  altname: string;
  searchval: string;
  srcimage: string;
}

const districtMap: distType[] = [
  {
    id: 1,
    name: "Alipore",
    altname: "alipore",
    searchval: "alipore",
    srcimage: "/assets/login_illustration.webp",
  },
  {
    id: 2,
    name: "Kolkata",
    altname: "kolkata",
    searchval: "kolkata",
    srcimage: "/assets/login_illustration.webp",
  },
  {
    id: 3,
    name: "Alipore",
    altname: "alipore",
    searchval: "alipore",
    srcimage: "/assets/login_illustration.webp",
  },
  {
    id: 4,
    name: "Kolkata",
    altname: "kolkata",
    searchval: "kolkata",
    srcimage: "/assets/login_illustration.webp",
  },
  {
    id: 1,
    name: "Alipore",
    altname: "alipore",
    searchval: "alipore",
    srcimage: "/assets/login_illustration.webp",
  },
  {
    id: 2,
    name: "Kolkata",
    altname: "kolkata",
    searchval: "kolkata",
    srcimage: "/assets/login_illustration.webp",
  },
  {
    id: 3,
    name: "Alipore",
    altname: "alipore",
    searchval: "alipore",
    srcimage: "/assets/login_illustration.webp",
  },
  {
    id: 4,
    name: "Kolkata",
    altname: "kolkata",
    searchval: "kolkata",
    srcimage: "/assets/login_illustration.webp",
  },
];

const Districts = () => {
  return (
    <div className="mx-auto flex space-x-4 overflow-x-auto p-4 w-full max-w-screen-md scrollbar-hide">
      {districtMap?.map((district: distType, index: number) => (
        <div
          className="flex flex-col items-center justify-center w-32 h-36 bg-white border border-gray-800 text-sm font-semibold rounded-lg shrink-0"
          key={index}
        >
          <Image
            src={district?.srcimage}
            height={600}
            width={600}
            alt={district?.altname}
          ></Image>
          <p className="mt-2">{district?.name}</p>
        </div>
      ))}
    </div>
  );
};

const ExpandedComp = () => {
  return (
    <ul
      id="Kolkata_Colleges"
      className=" h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
      aria-labelledby="dropdownSearchButton"
    >
      {Colleges.map((item) => (
        <li key={item.id}>
          <div className="flex items-center py-2 pl-2 rounded hover:bg-gray-50 cursor-pointer">
            <img
              className="w-10 h-10 mr-2 rounded-md inline-block"
              src={item.image_url}
              alt={item.name + " logo"}
            />
            <div className="ml-2">
              <span className="text-black">{item.name}</span> <br />
              {/* <span className='ml-2 text-xs'>{item.location.split("|")[0]}</span> */}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

const Searchbar = () => {
  const [selectedOption, setSelectedOption] = useState({
    label: "College",
    value: "college",
  });

  return (
    <div>
      <Districts />
      <div className="mx-auto flex flex-col p-2 lg:w-3/5 bg-white rounded-md">
        <div className="flex items-center border w-full  rounded-lg">
          <div className="">
            <Select
              value={selectedOption}
              onChange={setSelectedOption}
              isSearchable={false}
              className="w-32 border-white"
              options={[
                { label: "Location", value: "location" },
                { label: "College", value: "college" },
              ]}
            />
          </div>
          <input
            type="text"
            placeholder={
              selectedOption?.value === "college"
                ? "Search By College Name"
                : "Search By Location"
            }
            className="w-full px-4 py-2 focus:outline-none"
          />
        </div>
        <div className="py-4">
          <ExpandedComp />
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
