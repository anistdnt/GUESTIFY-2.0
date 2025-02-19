// Importing Components
"use client";

import { useState } from "react";
import Image from "next/image";
import DisplayCard from "@/components/DisplayCard/DisplayCard";

export default function Home() {
  const [placeholder, setPlaceholder] = useState("Search...");
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        {/* Hero Section */}
        <section className="relative bg-[url('/assets/about-us-banner.jpg')] bg-fixed bg-bottom bg-cover text-white h-80 flex flex-row justify-center items-center">
          <div className="absolute inset-0 bg-black bg-opacity-35"></div>
          <div className="relative mx-auto max-w-7xl text-center">
            <h1 className="text-5xl font-medium">
              {" "}
              Discover Your Perfect PG Stay
            </h1>
            <p className="mt-4 text-sm">
              Your trusted platform for finding paying guest accommodations in
              West Bengal.
            </p>
          </div>
        </section>

        <div className="mx-auto flex lg:w-3/5 p-4 bg-white ">
          {/* <div className=" flex items-center justify-center mx-2 p-2  w-1/5 border border-gray-300 rounded-md "></div> */}
          <div className="flex items-center border w-full border-gray-300 rounded-lg overflow-hidden">
            <select
              name=""
              id=""
              className="px-2 border-none"
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
        {/**Distrcicts names */}
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
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 py-10 px-3 justify-items-center">
        <DisplayCard number_of_stars={5} />
        <DisplayCard number_of_stars={5}/>
      </div>
    </>
  );
}
