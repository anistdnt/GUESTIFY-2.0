"use client";

import ProfilePGCard from "@/components/DisplayCard/ProfilePGCard";
import { CardSkeleton } from "@/components/Loader/CardSkeleton";
import NoDataFound from "@/components/NoDataFound/NoDataFound";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { deleteSuccess, triggerRefetch } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import { Plus } from "@phosphor-icons/react";
import { Buildings, Star, TrendUp, Users } from "@phosphor-icons/react/dist/ssr";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const PGComponent = () => {
  const [loading, setloading] = useState<boolean>(false);
  const [statloading, setStatLoading] = useState<boolean>(false);
  const [cards, setCards] = useState<any>(null);
  const [statBox, setStatBox] = useState<any>({});
  const router = useRouter();
  const param = useParams();
  const dispatch = useDispatch();
  const isDeleted = useSelector(
    (state: RootState) => state.modal_slice.isDeleted
  );
  const isRefetch = useSelector(
    (state: RootState) => state.modal_slice.isRefetch
  );

  function handleRoute() {
    router.push(`/admin/${param?.uid}/pg/new`);
  }

  function MyPGHeader({ stats }: { stats: any }) {
    const boxes = [
      { label: "Occupancy Rate", value: `${stats?.percent_occupied || 0}%`, icon: TrendUp, color: "text-emerald-500", bg: "bg-emerald-50" },
      { label: "Occupied Units", value: stats?.occupied_rooms || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
      { label: "Available Inventory", value: stats?.available_rooms || 0, icon: Buildings, color: "text-primary-600", bg: "bg-primary-50" },
      { label: "Global Reviews", value: stats?.total_reviews || 0, icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
    ];
    return (
      <div className="mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {boxes.map((box, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-[0_15px_40px_rgba(0,0,0,0.02)] border border-gray-50 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1"
            >
              <div className={`p-3 w-12 h-12 rounded-2xl ${box.bg} ${box.color} mb-4 flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                <box.icon size={24} weight="duotone" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 font-jakarta">{box.label}</p>
              <p className="text-4xl font-bold text-gray-900 font-display tracking-tight">{box.value}</p>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gray-50 rounded-full blur-2xl group-hover:bg-primary-50 transition-colors duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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

  const fetchPgs_Stats = async () => {
    setStatLoading(true);
    const res: ApiReturn<any> = await api_caller<any>(
      "GET",
      `${API.PG.GET_PG_STATS?.replace(":uid", param?.uid as string)}`
    );
    if (res.success) {
      setStatBox(res?.data);
    } else {
      toast.error(`${res.message} : ${res.error}`);
      setStatBox({});
    }
    setStatLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isDeleted]);

  useEffect(() => {
    fetchPgs_ByUser();
    fetchPgs_Stats();
    dispatch(deleteSuccess(false));
  }, [isDeleted, isRefetch]);

  useEffect(() => {
    if (isRefetch) {
      fetchPgs_ByUser();
      dispatch(triggerRefetch(false));
    }
  }, [isRefetch]);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-12">
      {/* Cinematic Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary-600 font-bold uppercase tracking-[0.3em] text-[10px]">
                <span className="w-8 h-[2px] bg-primary-600"></span>
                Inventory Management
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-normal text-gray-900 tracking-tight">
                Manage <span className="font-bold text-primary-600">Properties</span>
            </h1>
            <p className="text-gray-500 max-w-2xl font-jakarta text-base leading-relaxed">
                Centralized control for your PG network. Update property details, monitor inventory health, and ensure your listings are optimized for peak performance.
            </p>
        </div>
        
        <div className="hidden lg:flex items-center gap-4 bg-gray-50/50 p-4 rounded-3xl border border-gray-100 backdrop-blur-sm h-fit">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-primary-600">
                <Buildings size={24} weight="bold" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Fleet</p>
                <p className="text-sm font-bold text-gray-900">{cards?.length || 0} <span className="text-gray-400 ml-1 font-normal">Properties</span></p>
            </div>
        </div>
      </div>

      {statloading ? (
        <div className="animate-pulse space-y-6 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 rounded-3xl bg-gray-100"></div>
            ))}
          </div>
        </div>
      ) : (
        <MyPGHeader stats={statBox} />
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-gray-900 font-jakarta">Property Listings</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Real-time data</p>
        </div>

        {loading ? (
            <CardSkeleton no_of_card={4} />
        ) : cards?.length === 0 ? (
            <div className="w-full py-20 bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200">
            <NoDataFound
                text="No Paying Guest House Found"
                redirectBtn={{
                text: "Add New Paying Guest House",
                link: `/admin/${param?.uid}/pg/new`,
                }}
            />
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {cards?.map((item: any, index: number) => (
                <div key={index} className="w-full">
                <ProfilePGCard item={item} />
                </div>
            ))}
            </div>
        )}
      </div>

      {/* Floating Action Button - Premium Redesign */}
      <button
        className="fixed bottom-10 right-10 bg-gray-900 text-white pl-6 pr-4 py-3.5 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.4)] transition-all duration-300 transform hover:scale-105 group active:scale-95 flex items-center gap-4 z-50 border border-white/10"
        onClick={handleRoute}
      >
        <span className="text-sm font-bold font-jakarta tracking-wide">Add New PG</span>
        <div className="bg-primary-600 rounded-full p-2 group-hover:rotate-90 transition-transform duration-500 shadow-lg shadow-primary-600/30">
            <Plus size={20} weight="bold" />
        </div>
      </button>
    </div>
  );
};

export default PGComponent;
