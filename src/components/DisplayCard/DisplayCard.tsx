import Image from "next/image";
import Rating from "../Rating/Rating";
import { CurrencyInr, MapPin } from "@phosphor-icons/react/dist/ssr";

type Props = {
  number_of_stars: number;
};

export default function DisplayCard({ number_of_stars }: Props) {
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <div className="relative">
        <Image
          className="w-full h-60 object-cover"
          src={"/assets/sample1.jpg"}
          alt="PG Image"
          width={500}
          height={500}
        />
        <span className="absolute top-2 right-2 bg-pink-500 text-white text-xs px-2 py-1 rounded">
          Girls
        </span>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold">
              Happy Home PG
            </h3>
            <p className="text-sm text-gray-600">27, Nabakrishna Guie Lane, Near College, Kolkata-700021</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold flex flex-row justify-center items-center text-priceCol"><span><CurrencyInr size={15}/></span><span>10,000</span></p>
            <p className="text-sm text-gray-500">onwards</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-2 mb-2 text-xs text-green-700">
          <span className="bg-green-100 px-2 py-1 rounded">Food Included</span>
          <span className="bg-green-100 px-2 py-1 rounded">Wi-fi Available</span>
          <div className="flex items-center gap-1">
          <Rating no_of_star={number_of_stars}/>
          </div>
        </div>

        <hr/>

        <div className="flex flex-row">
          <div className="flex flex-col justify-start items-start text-sm text-gray-500 p-2">
            <p>Single Bed</p>
            <p className="font-bold flex flex-row justify-center items-center text-priceCol"><span><CurrencyInr size={10}/></span><span>10,000</span></p>
          </div>
          <div className="flex flex-col justify-start items-start text-sm text-gray-500 border-l p-2">
            <p>Double Bed</p>
            <p className="font-bold flex flex-row justify-center items-center text-priceCol"><span><CurrencyInr size={10}/></span><span>20,000</span></p>
          </div>
        </div>

        <hr/>
        <p className="mt-2 text-gray-700 text-sm">
          Home-cooked food, Wi-Fi, AC, and other amenities. Electricity
          included. Convenient location.
          <a href="#" className="text-blue-500">
            Read More
          </a>
        </p>

        <div className="flex flex-row flex-wrap gap-3 justify-between items-center text-sm text-gray-500 mt-3">
          <p className="flex flex-row justify-center items-center gap-2"><span><MapPin size={18} weight="fill" /></span> <span>0.7 km from the choosen location</span></p>
          <div className="flex gap-4">
          <button className="bg-buttons text-white px-4 py-2 rounded hover:bg-red-700">
            View full details
          </button>
          <button className="bg-buttonsSecondary text-white px-4 py-2 rounded hover:bg-orange-600">
            Contact Owner
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
