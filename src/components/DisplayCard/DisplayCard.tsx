import Image from "next/image";
import Rating from "../Rating/Rating";

type Props = {};

export default function DisplayCard({}: Props) {
  return (
    <div className="flex flex-col justify-center items-start bg-cardsBackground m-4 px-1 pt-1 pb-3 max-w-96 rounded-md">
      <Image
        src={"/assets/sample1.jpg"}
        alt="House"
        width={400}
        height={400}
        loading="eager"
        className="rounded-md"
      />
      <div className="flex flex-col gap-2 mt-3 px-2">
        <div className="text-cardTitle font-medium font-cardTitle">
          Sample PG Title
        </div>
        <div>
          27, Navakrishna Guie Lane , Kolkata-700010 , West Bengal, to this
          occation os
        </div>
        <div>
          <Rating no_of_star={3}/>
        </div>
        <div className="flex flex-row justify-between mt-2">
          <div className="text-cardTitle font-semibold">Rs. 3000 <span className="text-sm">p.m</span></div>
          <button className="bg-buttons px-4 rounded-md font-semibold text-white">View</button>
        </div>
      </div>
    </div>
  );
}
