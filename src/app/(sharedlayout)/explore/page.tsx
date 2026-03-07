import CardSection from "@/components/DisplayCard/CardSection";
import { Districts } from "@/components/Searchbar/Districts";
import { FilterSection } from "@/components/Searchbar/Filter/FilterSection";
import ConfidenceSection from "@/components/SearchHub/ConfidenceSection";
import { metadataMap } from "@/metadata/metadata.config";
import Image from "next/image";
import { MapPin, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { TrendingDistrict } from "@/components/DisplayCard/TrendingDistrict";

export const metadata = metadataMap['explore_pg'];

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <>
      {/* Premium Explore Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden bg-gray-50/50">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary-50/30 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm mb-6 animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
            <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase font-jakarta">Discover West Bengal</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold text-gray-900 font-display tracking-tight leading-[1.1] mb-6">
            Explore <span className="text-primary-600 italic-serif">Stays</span> Across <br className="hidden md:block" /> Every District
          </h1>
          <p className="max-w-2xl mx-auto text-gray-500 font-jakarta text-lg leading-relaxed mb-10">
            Browse premium paying guest accommodations across West Bengal. 
            From bustling city centers to quiet academic hubs, find your 
            next home with precision.
          </p>
        </div>
      </section>

      {/* District Selection Area */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-1 mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 font-display tracking-tight">
              Select Your <span className="text-primary-600">District</span>
            </h2>
            <p className="text-sm text-gray-400 font-jakarta text-balance">Choose a location to see available accommodations in that area</p>
          </div>
          <div className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <Districts />
          </div>
        </div>
      </section>

      <ConfidenceSection />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-5xl font-semibold text-gray-900 font-display tracking-tight">
             Accommodations In <span className="italic-serif text-primary-600">Focus</span>
          </h2>
        </div>
        <CardSection isSearchByDist={true} />
      </div>

      <TrendingDistrict />
    </>
  );
}
