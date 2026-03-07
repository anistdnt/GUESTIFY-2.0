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
        <div className="mb-10 text-center flex flex-col items-center">
          <h2 className="text-h2 text-[var(--foreground)] mb-2">Popular near colleges</h2>
          <p className="text-body-new max-w-xl">
            Top-rated PGs within walking distance of major campuses.
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
            className=""
          >
            {colleges.map((college: CollegeType, index: number) => (
              <SwiperSlide key={college._id || index}>
                <Link
                  href={`/search?kmradi=20&coordinates=${college.location?.coordinates?.join(
                    ","
                  )}&clg_id=${college?._id}`}
                  className="block group"
                >
                  {/* Card with subtle shadow and hover effect */}
                  <div className="overflow-hidden transition-all duration-300">
                    {/* Image container - 220px height for better proportions */}
                    <div className="relative h-[220px] overflow-hidden rounded-2xl">
                      <Image
                        src={college.image_url || defaultCollegeImages[index % 4]}
                        alt={college.college_name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Listing count badge */}
                      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-medium shadow-lg">
                        {Math.floor(Math.random() * 100) + 50}+ Listings
                      </div>
                    </div>
                    {/* Text section with better padding */}
                    <div className="p-5">
                      <h4 className="font-semibold text-md text-[var(--foreground)] mb-1 group-hover:text-[var(--primary-new)] transition-colors">
                        {college?.college_name}
                      </h4>
                      <p className="text-xs text-[var(--muted-foreground-new)] flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
