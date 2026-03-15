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
    <div className="mx-auto w-full max-w-screen-md p-4 relative" suppressHydrationWarning={true}>

      {/* 🔥 Custom Prev Button */}
      <button
        ref={prevRef}
        className="absolute -left-7 top-1/2 -translate-y-1/2 z-20 w-10 h-10
                 flex items-center justify-center rounded-full bg-white shadow-lg border border-gray-100
                 text-primary-600 hover:bg-primary-600 hover:text-white transition-all duration-300 transform hover:scale-110"
      >
        <ArrowArcLeft size={16} weight="bold"/>
      </button>

      {/* 🔥 Custom Next Button */}
      <button
        ref={nextRef}
        className="absolute -right-7 top-1/2 -translate-y-1/2 z-20 w-10 h-10
                 flex items-center justify-center rounded-full bg-white shadow-lg border border-gray-100
                 text-primary-600 hover:bg-primary-600 hover:text-white transition-all duration-300 transform hover:scale-110"
      >
        <ArrowArcRight size={16} weight="bold"/>
      </button>

      {/* Swiper */}
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
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
            <SwiperSlide key={ind} className="flex justify-center py-2">
              <div
                onClick={() => setSelected(district.value)}
                className="flex flex-col items-center justify-start w-24 cursor-pointer transition-all duration-300 group"
              >
                <div
                  className={`w-20 h-20 rounded-full overflow-hidden border-2 flex items-center justify-center bg-white transition-all duration-500
                    ${
                      isActive
                        ? "scale-100 border-primary-600 shadow-xl ring-4 ring-primary-50"
                        : "scale-90 border-gray-100 group-hover:border-primary-200 group-hover:scale-95 shadow-sm"
                    }`}
                >
                  <Image
                    src={district.imageUrl}
                    height={72}
                    width={72}
                    alt={district.label}
                    className="object-cover"
                    unoptimized
                    loading="eager"
                  />
                </div>

                <p
                  className={`mt-3 text-sm font-medium text-center transition-all duration-300 font-jakarta
                    ${
                      isActive
                        ? "text-primary-700 font-bold"
                        : "text-gray-600 group-hover:text-primary-600"
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
