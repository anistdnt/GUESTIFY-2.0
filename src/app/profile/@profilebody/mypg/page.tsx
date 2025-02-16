"use client"
import DisplayCard from "@/components/DisplayCard/DisplayCard"
import { Plus } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"



const page = () => {
  const router = useRouter();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 justify-items-center">
      <DisplayCard number_of_stars={4}/>
      <DisplayCard number_of_stars={3}/>
      <DisplayCard number_of_stars={2}/>
      <DisplayCard number_of_stars={5}/>
      <DisplayCard number_of_stars={4}/>

      <button 
    className="fixed bottom-10 right-10 bg-black/70 text-white p-4 rounded-full shadow-lg hover:bg-black/80 transition-transform transform hover:scale-105"
    onClick={() => router.push("/add-pg")} title="Add PG"
  >
    <Plus size={20} weight="bold"/>
  </button>
    </div>
  )
}

export default page
