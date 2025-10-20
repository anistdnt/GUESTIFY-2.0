"use client";

import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type PGByMonth = {
  date: string;
  month: string;
  count: number;
};

type StatsResponse = {
  user_id: string;
  totalPGs: number;
  totalRooms: number;
  totalReviews: number;
  avgRoomsPerPG: number;
  pgsByMonth: PGByMonth[];
};

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="space-y-8 animate-pulse">
    {/* Stat boxes skeleton */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array(4)
        .fill(0)
        .map((_, idx) => (
          <div key={idx} className="rounded-2xl bg-gray-200 h-32"></div>
        ))}
    </div>
    {/* Chart skeleton */}
    <div className="bg-gray-200 rounded-2xl h-80 w-full"></div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const param = useParams();

  const userid = param?.uid as string;

  useEffect(() => {
    const fetchStats_ByUser = async () => {
      setLoading(true);
      const res: ApiReturn<any> = await api_caller<any>(
        "GET",
        `${API.USER.GET_STATS}/${userid}`
      );
      if (res.success) {
        setStats(res?.data);
      } else {
        toast.error(`${res.message} : ${res.error}`);
        setStats(null);
      }
      setLoading(false);
    };

    if (userid) {
      fetchStats_ByUser();
    }
  }, [userid]);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (stats) {
    const boxes = [
      { label: "Total Paying Guest House Enlisted", value: stats.totalPGs },
      { label: "Total Rooms Enlisted", value: stats.totalRooms },
      { label: "Total Reviews", value: stats.totalReviews },
      {
        label: "Average Rooms / Paying Guest House",
        value: stats.avgRoomsPerPG,
      },
      { label: "Monthly Earnings / Revenue", value: "6532"},
      { label: "Total Tenants / Occupants", value: "12458"},
      { label: "Booking Percentage", value: "85%"},
      { label: "Pending Requests", value: "23"},
    ];

    return (
      <div className="p-6 space-y-8">
        <div>
          <h1 className="text-gray-500">
            <span>Welcome to your</span> <br />{" "}
            <span className="text-4xl font-semibold text-gray-700">
              Admin <span className="text-yellow-700">Dashboard</span>
            </span>
          </h1>
          <p className="text-gray-500 mt-2">
            manage your Paying Guest listings, monitor tenant activities, and
            keep everything <br />
            running smoothly in one place.
          </p>
        </div>

        {/* Stat Boxes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

        {/* Bar Chart */}
        <div className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.12)] rounded-2xl p-6 transition-shadow hover:shadow-[0_0_18px_rgba(0,0,0,0.2)]">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-600">
              Enlisted PG's per Month
            </h2>
          </div>
          {stats.pgsByMonth?.length === 0 ? (
            <div
              className="flex justify-center items-center"
              style={{ width: "100%", height: "300px" }}
            >
              No Records Found
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.pgsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(value, index) => {
                    const item = stats.pgsByMonth[index];
                    if (!item) return "";
                    const year = item.date.split("-")[0];
                    return `${item.month} ${year}`;
                  }}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "rgba(167,134,4,0.1)" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-4 rounded-lg shadow-md min-w-[220px]">
                          <p className="font-semibold mb-2 text-gray-500">
                            Enlisted {data.count} PG
                            {data.count > 1 ? "s" : ""}
                          </p>
                          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                            {data?.pgs?.map((pg: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2"
                              >
                                <img
                                  src={pg.imageUrl}
                                  alt={pg.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <span className="text-sm">{pg.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stats.pgsByMonth.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill="#a78604"
                      className="transition-all duration-300 hover:fill-yellow-600 hover:filter hover:drop-shadow-[0_0_8px_rgba(167,134,4,0.6)]"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    );
  }

  return null;
}
