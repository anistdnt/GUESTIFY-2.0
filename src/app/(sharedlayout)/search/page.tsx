import CardSection from "@/components/DisplayCard/CardSection";
import CollegeSection from "@/components/Landing/CollegeSection";
import { FilterSection } from "@/components/Searchbar/Filter/FilterSection";
import Searchbar from "@/components/Searchbar/Searchbar";
import { metadataMap } from "@/metadata/metadata.config";

export const metadata = metadataMap['search_pg'];

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <>
      <div className="bg-gray-100 py-10 flex flex-col gap-5 bg-fixed">
        <CollegeSection searchParams={searchParams} />
        <Searchbar />
      </div>

      <FilterSection />
      <CardSection />
    </>
  );
}
