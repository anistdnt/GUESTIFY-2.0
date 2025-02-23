"use client";
import React from "react";
import { useState } from "react";
import Image from "next/image";
const Searchbar = () => {
  const [placeholder, setPlaceholder] = useState("Search...");

  return (
    <>
      <div className="mx-auto flex p-2 lg:w-3/5  bg-white ">
        {/* <div className=" flex items-center justify-center mx-2 p-2  w-1/5 border border-gray-300 rounded-md "></div> */}
        <div className="flex  items-center border w-full  rounded-lg overflow-hidden">
          <select
            name=""
            id=""
            className="px-2 border-none bg-white"
            onChange={(e) => setPlaceholder(e.target.value)}>
            <option value="">Search by</option>
            <option value="Search Places">Location</option>
            <option value="Search Colleges name">College</option>
          </select>
          <input
            type="text"
            placeholder={placeholder}
            className="w-full px-4 py-2 focus:outline-none"
          />
          <button className="bg-black text-white px-6 py-2 hover:bg-gray-200 hover:text-black">
            Search
          </button>
        </div>
      </div>
      <div className="mx-auto flex space-x-4 overflow-x-auto p-4 w-full max-w-screen-md scrollbar-hide">
        <div className="flex flex-col items-center justify-center w-32 h-36 bg-white border border-gray-800 text-sm font-semibold rounded-lg shrink-0">
          <Image
            src="/assets/login_illustration.webp"
            height={600}
            width={600}
            alt="illustration"></Image>
          <p className="mt-2">Alipore</p>
        </div>
        <div className="flex flex-col items-center justify-center w-32 h-36 bg-white border border-gray-800 text-sm font-semibold rounded-lg shrink-0">
          <Image
            src="/assets/cityImg.png"
            height={600}
            width={600}
            alt="illustration"></Image>
          <p className="mt-2">Kolkata</p>
        </div>
        <div className="flex flex-col items-center justify-center w-32 h-36 bg-white border border-gray-800 text-sm font-semibold rounded-lg shrink-0">
          <Image
            src={"/assets/cityImg.png"}
            height={600}
            width={600}
            alt="illustration"></Image>
          <p className="mt-2">Kolkata</p>
        </div>
        <div className="flex flex-col items-center justify-center w-32 h-36 bg-white border border-gray-800 text-sm font-semibold rounded-lg shrink-0">
          <Image
            src="/assets/login_illustration.webp"
            height={600}
            width={600}
            alt="illustration"></Image>
          <p className="mt-2">Kolkata</p>
        </div>
        <div className="flex flex-col items-center justify-center w-32 h-36 bg-white border border-gray-800 text-sm font-semibold rounded-lg shrink-0">
          <Image
            src="/assets/login_illustration.webp"
            height={600}
            width={600}
            alt="illustration"></Image>
          <p className="mt-2">Kolkata</p>
        </div>
        <div className="flex flex-col items-center justify-center w-32 h-36 bg-white border border-gray-800 text-sm font-semibold rounded-lg shrink-0">
          <Image
            src="/assets/login_illustration.webp"
            height={600}
            width={600}
            alt="illustration"></Image>
          <p className="mt-2">Kolkata</p>
        </div>
        <div className="flex flex-col items-center justify-center w-32 h-36 bg-white border border-gray-800 text-sm font-semibold rounded-lg shrink-0">
          <Image
            src="/assets/login_illustration.webp"
            height={600}
            width={600}
            alt="illustration"></Image>
          <p className="mt-2">Kolkata</p>
        </div>

        <div className="flex items-center justify-center w-20 h-20 bg-indigo-500 text-white text-sm font-medium rounded-full shrink-0 break-words text-center">
          South 24 Parganas
        </div>
      </div>
      ;
    </>
  );
};

export default Searchbar;
