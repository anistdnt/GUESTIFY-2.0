import { ArrowRight, MapPin } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

const trendingDistricts = [
  { name: "Kolkata", count: "450+ PGs", image: "https://images.unsplash.com/photo-1571679654681-ba01b9e1e117?q=80&w=400&auto=format&fit=crop" },
  { name: "North 24 Parganas", count: "320+ PGs", image: "https://images.unsplash.com/photo-1624314138470-5a2f24623f10?q=80&w=400&auto=format&fit=crop" },
  { name: "Howrah", count: "180+ PGs", image: "https://images.unsplash.com/photo-1571679654681-ba01b9e1e117?q=80&w=400&auto=format&fit=crop" },
  { name: "Hooghly", count: "120+ PGs", image: "https://images.unsplash.com/photo-1624314138470-5a2f24623f10?q=80&w=400&auto=format&fit=crop" }
];

export function TrendingDistrict() {
    return (
        <div>
            {/* Trending Districts Section */}
      <section className="pb-20 pt-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold text-gray-900 font-display tracking-tight">
                Trending <span className="text-primary-600 italic-serif">Destinations</span>
              </h2>
              <p className="text-gray-500 font-jakarta max-w-md leading-relaxed">Most searched locations with the highest concentration of premium PGs and student communities.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingDistricts.map((district, idx) => (
              <div 
                key={idx}
                className="group relative h-80 rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <Image 
                  src={district.image} 
                  alt={district.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-500" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 mb-2 text-white/70">
                    <MapPin size={14} weight="fill" />
                    <span className="text-[10px] font-bold tracking-widest uppercase">{district.count}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-display mb-4">{district.name}</h3>
                  <div className="flex items-center gap-2 text-primary-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span>EXPLORE NOW</span>
                    <ArrowRight size={16} weight="bold" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
        </div>
    );
}