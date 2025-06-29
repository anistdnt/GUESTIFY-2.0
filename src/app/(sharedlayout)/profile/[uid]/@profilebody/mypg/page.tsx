"use client";
import DisplayCard from "@/components/DisplayCard/DisplayCard";
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
              <DisplayCard item={item} number_of_stars={5} />
            </div>
          ))
        )}

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
  }
};

const CardSkeleton = ({ no_of_card }: { no_of_card: number }) => {
  return (
    <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 py-10 px-3 justify-items-center">
      {Array.from({ length: no_of_card }).map((_, i) => (
        <div
          key={i}
          className="mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 animate-pulse"
        >
          <div className="relative">
            <div className="w-full h-60 bg-gray-300" />
            <span className="absolute top-2 right-2 bg-gray-400 text-transparent text-xs px-2 py-1 rounded">
              Girls
            </span>
          </div>

          <div className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="h-5 bg-gray-300 rounded w-40 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-64" />
              </div>
              <div className="text-right">
                <div className="h-5 bg-gray-300 rounded w-20 mb-1" />
                <div className="h-3 bg-gray-200 rounded w-16" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-3 mb-2 text-xs">
              <div className="bg-gray-200 rounded px-2 py-1 w-24 h-4" />
              <div className="bg-gray-200 rounded px-2 py-1 w-28 h-4" />
              <div className="bg-gray-200 rounded px-2 py-1 w-20 h-4" />
            </div>

            <hr />

            <div className="flex flex-row">
              <div className="flex flex-col p-2">
                <div className="h-3 bg-gray-200 rounded w-24 mb-1" />
                <div className="h-3 bg-gray-300 rounded w-16" />
              </div>
              <div className="flex flex-col border-l p-2">
                <div className="h-3 bg-gray-200 rounded w-24 mb-1" />
                <div className="h-3 bg-gray-300 rounded w-16" />
              </div>
            </div>

            <hr />

            <div className="mt-2 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
            </div>

            <div className="flex flex-row justify-between items-center mt-4">
              <div className="h-4 bg-gray-300 rounded w-48" />
              <div className="flex gap-4">
                <div className="h-8 w-24 bg-gray-400 rounded" />
                <div className="h-8 w-28 bg-gray-300 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Page;
