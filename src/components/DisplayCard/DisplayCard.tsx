import Image from "next/image";
import Rating from "../Rating/Rating";
import { CurrencyInr } from "@phosphor-icons/react/dist/ssr";

// type Props = {};

export default function DisplayCard() {
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
        <div className="text-cardTitle text-cardTitleCol font-medium font-cardTitle">
          Sample PG Title
        </div>
        <div className="text-cardDesCol text-cardDescription">
          27, Navakrishna Guie Lane , Kolkata-700010 , West Bengal, to this
          occation os
        </div>
        <div>
          <Rating no_of_star={5}/>
        </div>
        <div className="flex flex-row justify-between mt-2">
          <div className="flex flex-row justify-center items-center gap-2 text-cardTitle text-cardTitleCol font-semibold">
            <CurrencyInr size={20}/>
            <span>3000</span> 
            <span className="text-sm">p.m</span>
          </div>
          <button className="bg-buttons px-4 rounded-md font-semibold text-white">View</button>
        </div>
      </div>
    </div>
  );
}
