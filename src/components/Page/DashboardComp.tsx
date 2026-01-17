"use client";

import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Select from "react-select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie,
} from "recharts";

type PGByMonth = {
  date: string;
  month: string;
  count: number;
};

type StatsResponse = {
  _id: string;
  totalPGs: number;
  boysPG: number;
  girlsPG: number;
  totalRooms: number;
  totalReviews: number;
  totalBookings: number;
  pendingBookings: number;
  successfulBookings: number;
  totalOccupants: number;
  totalRevenue: number;
  bookingPercentage: number;
  averageRoomsPerPG: number;
};

type RoomGraphTypes = {
  year: string | number;
  month: string;
  count: number;
  day?: number;
};

type BookingLineType = {
  label: string;
  value: number;
};

const COLORS = ["#a78604", "#e5e7eb"];

function StatPie({
  title,
  centerLabel,
  data,
}: {
  title: string;
  centerLabel: string;
  data: { name: string; value: number }[];
}) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.12)] p-5 flex flex-col items-center">
      <p className="text-gray-600 text-sm mb-3 font-medium">{title}</p>

      <div className="relative w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={3}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            {/* Center Text */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xl font-bold fill-gray-800"
            >
              {centerLabel}
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Status Legend */}
      <div className="mt-4 w-full flex flex-col gap-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-sm text-gray-600"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span>{item.name}</span>
            </div>
            <span className="font-semibold text-gray-800">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatBoxes({ stats }: { stats: StatsResponse }) {
  const boxes = [
    { label: "Total Paying Guest House Enlisted", value: stats?.totalPGs || 0 },
    { label: "Total Rooms Enlisted", value: stats?.totalRooms || 0 },
    { label: "Total Reviews", value: stats?.totalReviews || 0 },
    {
      label: "Average Rooms / Paying Guest House",
      value: stats?.averageRoomsPerPG || 0,
    },
    { label: "Monthly Earnings / Revenue", value: stats?.totalRevenue || 0 },
    { label: "Total Tenants / Occupants", value: stats?.totalOccupants || 0 },
    {
      label: "Booking Percentage",
      value: `${stats?.bookingPercentage || 0}%`,
    },
    { label: "Pending Requests", value: stats?.pendingBookings || 0 },
  ];

  const occupancyData = [
    {
      name: "Occupied",
      value: stats?.totalOccupants || 0,
    },
    {
      name: "Vacant",
      value: Math.max(
        (stats?.totalRooms || 0) - (stats?.totalOccupants || 0),
        0,
      ),
    },
  ];

  const bookingStatusData = [
    {
      name: "Pending",
      value: stats?.pendingBookings || 0,
    },
    {
      name: "Completed",
      value: Math.max(
        (stats?.totalRooms || 0) - (stats?.pendingBookings || 0),
        0,
      ),
    },
  ];

  const bookingPercentageData = [
    {
      name: "Booked",
      value: stats?.bookingPercentage || 0,
    },
    {
      name: "Available",
      value: 100 - (stats?.bookingPercentage || 0),
    },
  ];

  return (
    <>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <StatPie
          title="Room Occupancy"
          centerLabel={`${stats?.totalOccupants || 0}`}
          data={occupancyData}
        />

        <StatPie
          title="Booking Requests"
          centerLabel={`${stats?.pendingBookings || 0}`}
          data={bookingStatusData}
        />

        <StatPie
          title="Booking Percentage"
          centerLabel={`${stats?.bookingPercentage || 0}%`}
          data={bookingPercentageData}
        />
      </div>
    </>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<StatsResponse | null>(null);

  const [roomgraph, setRoomGraph] = useState<RoomGraphTypes[]>([]);
  const [bookingLine, setBookingLine] = useState<BookingLineType[]>([]);
  const [type, setType] = useState<string>("day");

  const [pgcatelogue, setPgCatelogue] = useState<
    { label: string; value: string }[]
  >([]);
  const [roomgraphFilter, setRoomgraphFilter] = useState<{
    year?: number;
    pg_id?: string;
    type?: "month" | "day";
  }>({
    pg_id: "",
    year: undefined,
    type: "day",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [graphloading, setGraphLoading] = useState<boolean>(false);
  const [catelogueloading, setCatelogueLoading] = useState<boolean>(false);
  const [bookinglineloading, setBookingLineLoading] = useState<boolean>(false);

  const param = useParams();

  const userid = param?.uid as string;

  const yearCatelogue = [
    { label: "2026", value: 2026 },
    { label: "2025", value: 2025 },
    { label: "2024", value: 2024 },
  ];

  useEffect(() => {
    const fetchStats_Box = async () => {
      setLoading(true);
      const res: ApiReturn<any> = await api_caller<any>(
        "GET",
        `${API.ADMIN.DASHBOARD.BOX?.replace(":uid", userid)}`,
      );
      if (res.success) {
        setStats(res?.data);
      } else {
        toast.error(`${res.message} : ${res.error}`);
        setStats(null);
      }
      setLoading(false);
    };

    const fetchPGCatelogue = async () => {
      setCatelogueLoading(true);
      let url = `${API.PG.CATELOGUE?.replace(":uid", userid)}`;
      const res: ApiReturn<any> = await api_caller<any>("GET", url);
      if (res.success) {
        const options = res?.data?.map((i: any) => ({
          label: i?.pg_name || "",
          value: i?._id || "",
        }));
        setPgCatelogue(options);
      } else {
        toast.error(`${res.message} : ${res.error}`);
        setPgCatelogue([]);
      }
      setCatelogueLoading(false);
    };

    if (userid) {
      fetchStats_Box();
      fetchPGCatelogue();
    }
  }, [userid]);

  useEffect(() => {
    const fetchStats_RoomGraph = async (
      pg_id?: string,
      year?: number,
      type?: string,
    ) => {
      setGraphLoading(true);
      let url = `${API.ADMIN.DASHBOARD.ROOM_GRAPH?.replace(":uid", userid)}`;
      // Build Queries
      if (year) {
        url += `?year=${year}`;
      }
      if (pg_id) {
        url += url?.includes("?") ? `&pg_id=${pg_id}` : `?pg_id=${pg_id}`;
      }
      if (type) {
        url += url?.includes("?") ? `&type=${type}` : `?type=${type}`;
      }
      const res: ApiReturn<any> = await api_caller<any>("GET", url);
      if (res.success) {
        setRoomGraph(res?.data);
      } else {
        toast.error(`${res.message} : ${res.error}`);
        setRoomGraph([]);
      }
      setGraphLoading(false);
    };
    fetchStats_RoomGraph(
      roomgraphFilter?.pg_id,
      roomgraphFilter?.year,
      roomgraphFilter?.type,
    );
  }, [roomgraphFilter?.year, roomgraphFilter?.pg_id, roomgraphFilter?.type]);

  useEffect(() => {
    const fetchStats_BookingLine = async (type?: string) => {
      setBookingLineLoading(true);
      let url = `${API.ADMIN.DASHBOARD.BOOKING_LINE}`;
      // Build Queries
      if (type) {
        url += `?type=${type}`;
      }
      const res: ApiReturn<any> = await api_caller<any>("GET", url);
      if (res.success) {
        setBookingLine(res?.data);
      } else {
        toast.error(`${res.message} : ${res.error}`);
        setBookingLine([]);
      }
      setBookingLineLoading(false);
    };
    fetchStats_BookingLine(type);
  }, [type]);

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-gray-500">
          <span>Welcome to your</span> <br />{" "}
          <span className="text-4xl font-semibold text-gray-700">
            Owner <span className="text-yellow-700">Dashboard</span>
          </span>
        </h1>
        <p className="text-gray-500 mt-2">
          manage your Paying Guest listings, monitor tenant activities, and keep
          everything <br />
          running smoothly in one place.
        </p>
      </div>

      {/* Stat Boxes */}
      {loading ? (
        <div className="space-y-8 animate-pulse">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-gray-300"></div>
            ))}
          </div>
        </div>
      ) : (
        <StatBoxes stats={stats} />
      )}

      {/* Bar Chart */}
      <div className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.12)] rounded-2xl p-6 transition-shadow hover:shadow-[0_0_18px_rgba(0,0,0,0.2)]">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold mb-4 text-gray-600">
            Rooms Enlisted Per{" "}
            {roomgraphFilter?.type === "day" ? "Day" : "Month"}
          </h2>
          <div className="flex flex-row-reverse justify-end items-center gap-3">
            <div className="flex flex-row gap-3 justify-end items-center">
              <Select<{ label: string; value: string }, false>
                options={pgcatelogue}
                value={
                  pgcatelogue.find((o) => o.value === roomgraphFilter?.pg_id) ||
                  null
                }
                onChange={(option) =>
                  setRoomgraphFilter((prev) => ({
                    ...prev,
                    pg_id: option ? option.value : "",
                  }))
                }
                placeholder="Select PG"
                className="w-56"
                isLoading={catelogueloading}
                isClearable={true}
              />
              <Select<{ label: string; value: number }, false>
                options={yearCatelogue}
                value={
                  yearCatelogue.find(
                    (o) => o.value === roomgraphFilter?.year,
                  ) || null
                }
                onChange={(option) =>
                  setRoomgraphFilter((prev) => ({
                    ...prev,
                    year: option ? option.value : undefined,
                  }))
                }
                placeholder="Year"
                className="w-40"
                isLoading={catelogueloading}
                isClearable={true}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <input
                  type="radio"
                  name="roomGraphType"
                  value="month"
                  checked={roomgraphFilter?.type === "month"}
                  onChange={() =>
                    setRoomgraphFilter((prev) => ({
                      ...prev,
                      type: "month",
                    }))
                  }
                  className="accent-yellow-600"
                />
                Month
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <input
                  type="radio"
                  name="roomGraphType"
                  value="day"
                  checked={roomgraphFilter?.type === "day"}
                  onChange={() =>
                    setRoomgraphFilter((prev) => ({
                      ...prev,
                      type: "day",
                    }))
                  }
                  className="accent-yellow-600"
                />
                Day
              </label>
            </div>
          </div>
        </div>
        {graphloading && (
          <div>
            <div
              className="flex justify-center items-center"
              style={{ width: "100%", height: "300px" }}
            >
              Loading...
            </div>
          </div>
        )}
        {!graphloading && roomgraph?.length === 0 && (
          <div
            className="flex justify-center items-center"
            style={{ width: "100%", height: "300px" }}
          >
            No Records Found
          </div>
        )}
        {!graphloading && roomgraph?.length !== 0 && (
          <ResponsiveContainer width="100%" height={300} className={"mt-8"}>
            <BarChart data={roomgraph}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey={roomgraphFilter?.type === "day" ? "day" : "month"}
                tickFormatter={(value, index) => {
                  const item = roomgraph[index];
                  if (!item) return "";

                  if (roomgraphFilter?.type === "day") {
                    return `${item.day} ${item.month} ${item.year}`;
                  }

                  return `${item.month} ${item.year}`;
                }}
              />

              <YAxis allowDecimals={false} />

              <Tooltip
                formatter={(value: number) => [`${value}`, "Rooms"]}
                labelFormatter={(label, payload) => {
                  const item = payload?.[0]?.payload;
                  if (!item) return "";

                  if (roomgraphFilter?.type === "day") {
                    return `${item.day} ${item.month} ${item.year}`;
                  }

                  return `${item.month} ${item.year}`;
                }}
              />

              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {roomgraph?.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill="#a78604"
                    className="transition-all duration-300 hover:fill-yellow-600 hover:filter hover:drop-shadow-[0_0_8px_rgba(167,134,4,0.6)]"
                  />
                ))}
              </Bar>

              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b2f00" // very dark brown
                strokeWidth={1.8}
                dot={{ r: 3, fill: "#3b2f00" }}
                activeDot={{ r: 5, fill: "#3b2f00" }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Line Chart */}
      <div className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.12)] rounded-2xl p-6 transition-shadow hover:shadow-[0_0_18px_rgba(0,0,0,0.2)]">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold mb-4 text-gray-600">
            Booking Analytics
            <p className="text-sm text-gray-500 font-normal">
              Declined, Revolked or Cancel Bookings for more than 20 days will
              not be considered
            </p>
          </h2>
          <div className="flex flex-row gap-3 justify-end items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rangeType"
                value="day"
                checked={type === "day"}
                onChange={() => setType("day")}
              />
              <span>Day</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rangeType"
                value="week"
                checked={type === "week"}
                onChange={() => setType("week")}
              />
              <span>Week</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rangeType"
                value="month"
                checked={type === "month"}
                onChange={() => setType("month")}
              />
              <span>Month</span>
            </label>
          </div>
        </div>
        {bookinglineloading && (
          <div>
            <div
              className="flex justify-center items-center"
              style={{ width: "100%", height: "300px" }}
            >
              Loading...
            </div>
          </div>
        )}
        {!bookinglineloading && bookingLine?.length === 0 && (
          <div
            className="flex justify-center items-center"
            style={{ width: "100%", height: "300px" }}
          >
            No Records Found
          </div>
        )}
        {!bookinglineloading && bookingLine?.length !== 0 && (
          <ResponsiveContainer width="100%" height={300} className={"mt-8"}>
            <LineChart
              data={bookingLine}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="label"
                padding={{ left: 40, right: 40 }} // <-- Creates horizontal offset
              />

              <YAxis
                domain={["dataMin - 2", "dataMax + 2"]} // <-- Add vertical breathing space
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#ca8a04"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
