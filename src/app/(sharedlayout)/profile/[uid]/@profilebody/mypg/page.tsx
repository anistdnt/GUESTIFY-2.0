"use client";

import ProfilePGCard from "@/components/DisplayCard/ProfilePGCard";
import { CardSkeleton } from "@/components/Loader/CardSkeleton";
import NoDataFound from "@/components/NoDataFound/NoDataFound";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { Plus } from "@phosphor-icons/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [loading, setloading] = useState<boolean>(false);
  const [cards, setCards] = useState<any>(null);
  const router = useRouter();
  const param = useParams();

  function handleRoute() {
    router.push("/pg/new");
  }

  useEffect(() => {
    const fetchPgs_ByUser = async () => {
      setloading(true);
      const res: ApiReturn<any> = await api_caller<any>(
        "GET",
        `${API.USER.GET_PGs}/${param?.uid}`
      );
      if (res.success) {
        setCards(res?.data);
      } else {
        toast.error(`${res.message} : ${res.error}`);
        setCards([]);
      }
      setloading(false);
    };

    fetchPgs_ByUser();
  }, []);

  if (loading) {
    return <CardSkeleton no_of_card={2} />;
  } else {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 justify-items-center">
        {cards?.length === 0 ? (
          <div className="w-full py-10">
            <NoDataFound text="No Paying Guest Home Found" />
          </div>
        ) : (
          cards?.map((item: any, index: number) => (
            <div
              key={index}
            >
              <ProfilePGCard item={item} number_of_stars={5}/>
              {/* <DisplayCard item={item} number_of_stars={5} /> */}
            </div>
          ))
        )}

        <button
          className="fixed flex bottom-10 right-10 bg-black/70 text-white p-4 rounded-full shadow-lg hover:bg-black/80 transition-transform transform hover:scale-105"
          onClick={handleRoute}
          title="Add PG"
        >
          <div data-tooltip="Add New Paying Guest" className="flex justify-center items-center gap-2">
            <p className="me-3">Add PG</p>
            <Plus size={20} weight="bold" />
          </div>
        </button>
      </div>
    );
  }
};

export default Page;
