import Image from "next/image";
import { AttractionPlace } from "@/types/admin";
import { Clock, MapPin, Trash } from "@phosphor-icons/react/dist/ssr";

interface AttractionCardProps {
  attraction: AttractionPlace;
  onDelete?: (id: string) => void;
}

export function AttractionCard({ attraction, onDelete }: AttractionCardProps) {
  return (
    <div className="relative h-[420px] bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      
      {/* IMAGE */}
      <div className="relative w-full h-48 bg-gray-100">
        {attraction.image_url ? (
          <Image
            src={attraction.image_url}
            alt={attraction.place_name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No image available
          </div>
        )}

        {/* DELETE BUTTON – ALWAYS VISIBLE */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(attraction._id);
          }}
          className="
            absolute top-3 right-3 z-10
            bg-white/90 backdrop-blur
            text-red-600 hover:bg-red-50
            p-2 rounded-full shadow
            transition-colors duration-200
          "
          aria-label="Delete attraction"
        >
          <Trash size={18} weight="bold" />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 capitalize">
              {attraction.type}
            </span>

            <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
              <Clock size={20} />
              <span>{attraction.time_taken_minutes} min walk</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 leading-tight mb-1">
              {attraction.place_name}
            </h3>

            <hr />

            <div className="flex gap-2 text-sm text-gray-500 mt-1">
              <MapPin size={20} weight="fill" />
              <p>{attraction.address}</p>
            </div>
          </div>

          {attraction.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mt-2 mb-2">
              {attraction.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
