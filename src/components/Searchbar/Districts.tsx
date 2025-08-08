import { distType } from "@/types/generic";
import Image from "next/image";

const districtMap: distType[] = [
  {
    id: 1,
    name: "Alipore",
    altname: "alipore",
    searchval: "alipore",
    srcimage: "/assets/login_illustration.webp",
  },
  {
    id: 2,
    name: "Kolkata",
    altname: "kolkata",
    searchval: "kolkata",
    srcimage: "/assets/login_illustration.webp",
  },
  {
    id: 3,
    name: "Howrah",
    altname: "howrah",
    searchval: "howrah",
    srcimage: "/assets/login_illustration.webp",
  },
  {
    id: 4,
    name: "Baruipur",
    altname: "baruipur",
    searchval: "baruipur",
    srcimage: "/assets/login_illustration.webp",
  },
];

export const Districts = () => (
  <div className="mx-auto flex space-x-4 overflow-x-auto p-4 w-full max-w-screen-md scrollbar-hide">
    {districtMap.map((district) => (
      <div
        className="flex flex-col items-center justify-center w-32 h-36 bg-white border border-gray-800 text-sm font-semibold rounded-lg shrink-0"
        key={district.id + district.altname}
      >
        <Image
          src={district.srcimage}
          height={600}
          width={600}
          alt={district.altname}
        />
        <p className="mt-2">{district.name}</p>
      </div>
    ))}
  </div>
);