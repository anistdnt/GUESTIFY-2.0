"use client";

export default function RoomFormSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-10">
        <div className="h-8 w-64 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-80 bg-gray-200 rounded"></div>
      </div>

      {/* One skeleton room card */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

          {/* Label + input */}
          <div>
            <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>

          <div>
            <div className="h-4 w-20 bg-gray-300 rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>

          <div>
            <div className="h-4 w-40 bg-gray-300 rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>

          <div>
            <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>

          <div>
            <div className="h-4 w-40 bg-gray-300 rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>

          <div>
            <div className="h-4 w-40 bg-gray-300 rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>

        </div>

        {/* Image skeleton */}
        <div className="h-[200px] w-full bg-gray-200 rounded"></div>

        {/* Delete button placeholder */}
        <div className="absolute top-4 right-4 h-6 w-6 bg-gray-300 rounded-full"></div>
      </div>

      {/* Add room button skeleton */}
      <div className="flex justify-center">
        <div className="h-10 w-32 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
