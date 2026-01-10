"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { District, westBengalDistricts } from "@/data/westbengal_districts";
import { useRouter, useSearchParams } from "next/navigation";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ArrowArcLeft, ArrowArcRight } from "@phosphor-icons/react/dist/ssr";

export const Districts = () => {
  const query = useSearchParams();
  const [selected, setSelected] = useState<string | null>(
    query?.get("district") || null
  );
  const router = useRouter();

  // 🔥 Custom navigation button refs
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    if (selected) {
      router?.push(`/explore?district=${selected}`);
    }
  }, [selected, router]);

  return (
    <div className="mx-auto w-full max-w-screen-md p-4 relative" data-aos="fade-up" suppressHydrationWarning={true}>

      {/* 🔥 Custom Prev Button */}
      <button
        ref={prevRef}
        className="absolute -left-7 top-1/3 -translate-y-1/2 z-20 w-9 h-9
                 flex items-center justify-center rounded-full bg-white shadow-md
                 text-yellow-700 hover:scale-105 transition"
      >
        <ArrowArcLeft size={12}/>
      </button>

      {/* 🔥 Custom Next Button */}
      <button
        ref={nextRef}
        className="absolute -right-7 top-1/3 -translate-y-1/2 z-20 w-9 h-9
                 flex items-center justify-center rounded-full bg-white shadow-md
                 text-yellow-700 hover:scale-105 transition"
      >
        <ArrowArcRight size={12}/>
      </button>

      {/* Swiper */}
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          // Assign custom buttons to swiper navigation
          // (Swiper requires this for custom buttons)
          // @ts-ignore
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-ignore
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        spaceBetween={20}
        slidesPerView={4.5}
        speed={600}
        grabCursor={true}
        simulateTouch={true}
        breakpoints={{
          320: { slidesPerView: 3.2 },
          480: { slidesPerView: 4 },
          640: { slidesPerView: 5 },
          768: { slidesPerView: 6 },
        }}
        className="px-10"
      >
        {westBengalDistricts.map((district: District, ind: number) => {
          const isActive = selected === district.value;

          return (
            <SwiperSlide key={ind} className="flex justify-center">
              <div
                onClick={() => setSelected(district.value)}
                className="flex flex-col items-center justify-start w-24 cursor-pointer transition-transform duration-200 active:scale-95"
              >
                <div
                  className={`w-20 h-20 rounded-full overflow-hidden border flex items-center justify-center bg-white transition-all duration-300
                    ${
                      isActive
                        ? "scale-100 border-yellow-700 shadow-lg"
                        : "scale-95 border-gray-300"
                    }`}
                >
                  <Image
                    src={district.imageUrl}
                    height={64}
                    width={64}
                    alt={district.label}
                    className="object-fill"
                    unoptimized
                    loading="eager"
                  />
                </div>

                <p
                  className={`mt-2 text-sm font-medium text-center transition-colors duration-300 hover:text-yellow-700
                    ${
                      isActive
                        ? "text-yellow-800 font-semibold"
                        : "text-gray-800"
                    }`}
                >
                  {district.label}
                </p>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
