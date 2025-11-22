"use client";

export default function ContactDetailsFormSkeleton() {
  return (
    <div className="animate-pulse">

      {/* Caption */}
      <div className="mb-10">
        <div className="h-8 w-64 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-[300px] bg-gray-200 rounded"></div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Phone Number */}
        <div>
          <SkeletonLabel />
          <div className="flex gap-2">
            <SkeletonSelectSmall />
            <SkeletonInput />
            <SkeletonButton />
          </div>
          <SkeletonError />
        </div>

        {/* Alternate Phone */}
        <div>
          <SkeletonLabel />
          <div className="flex gap-2">
            <SkeletonSelectSmall />
            <SkeletonInput />
          </div>
          <SkeletonError />
        </div>

        {/* WhatsApp Number */}
        <div>
          <SkeletonLabel />
          <div className="flex gap-2 mb-2">
            <SkeletonSelectSmall />
            <SkeletonInput />
          </div>
          <div className="h-4 w-40 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Email */}
      <div className="mt-6">
        <SkeletonLabel />
        <div className="flex gap-2">
          <SkeletonInput />
          <SkeletonButton />
        </div>
        <SkeletonError />
      </div>

      {/* Preferred Contact Method */}
      <div className="mt-6">
        <SkeletonLabel />
        <div className="flex gap-4 mt-2">
          <SkeletonRadio />
          <SkeletonRadio />
          <SkeletonRadio />
        </div>
      </div>
    </div>
  );
}

/* Reusable skeletons */
function SkeletonLabel() {
  return <div className="h-4 w-48 bg-gray-300 rounded mb-2"></div>;
}

function SkeletonError() {
  return <div className="h-3 w-32 bg-gray-200 rounded mt-1"></div>;
}

function SkeletonInput() {
  return <div className="h-10 flex-1 bg-gray-300 rounded"></div>;
}

function SkeletonSelectSmall() {
  return <div className="h-10 w-32 bg-gray-300 rounded"></div>;
}

function SkeletonButton() {
  return <div className="h-10 w-28 bg-gray-300 rounded"></div>;
}

function SkeletonRadio() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
      <div className="h-4 w-20 bg-gray-300 rounded"></div>
    </div>
  );
}
