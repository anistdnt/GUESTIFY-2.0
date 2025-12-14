import Image from "next/image";
import { AttractionPlace } from "@/types/admin";
import { Clock, MapPin } from "@phosphor-icons/react/dist/ssr";

interface AttractionCardProps {
  attraction: AttractionPlace;
}

export function AttractionCard({ attraction }: AttractionCardProps) {
  return (
    <div className="group h-[400px] bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Image */}
      <div className="relative w-full h-48 bg-gray-100">
        {attraction.image_url ? (
          <Image
            src={attraction.image_url}
            alt={attraction.place_name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No image available
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Type Badge */}
        <div className="flex flex-col justify-between gap-3">
          <div className="flex justify-between items-center">
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 capitalize">
              {attraction.type}
            </span>
            {/* Time */}
            <div className="flex items-start justify-end gap-1 text-sm font-medium text-gray-700">
              <Clock size={20} />
              <span>{attraction.time_taken_minutes} min walk</span>
            </div>
          </div>

          <div className="flex-1 justify-between">
            <div>
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-800 leading-tight mb-1">
                {attraction.place_name}
              </h3>

              <hr />
              {/* Address */}
              <div className="flex gap-2 text-sm text-gray-500 mt-1">
                <MapPin size={20} weight="fill" />
                <p>{attraction.address}</p>
              </div>
            </div>

            {/* Description */}
            {attraction.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mt-3">
                {attraction.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
