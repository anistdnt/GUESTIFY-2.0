"use client";

import ProfilePGCard from "@/components/DisplayCard/ProfilePGCard";
import { CardSkeleton } from "@/components/Loader/CardSkeleton";
import NoDataFound from "@/components/NoDataFound/NoDataFound";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { deleteSuccess } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import { Plus } from "@phosphor-icons/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const Page = () => {
  const [loading, setloading] = useState<boolean>(false);
  const [cards, setCards] = useState<any>(null);
  const router = useRouter();
  const param = useParams();
  const dispatch = useDispatch();
  const isDeleted = useSelector(
    (state: RootState) => state.modal_slice.isDeleted
  );

  function handleRoute() {
    router.push(`/admin/${param?.uid}/pg/new`);
  }

  function MyPGHeader() {
    const [boxes, setboxes] = useState<{ label: string; value: number }[]>([
      { label: "Total Paying Guest Enlisted", value: 0 },
      { label: "Occupied Rooms", value: 0 },
      { label: "Vacant Rooms", value: 0 },
      { label: "Average Rating", value: 0 },
    ]);
    return (
      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
          {boxes.map((box, idx) => (
            <div
              key={idx}
              className="rounded-2xl shadow-[0_0_10px_0_rgba(0,0,0,0.12)] bg-white px-4 py-5 flex flex-col gap-3 justify-center items-center"
            >
              <p className="text-gray-500 text-sm">{box.label}</p>
              <p className="text-5xl font-bold">{box.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isDeleted]);

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
    dispatch(deleteSuccess(false));
  }, [isDeleted]);

  return (
    <div className="p-6">
      <div>
        <h1 className="text-gray-500">
          <span className="text-gray-500 text-2xl">Manage Your</span> <br />
          <span className="text-4xl font-semibold text-gray-700">
            <span className="text-yellow-700">Paying Guest</span> Properties
          </span>
        </h1>
        <p className="text-gray-500 mt-2">
          Manage all your listed Paying Guest properties here — <br />
          update details, monitor occupancy, and keep your PGs performing at
          their best.
        </p>
      </div>
      {loading ? (
        <div className="animate-pulse space-y-6 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-gray-300"></div>
            ))}
          </div>
        </div>
      ) : (
        <MyPGHeader />
      )}
      {loading ? (
        <CardSkeleton no_of_card={2} />
      ) : cards?.length === 0 ? (
        <div className="w-full py-10">
          <NoDataFound
            text="No Paying Guest House Found"
            redirectBtn={{
              text: "Add New Paying Guest House",
              link: `/admin/${param?.uid}/pg/new`,
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 justify-items-center">
          {cards?.map((item: any, index: number) => (
            <div key={index}>
              <ProfilePGCard item={item} />
            </div>
          ))}

          <button
            className="fixed flex bottom-10 right-10 bg-black/70 text-white p-4 rounded-full shadow-lg hover:bg-black/80 transition-transform transform hover:scale-105"
            onClick={handleRoute}
            title="Add PG"
          >
            <div
              data-tooltip="Add New Paying Guest"
              className="flex justify-center items-center gap-2"
            >
              <p className="me-3">Add PG</p>
              <Plus size={20} weight="bold" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;
