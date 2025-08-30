"use client";

import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { PGData } from "@/types/pg_type";
import toast from "react-hot-toast";
import SliderPGCard from "../DisplayCard/SliderPGCard";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";

// install modules
SwiperCore.use([Navigation, Pagination]);

function SwiperSkeleton() {
  return (
    // Skeleton Loader
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse flex flex-col rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="h-40 bg-gray-300"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            <div className="h-8 bg-gray-300 rounded mt-4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SimilerPgs({
  current_pgid,
  current_pg_cords,
}: {
  current_pgid?: string;
  current_pg_cords?: number[];
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [nearPgs, setNearPgs] = useState<PGData[] | null>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPgsNearPg = async () => {
      setLoading(true);
      const res: ApiReturn<any> = await api_caller<any>(
        "GET",
        `${
          API.PG.GET_PG_NEAR_PG
        }/${current_pgid}?coordinates=${current_pg_cords?.join(",")}`
      );
      if (res.success) {
        setNearPgs(res?.data);
      } else {
        toast.error(`${res.message} : ${res.error}`);
        setNearPgs(null);
      }
      setLoading(false);
    };

    fetchPgsNearPg();
  }, [current_pgid, current_pg_cords]);

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">
        Paying Guest Houses Near Your Location
      </h2>
      <p className="text-center text-gray-500 mb-10">
        Discover PGs with similar amenities and convenient locations close to
        you.
      </p>

      {loading ? (
        <SwiperSkeleton />
      ) : (
        <>
          <Swiper
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              nextEl: ".custom-swiper-next",
              prevEl: ".custom-swiper-prev",
            }}
            pagination={{
              clickable: true,
              el: paginationRef.current,
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            loop={true}
            onBeforeInit={(swiper) => {
              // Assign pagination element dynamically
              if (paginationRef.current) {
                (swiper.params.pagination as any).el = paginationRef.current;
              }
            }}
          >
            {nearPgs?.map((item: any, index: number) => (
              <SwiperSlide key={index} className="flex justify-center">
                <SliderPGCard
                  item={item}
                  number_of_stars={item?.pginfo?.averageRating}
                />
              </SwiperSlide>
            ))}

            {/* Rounded Navigation Buttons */}
            <div className="custom-swiper-prev absolute top-1/2 left-2 z-10 -translate-y-1/2 cursor-pointer bg-white rounded-full p-3 flex justify-center items-center hover:bg-gray-200 transition shadow-[0_0px_6px_rgba(0,0,0,0.3),0_0_10px_rgba(0,0,0,0.2)]">
              <CaretLeft size={20} />
            </div>
            <div className="custom-swiper-next absolute top-1/2 right-2 z-10 -translate-y-1/2 cursor-pointer bg-white rounded-full p-3 flex justify-center items-center hover:bg-gray-200 transition shadow-[0_0px_6px_rgba(0,0,0,0.3),0_0_10px_rgba(0,0,0,0.2)]">
              <CaretRight size={20} />
            </div>
          </Swiper>

          {/* Pagination dots outside slider */}
          <div ref={paginationRef} className="flex justify-center mt-4"></div>
        </>
      )}
    </div>
  );
}
