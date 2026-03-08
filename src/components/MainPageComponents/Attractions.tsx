"use client";

import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  CaretLeft,
  CaretLeftIcon,
  CaretRight,
  CaretRightIcon,
  MapPinAreaIcon,
} from "@phosphor-icons/react";
import NoDataFound from "../NoDataFound/NoDataFound";

type Props = {
  id: string;
};

interface PGAttractionResponse {
  _id: string;
  place_name: string;
  address: string;
  description: string;
  image_url: string;
  image_id: string;
  state: string;
  country: string;
  time_taken_minutes: number;
  type: string;
}

/* ---------------- Skeleton ---------------- */
function FullWidthSkeleton() {
  return <section className="w-full h-[420px] bg-gray-200 animate-pulse" />;
}

export default function Attractions({ id }: Props) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<PGAttractionResponse[]>([]);
  const [index, setIndex] = useState(1); // start from real first slide
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<NodeJS.Timeout | null>(null);

  /* -------- Fetch -------- */
  useEffect(() => {
    async function fetchAttractions() {
      try {
        const res: ApiReturn<PGAttractionResponse[] | PGAttractionResponse> =
          await api_caller("GET", API.PG.ATTRACTIONS.replace(":pg_id", id));

        if (!res.success || !res.data) {
          throw new Error("Failed to fetch attractions");
        }

        const data = Array.isArray(res.data) ? res.data : [res.data];
        setItems(data);
      } catch (e: any) {
        toast.error(e.message || "Failed to load attractions");
      } finally {
        setLoading(false);
      }
    }

    fetchAttractions();
  }, [id]);

  /* -------- Auto Slide -------- */
  const startAuto = () => {
    stopAuto();
    autoRef.current = setInterval(() => {
      move("right");
    }, 3000);
  };

  const stopAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
  };

  useEffect(() => {
    if (items.length > 1) startAuto();
    return stopAuto;
  }, [items, index]);

  /* -------- Movement -------- */
  const move = (dir: "left" | "right") => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.clientWidth;

    sliderRef.current.scrollTo({
      left: dir === "left" ? (index - 1) * width : (index + 1) * width,
      behavior: "smooth",
    });

    setIndex((prev) => (dir === "left" ? prev - 1 : prev + 1));
  };

  /* -------- Loop Correction -------- */
  const handleScrollEnd = () => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.clientWidth;

    // Jump from clone to real slide
    if (index === 0) {
      sliderRef.current.scrollTo({
        left: items.length * width,
        behavior: "auto",
      });
      setIndex(items.length);
    }

    if (index === items.length + 1) {
      sliderRef.current.scrollTo({
        left: width,
        behavior: "auto",
      });
      setIndex(1);
    }
  };

  useEffect(() => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.clientWidth;
    sliderRef.current.scrollTo({ left: width });
  }, [items]);

  if (loading) return <FullWidthSkeleton />;
  if (!items.length) return null;

  const slides = [
    items[items.length - 1], // clone last
    ...items,
    items[0], // clone first
  ];

  return (
    <div className="w-full">

      {/* Section  */}
      {slides?.length > 0 && <div className="flex flex-col items-center mb-12 text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="h-[1px] w-8 bg-primary-200" />
          <span className="text-[10px] font-bold text-primary-600 tracking-widest uppercase">Explore Local</span>
          <div className="h-[1px] w-8 bg-primary-200" />
        </div>
        <h2 className="text-4xl font-semibold text-gray-900 font-display tracking-tight mb-4">
          Nearby <span className="italic-serif text-primary-600">Attractions</span>
        </h2>
        <p className="text-gray-500 font-jakarta max-w-xl leading-relaxed">Discover popular spots and essentials conveniently located just minutes from your stay.</p>
      </div>}

      {slides.length > 0 ? 
      <section className="relative w-full group/section">
        {/* Navigation Controls */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-30 flex justify-between pointer-events-none">
          <button
            onClick={() => move("left")}
            className="pointer-events-auto p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl transition-all duration-300 hover:bg-primary-600 hover:border-primary-500 hover:scale-110 active:scale-95 group opacity-0 md:group-hover/section:opacity-100"
          >
            <CaretLeft size={24} weight="bold" />
          </button>

          <button
            onClick={() => move("right")}
            className="pointer-events-auto p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl transition-all duration-300 hover:bg-primary-600 hover:border-primary-500 hover:scale-110 active:scale-95 group opacity-0 md:group-hover/section:opacity-100"
          >
            <CaretRight size={24} weight="bold" />
          </button>
        </div>

        {/* Slider Logic Wrapper */}

        <div
          ref={sliderRef}
          onScroll={handleScrollEnd}
          onMouseEnter={stopAuto}
          onMouseLeave={startAuto}
          className="flex w-full overflow-x-scroll scrollbar-hide scroll-smooth rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.15)] border border-gray-100"
        >
          {slides.map((place, i) => (
            <div
              key={`${place._id}-${i}`}
              className="relative w-full h-[500px] lg:h-[650px] shrink-0 overflow-hidden group/card"
            >
              <Image
                src={place.image_url}
                alt={place.place_name}
                fill
                className="object-cover transition-transform duration-[4000ms] ease-out scale-100 group-hover/card:scale-110"
              />

              {/* Multi-layered Cinematic Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-60" />
              
              <div className="absolute inset-x-0 bottom-0 p-10 lg:p-20">
                <div className="max-w-2xl">
                  {/* Category Tag */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="px-4 py-1.5 bg-primary-600/90 backdrop-blur-md rounded-full shadow-lg shadow-primary-600/20 border border-primary-500/50">
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white">
                        {place.type}
                      </span>
                    </div>
                    <div className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary-400">
                        {place.time_taken_minutes} Mins Away
                      </span>
                    </div>
                  </div>

                  <h2 className="text-4xl lg:text-6xl font-semibold font-display tracking-tight text-white mb-6 leading-[1.1]">
                    {place.place_name.split(' ').map((word, idx) => (
                      <span key={idx} className={idx % 2 !== 0 ? "italic-serif text-primary-400" : ""}>
                        {word}{' '}
                      </span>
                    ))}
                  </h2>

                  <p className="text-base lg:text-lg text-white/70 font-jakarta leading-relaxed mb-8 max-w-xl line-clamp-3">
                    {place.description}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-primary-400">
                      <MapPinAreaIcon size={24} weight="duotone" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Location Details</span>
                      <p className="text-sm font-jakarta text-white/90">{place.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Corner Elements */}
              <div className="absolute top-8 right-8 w-24 h-24 border-t-2 border-r-2 border-white/10 rounded-tr-[2rem]" />
              <div className="absolute bottom-8 left-8 w-24 h-24 border-b-2 border-l-2 border-white/10 rounded-bl-[2rem] opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
            </div>
          ))}
        </div>
      </section> : <NoDataFound text="No attractions found near this paying guest house." />}
    </div>
  );
}