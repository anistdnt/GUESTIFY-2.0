import CardSection from "@/components/DisplayCard/CardSection";
import { FilterSection } from "@/components/Searchbar/Filter/FilterSection";
import Searchbar from "@/components/Searchbar/Searchbar";

export default function SearchPage() {
  return (
    <>
      <div className="bg-gray-100 py-10">
        <Searchbar />
      </div>

      <FilterSection/>
      <CardSection/>
    </>
  );
}