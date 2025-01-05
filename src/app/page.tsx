// Importing Components
import DisplayCard from "@/components/DisplayCard/DisplayCard";

export default function Home() {
  return (
    <div className=" grid grid-cols-12 gap-3">
      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <DisplayCard />
      </div>
      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <DisplayCard />
      </div>
      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <DisplayCard />
      </div>
      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <DisplayCard />
      </div>
      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <DisplayCard />
      </div>
    </div>
  );
}
