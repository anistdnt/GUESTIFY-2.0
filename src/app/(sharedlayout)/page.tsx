// Importing Components

import DisplayCard from "@/components/DisplayCard/DisplayCard";
import Searchbar from "@/components/Searchbar/Searchbar";

export default function Home() {
  return (
    <>
      <div className="bg-gray-100 ">
        {/* Hero Section */}
        <section className="relative bg-[url('/assets/about-us-banner.jpg')] bg-fixed bg-bottom bg-cover text-white h-80 flex flex-col justify-center items-center">
          <div>
            <div className="absolute inset-0 bg-black bg-opacity-35"></div>
            <div className="relative mx-auto max-w-7xl text-center">
              <h1 className="text-5xl font-medium">
                {" "}
                Discover Your Perfect PG Stay
              </h1>
              <p className="mt-4 text-sm">
                Your trusted platform for finding paying guest accommodations in
                West Bengal.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="bg-gray-100 py-10">
        <Searchbar />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 py-10 px-3 justify-items-center">
        <DisplayCard number_of_stars={5} />
        <DisplayCard number_of_stars={5} />
      </div>
    </>
  );
}
