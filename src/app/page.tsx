// Importing Components
import DisplayCard from "@/components/DisplayCard/DisplayCard";

export default function Home() {
  return (
    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <DisplayCard number_of_stars={4}/>
      </div>
      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <DisplayCard number_of_stars={5}/>
      </div>
      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <DisplayCard number_of_stars={3}/>
      </div>
      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <DisplayCard number_of_stars={2}/>
      </div>
      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <DisplayCard number_of_stars={1}/>
      </div>
    </div>
  );
}
