import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";

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
      <div className="w-full flex justify-center mt-16">
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl text-center max-w-md">
          <h2 className="text-xl text-white font-semibold">
            No College Selected
          </h2>
          <p className="text-gray-400 mt-2">
            Please choose a college to view detailed information.
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
      <div className="w-full flex justify-center mt-16">
        <div className="bg-red-950 border border-red-800 p-6 rounded-xl text-center max-w-md">
          <h2 className="text-xl text-red-300 font-semibold">
            Unable to Fetch Details
          </h2>
          <p className="text-red-400 mt-2">
            There was an issue loading the college information.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white transition"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  // Success Response
  const c = res.data;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 mb-10">
      <div
        className="
        bg-white 
        rounded-3xl 
        shadow-[0_0_10px_0_rgba(0,0,0,0.12)]
        overflow-hidden 
        flex flex-col md:flex-row
        min-h-[350px]
      "
      >
        {/* LEFT IMAGE */}
        <div className="md:w-1/2 h-64 md:h-auto relative">
          <Image
            // src={c.college_image_url || "/college/college_placeholder.jpg"}
            src={"/college/college_placeholder.jpg"}
            alt={c.college_name}
            fill
            className="object-cover"
            sizes="100%"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div
          className="
          md:w-1/2 
          bg-white
          text-black 
          p-8 
          flex flex-col 
          justify-between
        "
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col justify-start items-start gap-2">
              <Image
                src={c.image_url || "/college/college_logo_placeholder.png"}
                alt={"logo"}
                width={30}
                height={30}
                className="rounded-md border border-gray-200 object-cover"
              />
              <h1 className="text-3xl font-bold text-gray-700">{c.college_name}</h1>
            </div>
            {/* Description with details about the college in brief with spread if greater than 100 characters. */}
            <p className="text-gray-600 text-sm">
              {c?.description ? (c.description.length > 200
                ? c.description.substring(0, 200) + "..."
                : c.description) : 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quas tempore tenetur doloribus omnis quidem quam explicabo quibusdam provident neque culpa?'}
            </p>
            <hr />
            <div>
              <p className="mt-1 text-xl text-gray-600">{c.address}</p>

              <p className="mt-1 text-sm text-gray-600">
                District: <span className="font-medium">{c.district}</span>
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Pincode: <span className="font-medium">{c.pincode}</span>
              </p>
            </div>
          </div>

          <div>
            <Link
              href={c?.explore_url || "#"}
              target="_blank"
              className="
                mt-6
                bg-buttons 
                hover:bg-buttonsHover 
                text-white
                px-5 py-2.5 
                rounded-md 
                font-medium 
                transition
                flex gap-2 items-center justify-center
                w-fit
              "
            >
              <span>Explore More</span><ArrowSquareOut size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
