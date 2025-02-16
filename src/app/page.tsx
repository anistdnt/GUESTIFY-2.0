// Importing Components
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="flex items-center  px-8 lg:px-16 bg-white">
        <div className="w-full lg:w-1/2  text-center lg:text-left">
          <h1 className="text-4xl text-center lg:text-7xl font-bold text-gray-600 ">
            Discover Your Perfect PG Stay
          </h1>

          <p className="mt-4 text-lg lg:text-medium text-gray-600 text-center">
            Find your ideal paying guest accommodation with ease.
          </p>
        </div>

        <div className="hidden md:block md:w-1/2 lg:block w-1/2">
          <Image
            src="/assets/mainImage.png"
            alt="PG Stay"
            width={500} // Set actual width
            height={500} // Set actual height
            className="w-full mb-9 "
          />
        </div>
      </div>

      <div className="mx-auto lg:w-3/5 p-4 bg-white rounded-lg shadow-lg">
        <div className="flex items-center border w-full border-gray-300 rounded-lg overflow-hidden">
          <select name="" id="" className=" w-1/2  border-l-purple-600">
            <option value="">College</option>
            <option value="">College</option>
            <option value="">College</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 focus:outline-none"
          />
          <button className="bg-black text-white px-6 py-2 hover:bg-gray-200 hover:text-black">
            Search
          </button>
        </div>
      </div>
    </>
  );
}
