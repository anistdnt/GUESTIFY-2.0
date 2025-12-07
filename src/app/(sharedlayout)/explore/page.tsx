import CardSection from "@/components/DisplayCard/CardSection";
import { Districts } from "@/components/Searchbar/Districts";
import { FilterSection } from "@/components/Searchbar/Filter/FilterSection";
import { metadataMap } from "@/metadata/metadata.config";

export const metadata = metadataMap['explore_pg'];

export default function ExplorePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <>
      <div className="bg-gray-100 py-10 flex flex-col gap-5">
        <div className="text-center px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700">
            Explore <span className="text-yellow-700">Paying Guest Houses</span> Across West Bengal
          </h2>
          
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Browse PGs based on location, compare amenities, and discover
            affordable stays near your college or workplace. Select a district
            below to get started.
          </p>
        </div>
        <hr/>
        <Districts />
      </div>

      <CardSection isSearchByDist={true} />
    </>
  );
}
