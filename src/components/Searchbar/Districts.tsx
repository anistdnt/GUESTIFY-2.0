"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { District, westBengalDistricts } from "@/data/westbengal_districts";
import { useRouter, useSearchParams } from "next/navigation";

export const Districts = () => {
  const query = useSearchParams();
  const [selected, setSelected] = useState<string | null>(query?.get("district") || null);
  const router = useRouter();

  useEffect(()=>{
    if(selected){
      router?.push(`/explore?district=${selected}`)
    }
  },[selected])

  return (
    <div className="mx-auto flex space-x-4 overflow-x-auto p-4 w-full max-w-screen-md scrollbar-hide">
      {westBengalDistricts.map((district: District, ind: number) => {
        const isActive = selected === district.value;

        return (
          <div
            key={ind}
            onClick={() => setSelected(district.value)}
            className={`flex flex-col items-center justify-start w-24 shrink-0 cursor-pointer 
            transition-transform duration-200 active:scale-95 hover:text-yellow-700`}
          >
            {/* CIRCULAR IMAGE WRAPPER */}
            <div
              className={`w-20 h-20 rounded-full overflow-hidden border 
              flex items-center justify-center bg-white transition-all duration-300
              ${isActive ? "scale-110 border-yellow-700 shadow-lg" : "scale-100 border-gray-300"}`}
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

            {/* LABEL */}
            <p
              className={`mt-2 text-sm font-medium text-center transition-colors duration-300 hover:text-yellow-700
              ${isActive ? "text-yellow-800 font-semibold" : "text-gray-800"}`}
            >
              {district.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};
