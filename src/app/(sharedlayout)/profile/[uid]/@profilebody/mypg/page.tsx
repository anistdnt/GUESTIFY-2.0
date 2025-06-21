"use client";
import DisplayCard from "@/components/DisplayCard/DisplayCard";
import { RootState } from "@/redux/store";
import { Plus } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const Page = () => {
  const router = useRouter();

  const profile_info = useSelector(
    (state: RootState) => state.user_slice.userData
  );

  function handleRoute() {
    router.push(`/add-pg/${profile_info?._id}`);
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 justify-items-center">
      <DisplayCard number_of_stars={4} />
      <DisplayCard number_of_stars={3} />
      <DisplayCard number_of_stars={2} />
      <DisplayCard number_of_stars={5} />
      <DisplayCard number_of_stars={4} />

      <button
        className="fixed flex bottom-10 right-10 bg-black/70 text-white p-4 rounded-full shadow-lg hover:bg-black/80 transition-transform transform hover:scale-105"
        onClick={handleRoute}
        title="Add PG"
      >
        <p className="me-3">Add PG</p>
        <Plus size={20} weight="bold" />
      </button>
    </div>
  );
};

export default Page;
