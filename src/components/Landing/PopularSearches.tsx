"use client";

import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { CollegeType } from "@/types/college";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import NoDataFound from "../NoDataFound/NoDataFound";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Default fallback images matching index.html
const defaultCollegeImages = [
  "https://storage.googleapis.com/banani-generated-images/generated-images/22ebcf3e-c83f-441f-b913-a228d1cfb10d.jpg",
  "https://storage.googleapis.com/banani-generated-images/generated-images/99e9d7e0-8f2b-4c14-9a3e-0299480162b5.jpg",
  "https://storage.googleapis.com/banani-generated-images/generated-images/1d6cd1ee-6285-4090-aee2-56be5eb5fc75.jpg",
  "https://storage.googleapis.com/banani-generated-images/generated-images/68c19e90-5d65-4ea1-872f-a7262bbf6136.jpg",
];

export default function PopularSearches() {
  const [colleges, setColleges] = useState<CollegeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const resData: ApiReturn<any> = await api_caller<any>(
          "GET",
          `${API.COLLEGE.LIST}?popular=true`
        );

        if (resData.success && resData.data) {
          setColleges(resData.data.colleges || []);
        } else {
          console.error("API call failed or returned no data:", resData);
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch College details:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  if (loading) {
    return (
      <section className="py-0 pb-24 bg-white">
        <div className="container-new">
          <div className="text-center">
            <p className="text-body-new">Loading popular colleges...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || colleges.length === 0) {
    return <NoDataFound text="No Popular Colleges are found" />;
  }

  return (
    <section suppressHydrationWarning={true}>
      <div className="container-new">
        <div className="mb-12 text-center flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-normal text-gray-900 mb-4 font-display tracking-tight">Top College <span className="italic-serif text-primary-600">Destinations</span></h2>
          <p className="text-lg text-gray-600 max-w-2xl font-jakarta">
            Popular student hubs across the country
          </p>
        </div>

        {/* Carousel */}
        <div className="popular-colleges-carousel">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            loop={true}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            className="pb-12"
          >
            {colleges.map((college: CollegeType, index: number) => (
              <SwiperSlide key={college._id || index}>
                <Link
                  href={`/search?kmradi=20&coordinates=${college.location?.coordinates?.join(
                    ","
                  )}&clg_id=${college?._id}`}
                  className="block group h-full"
                >
                  {/* Card with uniform shadow and hover effect */}
                  <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.03)] hover:shadow-[0_0_30px_rgba(0,0,0,0.08)] transition-all duration-500 border border-gray-100 h-full flex flex-col">
                    {/* Image container */}
                    <div className="relative h-[200px] overflow-hidden">
                      <Image
                        src={college.image_url || defaultCollegeImages[index % 4]}
                        alt={college.college_name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Listing count badge */}
                      <div className="absolute bottom-4 left-4 bg-primary-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-bold shadow-lg font-jakarta uppercase tracking-wider">
                        {Math.floor(Math.random() * 100) + 50}+ Listings
                      </div>
                    </div>
                    {/* Text section */}
                    <div className="p-6 flex flex-col flex-1">
                      <h4 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors font-jakarta line-clamp-1 tracking-tight">
                        {college?.college_name}
                      </h4>
                      <p className="text-sm text-gray-500 flex items-center gap-2 font-jakarta">
                        <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {college?.district || "Kolkata"}
                      </p>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
