"use client";

export default function PGFormSkeleton() {
  return (
    <div className="animate-pulse">

      {/* Caption Skeleton */}
      <div className="mb-10">
        <div className="h-8 w-64 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-80 bg-gray-200 rounded"></div>
      </div>

      {/* Form Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        
        {/* PG Name */}
        <SkeletonInput />

        {/* House Number */}
        <SkeletonInput />

        {/* Street Name */}
        <SkeletonInput />

        {/* District Select */}
        <SkeletonSelect />

        {/* State Select */}
        <SkeletonSelect />

        {/* Pincode */}
        <SkeletonInput />

        {/* PG Type */}
        <SkeletonSelect />

        {/* WiFi Availability */}
        <SkeletonSelect />

        {/* Wifi Speed (when wifi available) */}
        <SkeletonInput />

        {/* Additional Wifi Charge */}
        <div>
          <SkeletonLabel />
          <div className="flex gap-2">
            <div className="h-10 w-9/12 bg-gray-300 rounded"></div>
            <div className="h-10 w-3/12 bg-gray-300 rounded"></div>
          </div>
        </div>

        {/* Food Availability */}
        <SkeletonSelect />

        {/* Rules (CKEditor) */}
        <div className="md:col-span-2">
          <SkeletonLabel />
          <div className="h-[140px] bg-gray-300 rounded"></div>
        </div>

        {/* Image Picker */}
        <div>
          <SkeletonLabel />
          <div className="h-[250px] bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}

/* Reusable subcomponents */
function SkeletonLabel() {
  return <div className="h-4 w-40 bg-gray-300 rounded mb-2"></div>;
}

function SkeletonInput() {
  return (
    <div>
      <SkeletonLabel />
      <div className="h-10 bg-gray-300 rounded"></div>
    </div>
  );
}

function SkeletonSelect() {
  return (
    <div>
      <SkeletonLabel />
      <div className="h-10 bg-gray-300 rounded"></div>
    </div>
  );
}
