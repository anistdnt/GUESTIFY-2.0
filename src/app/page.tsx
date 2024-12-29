// Importing Components 
import DisplayCard from "@/components/DisplayCard/DisplayCard";

export default function Home() {
  return (
    <div className="flex flex-wrap justify-center items-center min-h-screen">
      <DisplayCard/>
      <DisplayCard/>
      <DisplayCard/>
      <DisplayCard/>
      <DisplayCard/>
    </div>
  );
}
