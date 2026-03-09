import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { ArrowSquareOut, Buildings, WarningCircle, MapPin, Hash } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import CommonButton from "../AppComponents/CommonButton";

type CollegeDoc = {
  _id: string;
  college_name: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  address: string;
  district: string;
  pincode: number;
  image_url: string;
  popular?: boolean;
  college_image_url?: string;
  explore_url?: string;
  description?: string;
};

export default async function CollegeSection({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { clg_id } = await searchParams;

  // If no college selected
  if (!clg_id) {
    return (
      <div className="w-full flex justify-center py-12">
        <div className="bg-white/80 backdrop-blur-sm border border-gray-100 p-10 rounded-2xl text-center max-w-lg shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-600">
             <Buildings size={32} weight="bold" />
          </div>
          <h2 className="text-2xl text-gray-900 font-display font-semibold tracking-tight">
            No College Selected
          </h2>
          <p className="text-gray-500 mt-3 font-jakarta text-sm leading-relaxed">
            Please choose a college to view detailed information <br className="hidden md:block" /> and find premium accommodations nearby.
          </p>
        </div>
      </div>
    );
  }

  // API Call
  const res: ApiReturn<CollegeDoc> = await api_caller<any>(
    "GET",
    `${API.COLLEGE.GET_BY_ID}/${clg_id}`
  );

  // If API Failed
  if (!res.success) {
    return (
      <div className="w-full flex justify-center py-12">
        <div className="bg-white border border-red-50 p-10 rounded-2xl text-center max-w-lg shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-600">
             <WarningCircle size={32} weight="bold" />
          </div>
          <h2 className="text-2xl text-gray-900 font-display font-semibold tracking-tight">
            Connection Interrupted
          </h2>
          <p className="text-gray-500 mt-2 font-jakarta text-sm">
            We couldn't load the college details. Please try again or go back.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/">
              <CommonButton variant="outline" size="md" className="border-red-100 text-red-600 hover:bg-red-50 font-jakarta">
                 RETURN TO HOME
              </CommonButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success Response
  const c = res.data;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 mb-4">
      <div
        className="
        bg-white 
        rounded-2xl 
        shadow-[0_8px_30px_rgb(0,0,0,0.04)]
        border border-gray-100
        overflow-hidden 
        flex flex-col md:flex-row
        min-h-[400px]
        group
        "
      >
        {/* LEFT IMAGE */}
        <div className="md:w-1/2 h-72 md:h-auto relative overflow-hidden">
          <Image
            src={c?.college_image_url || "/college/college_placeholder.jpg"}
            alt={c.college_name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* RIGHT CONTENT */}
        <div
          className="
          md:w-1/2 
          bg-white
          text-black 
          p-8 lg:p-12
          flex flex-col 
          justify-between
          relative
        "
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                <Image
                  src={c.image_url || "/college/college_logo_placeholder.png"}
                  alt={"logo"}
                  width={32}
                  height={32}
                  className="rounded-lg object-cover"
                />
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 font-display tracking-tight leading-tight">
                {c.college_name}
              </h1>
            </div>
            
            <p className="text-gray-500 font-jakarta leading-relaxed text-[15px] max-w-xl">
              {c?.description ? (c.description.length > 250
                ? c.description.substring(0, 250) + "..."
                : c.description) : 'Experience a premium academic environment with world-class facilities. This institution is dedicated to fostering excellence and providing students with a holistic developmental journey.'}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-100">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                  <MapPin size={18} weight="bold" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-0.5">Location</p>
                  <p className="text-sm text-gray-700 font-semibold font-jakarta leading-snug">{c.address}</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 text-gray-400 rounded-lg">
                    <Buildings size={18} weight="bold" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-0.5">District</p>
                    <p className="text-sm text-gray-700 font-bold font-jakarta">{c.district}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 text-gray-400 rounded-lg">
                    <Hash size={18} weight="bold" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-0.5">Pincode</p>
                    <p className="text-sm text-gray-700 font-bold font-jakarta">{c.pincode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <Link href={c?.explore_url || "#"} target="_blank">
               <CommonButton 
                  variant="primary" 
                  size="lg" 
                  className="rounded-xl px-8 shadow-lg shadow-primary-100"
                  icon={<ArrowSquareOut size={20} weight="bold" />}
                  iconPosition="right"
                >
                  VISIT WEBSITE
               </CommonButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
