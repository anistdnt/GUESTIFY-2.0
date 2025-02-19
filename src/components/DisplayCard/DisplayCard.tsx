"use client"
import Image from "next/image";
import Rating from "../Rating/Rating";
import { CurrencyInr } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";


type Props = {
  number_of_stars : number;
};

export default function DisplayCard({number_of_stars} : Props) {
  const router = useRouter()
  return (
    <div className="flex flex-col justify-center items-start bg-cardsBackground m-4 px-1 pt-1 pb-3 w-full rounded-md">
      <Image
        src={"/assets/sample1.jpg"}
        alt="House"
        width={400}
        height={400}
        loading="eager"
        className="rounded-md w-full"
      />
      <div className="flex flex-col gap-2 mt-3 px-2 w-full">
        <div className="text-cardTitle text-cardTitleCol font-medium font-cardTitle">
          Sample PG Title
        </div>
        <div className="text-cardDesCol text-cardDescription">
          27, Navakrishna Guie Lane , Kolkata-700010 , West Bengal, to this
          occation os
        </div>
        <div>
          <Rating no_of_star={number_of_stars}/>
        </div>
        <div className="flex flex-row justify-between mt-2">
          <div className="flex flex-row justify-center items-center gap-2 text-cardTitle text-cardTitleCol font-semibold">
            <CurrencyInr size={20}/>
            <span>3000</span> 
            <span className="text-sm">p.m</span>
          </div>
          <button onClick={()=>router.push("/pginfo")} className="bg-buttons px-4 rounded-md font-semibold text-white">View</button>
        </div>
      </div>
    </div>
  );
}
