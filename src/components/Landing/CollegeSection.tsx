import Image from "next/image";
import Link from "next/link";

export default function CollegeSection({
  searchParams,
}: {
  searchParams: {
    coordinates?: string;
    clg_name?: string;
    clg_addr?: string;
    clg_pin?: string;
    clg_id?: string;
    kmradi?: string;
  };
}) {
  const { coordinates, clg_name, clg_addr, clg_pin, clg_id, kmradi } =
    searchParams;

  if (!clg_name) {
    return (
      <p className="text-center text-gray-500 mt-10">
        No college selected.
      </p>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto bg-transparent p-6 mt-8 flex flex-col md:flex-row items-center gap-6">
      {/* College Info */}
      <div className="flex-1 text-center">
        <h2 className="text-4xl font-bold text-white">{clg_name}</h2>
        <p className="text-white mt-1">{clg_addr}</p>
        <p className="text-white mt-1">Pincode: {clg_pin}</p>
        {coordinates && (
          <p className="text-sm text-white mt-2">
            Coordinates: {coordinates} (within {kmradi} km)
          </p>
        )}
      </div>
    </section>
  );
}
