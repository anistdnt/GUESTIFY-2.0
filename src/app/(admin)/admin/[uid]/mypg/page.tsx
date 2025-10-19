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

function MyPGHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-800">My Enlisted PGs 🏠</h1>
      <p className="text-gray-500 mt-2 text-sm">
        Here you can manage all the Paying Guest houses you’ve added. You can
        view details, edit listings, or add new PGs anytime.
      </p>

      <div className="mt-5 grid sm:grid-cols-3 gap-4">
        <div className="bg-yellow-50 border rounded-xl p-4">
          <p className="text-sm text-gray-600">Total PGs</p>
          <h3 className="text-2xl font-bold text-yellow-700">8</h3>
        </div>
        <div className="bg-yellow-50 border rounded-xl p-4">
          <p className="text-sm text-gray-600">Active Rooms</p>
          <h3 className="text-2xl font-bold text-yellow-700">120</h3>
        </div>
        <div className="bg-yellow-50 border rounded-xl p-4">
          <p className="text-sm text-gray-600">Vacant Rooms</p>
          <h3 className="text-2xl font-bold text-yellow-700">42</h3>
        </div>
      </div>
    </div>
  );
}

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

  if (loading) {
    return <CardSkeleton no_of_card={2} />;
  } else if (cards?.length === 0 && !loading) {
    return (
      <div className="w-full py-10">
        <NoDataFound
          text="No Paying Guest House Found"
          redirectBtn={{
            text: "Add New Paying Guest House",
            link: "/pg/new",
          }}
        />
      </div>
    );
  } else {
    return (
      <>
        <MyPGHeader />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 justify-items-center">
          {cards?.map((item: any, index: number) => (
            <div key={index}>
              <ProfilePGCard item={item} />
              {/* <DisplayCard item={item} number_of_stars={5} /> */}
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
      </>
    );
  }
};

export default Page;
