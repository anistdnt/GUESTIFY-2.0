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
import { ChartPolar, Buildings, Users, TrendUp, Receipt, Star, Clock, CheckCircle } from "@phosphor-icons/react";
import { BuildingApartment } from "@phosphor-icons/react/dist/ssr";

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

const THEME_COLORS = ["#ca8a04", "#e5e7eb"]; // Primary-600 and Light Gray

function StatPie({
  title,
  centerLabel,
  data,
  icon: Icon,
}: {
  title: string;
  centerLabel: string;
  data: { name: string; value: number }[];
  icon: any;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] p-8 flex flex-col items-center border border-gray-50 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.04)] group">
      <div className="w-full flex justify-between items-start mb-6">
        <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors duration-500">
           <Icon size={24} weight="duotone" />
        </div>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">{title}</p>
      </div>

      <div className="relative w-full h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={4}
              stroke="none"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={THEME_COLORS[index % THEME_COLORS.length]} className="outline-none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-gray-900 font-display">{centerLabel}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total</p>
        </div>
      </div>

      {/* Status Legend */}
      <div className="mt-6 w-full space-y-3">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors duration-300 border border-transparent hover:border-gray-100"
          >
            <div className="flex items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: THEME_COLORS[index % THEME_COLORS.length] }}
              />
              <span className="text-xs font-bold text-gray-600 font-jakarta uppercase tracking-tight">{item.name}</span>
            </div>
            <span className="font-bold text-gray-900 font-display text-sm">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatBoxes({ stats }: { stats: StatsResponse }) {
  const boxes = [
    { label: "Total PG Houses", value: stats?.totalPGs || 0, icon: Buildings, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Enlisted Rooms", value: stats?.totalRooms || 0, icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
    { label: "Global Reviews", value: stats?.totalReviews || 0, icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Avg Rooms/PG", value: stats?.averageRoomsPerPG || 0, icon: ChartPolar, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Total Revenue", value: stats?.totalRevenue || 0, icon: Receipt, color: "text-primary-600", bg: "bg-primary-50", prefix: "₹" },
    { label: "Total Occupants", value: stats?.totalOccupants || 0, icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
    { label: "Booking Percentage", value: stats?.bookingPercentage || 0, icon: TrendUp, color: "text-emerald-500", bg: "bg-emerald-50", suffix: "%" },
    { label: "Pending Tasks", value: stats?.pendingBookings || 0, icon: Clock, color: "text-red-500", bg: "bg-red-50" },
  ];

  const occupancyData = [
    { name: "Occupied", value: stats?.totalOccupants || 0 },
    { name: "Vacant", value: Math.max((stats?.totalRooms || 0) - (stats?.totalOccupants || 0), 0) },
  ];

  const bookingStatusData = [
    { name: "Pending", value: stats?.pendingBookings || 0 },
    { name: "Completed", value: Math.max((stats?.totalRooms || 0) - (stats?.pendingBookings || 0), 0) },
  ];

  const bookingPercentageData = [
    { name: "Booked", value: stats?.bookingPercentage || 0 },
    { name: "Available", value: 100 - (stats?.bookingPercentage || 0) },
  ];

  return (
    <>
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {boxes.map((box, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-[0_15px_40px_rgba(0,0,0,0.02)] border border-gray-50 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1"
          >
            <div className={`p-3 w-12 h-12 rounded-2xl ${box.bg} ${box.color} mb-4 flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                <box.icon size={24} weight="duotone" />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 font-jakarta">{box.label}</p>
            <div className="flex items-baseline gap-1">
                {box.prefix && <span className="text-xl font-bold text-gray-500">{box.prefix}</span>}
                <p className="text-4xl font-bold text-gray-900 font-display tracking-tight">{box.value}</p>
                {box.suffix && <span className="text-xl font-bold text-gray-500">{box.suffix}</span>}
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gray-50 rounded-full blur-2xl group-hover:bg-primary-50 transition-colors duration-500"></div>
          </div>
        ))}
      </div>

      {/* Pie Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <StatPie
          title="Room Occupancy"
          centerLabel={`${stats?.totalOccupants || 0}`}
          data={occupancyData}
          icon={Users}
        />
        <StatPie
          title="Booking Requests"
          centerLabel={`${stats?.pendingBookings || 0}`}
          data={bookingStatusData}
          icon={Clock}
        />
        <StatPie
          title="Booking Performance"
          centerLabel={`${stats?.bookingPercentage || 0}%`}
          data={bookingPercentageData}
          icon={TrendUp}
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

  const [pgcatelogue, setPgCatelogue] = useState<{ label: string; value: string }[]>([]);
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
      const res: ApiReturn<any> = await api_caller<any>("GET", `${API.ADMIN.DASHBOARD.BOX?.replace(":uid", userid)}`);
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
    const fetchStats_RoomGraph = async (pg_id?: string, year?: number, type?: string) => {
      setGraphLoading(true);
      let url = `${API.ADMIN.DASHBOARD.ROOM_GRAPH?.replace(":uid", userid)}`;
      if (year) url += `?year=${year}`;
      if (pg_id) url += url?.includes("?") ? `&pg_id=${pg_id}` : `?pg_id=${pg_id}`;
      if (type) url += url?.includes("?") ? `&type=${type}` : `?type=${type}`;
      
      const res: ApiReturn<any> = await api_caller<any>("GET", url);
      if (res.success) {
        setRoomGraph(res?.data);
      } else {
        toast.error(`${res.message} : ${res.error}`);
        setRoomGraph([]);
      }
      setGraphLoading(false);
    };
    fetchStats_RoomGraph(roomgraphFilter?.pg_id, roomgraphFilter?.year, roomgraphFilter?.type);
  }, [roomgraphFilter?.year, roomgraphFilter?.pg_id, roomgraphFilter?.type]);

  useEffect(() => {
    const fetchStats_BookingLine = async (type?: string) => {
      setBookingLineLoading(true);
      let url = `${API.ADMIN.DASHBOARD.BOOKING_LINE}`;
      if (type) url += `?type=${type}`;
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

  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      border: '1px solid #f3f4f6',
      borderRadius: '12px',
      padding: '4px',
      boxShadow: 'none',
      '&:hover': { border: '1px solid #e5e7eb' },
      fontSize: '14px',
      fontWeight: '600'
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#ca8a04' : state.isFocused ? '#fefce8' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      fontSize: '14px',
      fontWeight: '500'
    })
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-12">
      {/* Cinematic Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary-600 font-bold uppercase tracking-[0.3em] text-[10px]">
                <span className="w-8 h-[2px] bg-primary-600"></span>
                Control Center
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-normal text-gray-900 tracking-tight">
                Owner <span className="font-bold text-primary-600">Dashboard</span>
            </h1>
            <p className="text-gray-500 max-w-2xl font-jakarta text-base leading-relaxed">
                Seamlessly manage your PG network. Monitor performance, track occupancy, and drive growth with high-fidelity analytics and simplified management tools.
            </p>
        </div>
        
        <div className="hidden lg:flex items-center gap-4 bg-gray-50/50 p-4 rounded-3xl border border-gray-100 backdrop-blur-sm">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-primary-600">
                <TrendUp size={24} weight="bold" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Platform Status</p>
                <p className="text-sm font-bold text-gray-900">v2.4.0 <span className="text-green-500 ml-1">Live</span></p>
            </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="space-y-8">
        {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-40 rounded-3xl bg-gray-100"></div>
                ))}
            </div>
        ) : (
            <StatBoxes stats={stats} />
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Bar Chart Section */}
        <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50 rounded-3xl p-8 transition-all hover:shadow-[0_25px_60px_rgba(0,0,0,0.04)] group">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
                <h2 className="text-xl font-bold text-gray-900 font-jakarta">Rooms Inventory</h2>
                <p className="text-sm text-gray-400 font-medium">Tracking enlisted rooms per {roomgraphFilter?.type}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                <button 
                  onClick={() => setRoomgraphFilter(prev => ({ ...prev, type: "day" }))}
                  className={`px-5 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${roomgraphFilter?.type === 'day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >Day</button>
                <button 
                  onClick={() => setRoomgraphFilter(prev => ({ ...prev, type: "month" }))}
                  className={`px-5 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${roomgraphFilter?.type === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >Month</button>
              </div>
              
              <div className="flex gap-2">
                <Select
                  options={pgcatelogue}
                  styles={customSelectStyles}
                  value={pgcatelogue.find(o => o.value === roomgraphFilter?.pg_id) || null}
                  onChange={(option) => setRoomgraphFilter(prev => ({ ...prev, pg_id: option?.value || "" }))}
                  placeholder="All Properties"
                  className="w-44"
                  isLoading={catelogueloading}
                  isClearable
                />
                <Select
                  options={yearCatelogue}
                  styles={customSelectStyles}
                  value={yearCatelogue.find(o => o.value === roomgraphFilter?.year) || null}
                  onChange={(option) => setRoomgraphFilter(prev => ({ ...prev, year: option?.value as any }))}
                  placeholder="Year"
                  className="w-32"
                  isLoading={catelogueloading}
                  isClearable
                />
              </div>
            </div>
          </div>

          <div className="h-[350px] w-full">
            {graphloading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
                <div className="w-10 h-10 border-4 border-gray-100 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="text-sm font-bold uppercase tracking-widest">Loading Analytics</p>
              </div>
            ) : roomgraph?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                <BuildingApartment size={48} weight="duotone" className="mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest">No inventory records found</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roomgraph} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="5 5" stroke="#f3f4f6" vertical={false} />
                  <XAxis 
                    dataKey={roomgraphFilter?.type === "day" ? "day" : "month"} 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }}
                    tickFormatter={(val, idx) => {
                      const item = roomgraph[idx];
                      if (!item) return "";
                      return roomgraphFilter?.type === "day" ? `${item.day} ${item.month.substring(0, 3)}` : item.month.substring(0, 3);
                    }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }} />
                  <Tooltip 
                    cursor={{ fill: '#f9f9f9' }}
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '16px' }}
                    labelStyle={{ fontWeight: 800, marginBottom: '8px', color: '#111827', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={roomgraphFilter?.type === 'day' ? 12 : 32}>
                    {roomgraph?.map((_, index) => (
                      <Cell key={index} fill={index === roomgraph.length - 1 ? "#ca8a04" : "#e5e7eb"} className="transition-all duration-300 hover:fill-primary-500" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Line Chart Section */}
        <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50 rounded-3xl p-8 transition-all hover:shadow-[0_25px_60px_rgba(0,0,0,0.04)] group">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-900 font-jakarta uppercase tracking-tight">Booking Velocity</h2>
                <div className="flex items-center gap-2 text-[10px] text-red-400 font-bold uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full w-fit">
                    <Clock size={12} weight="bold" />
                    20D Lifecycle Filter
                </div>
            </div>
            
            <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 h-fit">
              {['day', 'week', 'month'].map(t => (
                <button 
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-5 py-2 text-xs font-bold rounded-xl transition-all duration-300 capitalize ${type === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >{t}</button>
              ))}
            </div>
          </div>

          <div className="h-[350px] w-full">
            {bookinglineloading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
                <div className="w-10 h-10 border-4 border-gray-100 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="text-sm font-bold uppercase tracking-widest">Crunching Numbers</p>
              </div>
            ) : bookingLine?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                <Receipt size={48} weight="duotone" className="mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest">No booking analytics found</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bookingLine} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="5 5" stroke="#f3f4f6" vertical={false} />
                  <XAxis 
                    dataKey="label" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '16px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#ca8a04"
                    strokeWidth={4}
                    dot={{ fill: '#ca8a04', strokeWidth: 2, r: 5, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0, fill: '#111827' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
