"use client";

import { useState, useEffect, useRef } from "react";
import {
  MagnifyingGlass,
  FunnelSimple,
  CaretDown,
  CaretLeft,
  CaretRight,
  ArrowClockwise,
  DownloadSimple,
  Download,
} from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import NoDataFound from "@/components/NoDataFound/NoDataFound";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getCurrentMonthName,
  getCurrentWeekNumber,
} from "@/lib/utils/utilities";
import { CurrencyInr } from "@phosphor-icons/react/dist/ssr";
import { PaymentResponse } from "../Modals/Booking/PaymentLogs";

interface PaymentLog {
  id: string;
  amount: number;
  payment_status: string;
  payment_method: string;
  name: string;
  email: string;
  invoice_url: string;
  createdAt: string;
  generatedAt: string;
}

interface PaymentResponseForAdmin extends PaymentResponse {
  total: number;
  filter: string;
  search: string;
}

type TransactionLineType = {
  totalAmount: number;
  count: number;
  name: string;
};

const SkeletonRow = () => (
  <div className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

export default function PaymentLogList() {
  const [logs, setLogs] = useState<PaymentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("-create");
  // const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showPerPageMenu, setShowPerPageMenu] = useState<boolean>(false);
  const perPageDropdownRef = useRef<HTMLDivElement>(null);

  const [dropdownOpen, setDropdownOpen] = useState<"" | "filter" | "sort">("");
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const [transactionLine, setTransactionLine] = useState<TransactionLineType[]>(
    []
  );
  const [transactionLineLoading, setTransactionLineLoading] =
    useState<boolean>(false);
  const [type, setType] = useState<string>("week");
  const [transactionSummary, setTransactionSummary] = useState<
    Record<string, number>
  >({});
  const [transactionSummaryLoading, setTransactionSummaryLoading] =
    useState<boolean>(false);

  // debounce
  function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
  }
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchPaymentLogs();
  }, [currentPage, perPage, filterStatus, debouncedSearch, sortBy]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        (filterDropdownRef.current &&
          !filterDropdownRef.current.contains(e.target as Node)) ||
        (sortDropdownRef.current &&
          !sortDropdownRef.current.contains(e.target as Node))
      )
        setDropdownOpen("");

      if (
        perPageDropdownRef.current &&
        !perPageDropdownRef.current.contains(e.target as Node)
      )
        setShowPerPageMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchPaymentLogs = async () => {
    setLoading(true);
    try {
      const res: ApiReturn<PaymentResponseForAdmin> =
        await api_caller<PaymentResponseForAdmin>(
          "GET",
          `${API.ADMIN.PAYMENTS.LOGS}?page=${currentPage}&show=${perPage}&filter=${filterStatus}&search=${debouncedSearch}&sort=${sortBy}`
        );

      if (res?.success) {
        const mapped = res?.data?.payments?.map((p: any) => ({
          id: p?._id,
          amount: p?.amount,
          payment_status: p?.payment_status,
          payment_method: p?.payment_method,
          name: p?.intent?.name,
          email: p?.intent?.email,
          invoice_url: p?.invoice?.url,
          createdAt: p?.createdAt,
          generatedAt: p?.invoice?.generated_at,
        }));

        setLogs(mapped);
        setTotalPages(res.data.total_pages);
      } else {
        toast.error(res.message || "Failed to fetch logs");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchStats_TransactionLine = async (type?: string) => {
      setTransactionLineLoading(true);
      let url = `${API.ADMIN.PAYMENTS.TRANSACTION_STATS}`;
      // Build Queries
      if (type) {
        url += `?type=${type}`;
      }
      const res: ApiReturn<any> = await api_caller<any>("GET", url);
      if (res.success) {
        setTransactionLine(res?.data);
      } else {
        toast.error(`${res.message} : ${res.error}`);
        setTransactionLine([]);
      }
      setTransactionLineLoading(false);
    };
    fetchStats_TransactionLine(type);
  }, [type]);

  useEffect(() => {
    const fetchStats_TransactionSummary = async () => {
      setTransactionSummaryLoading(true);
      let url = `${API.ADMIN.PAYMENTS.TRANSACTION_SUMMARY}`;
      const res: ApiReturn<any> = await api_caller<any>("GET", url);
      if (res.success) {
        setTransactionSummary(res?.data);
      } else {
        toast.error(`${res.message} : ${res.error}`);
        setTransactionSummary({});
      }
      setTransactionSummaryLoading(false);
    };
    fetchStats_TransactionSummary();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      {/* Cinematic Heading Banner */}
      <div className="relative overflow-hidden bg-white rounded-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 group">
        {/* Decorative Background Element */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-50 rounded-full blur-3xl group-hover:bg-primary-100/50 transition-colors duration-700"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-[10px] font-bold uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-pulse"></span>
              Financial Control Center
            </div>
            <h1 className="text-gray-400 font-medium text-lg font-jakarta">
              View All
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-display tracking-tight">
              Payment <span className="text-primary-600">Logs</span>
            </h2>
            <p className="text-gray-500 max-w-2xl font-jakarta text-sm leading-relaxed pt-2">
              Monitor and analyze all financial transactions across your property portfolio. Real-time tracking of amounts, methods, and status ensuring fiscal precision.
            </p>
          </div>
          
          <div className="hidden lg:block text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Processed Transactions</p>
            <p className="text-3xl font-bold text-gray-900 font-display">{transactionSummary?.totalTransactions || 0}</p>
          </div>
        </div>
      </div>

      {/* Summary and Stats */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100 rounded-3xl p-8 transition-shadow hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] lg:w-4/6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-900 font-display">
                Transaction Analytics
              </h2>
              <p className="text-sm text-gray-500 font-jakarta">
                Revenue visualization over time (Week / Month)
              </p>
            </div>
            <div className="flex items-center p-1 bg-gray-50 rounded-xl border border-gray-100">
              <button
                onClick={() => setType("week")}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  type === "week"
                    ? "bg-white text-primary-600 shadow-sm border border-gray-200"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setType("month")}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  type === "month"
                    ? "bg-white text-primary-600 shadow-sm border border-gray-200"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Month
              </button>
            </div>
          </div>
          {transactionLineLoading && (
            <div>
              <div
                className="flex justify-center items-center"
                style={{ width: "100%", height: "250px" }}
              >
                Loading...
              </div>
            </div>
          )}
          {!transactionLineLoading && transactionLine?.length === 0 && (
            <div
              className="flex justify-center items-center"
              style={{ width: "100%", height: "300px" }}
            >
              No Records Found
            </div>
          )}
          {!transactionLineLoading && transactionLine?.length !== 0 && (
            <ResponsiveContainer width="100%" height={250} className={"mt-8"}>
              <LineChart
                data={transactionLine?.map((item) => ({
                  label: item.name,
                  value: item.totalAmount,
                }))}
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

                {/* Show number of transactions */}
                <Tooltip
                  formatter={(value: any, name: any, props: any) => {
                    return [`₹ ${value.toLocaleString()}`, "Total Amount"];
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={4}
                  dot={{ r: 6, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="lg:w-2/6 flex flex-col gap-6">
          <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100 p-6 flex flex-col items-center text-center group hover:bg-primary-600 transition-all duration-500">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-500 transition-colors">
              <CurrencyInr size={24} className="text-primary-600 group-hover:text-white" />
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1 group-hover:text-primary-100">Total Revenue</p>
            <p className="text-4xl font-bold text-gray-900 font-display group-hover:text-white">
              ₹{(transactionSummary?.totalRevenue || 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{getCurrentMonthName()}</p>
                <p className="text-xl font-bold text-gray-900 font-display">₹{(transactionSummary?.thisMonthAmount || 0).toLocaleString()}</p>
                <div className="h-1 w-8 bg-primary-500 rounded-full"></div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Week {getCurrentWeekNumber()}</p>
                <p className="text-xl font-bold text-gray-900 font-display">₹{(transactionSummary?.thisWeekAmount || 0).toLocaleString()}</p>
                <div className="h-1 w-8 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100 p-6 flex flex-col items-center text-center">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Lifetime Transactions</p>
            <p className="text-4xl font-bold text-gray-900 font-display">
              {transactionSummary?.totalTransactions || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-[0_0_10px_0_rgba(0,0,0,0.12)] p-6">
        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("all");
              setCurrentPage(1);
              fetchPaymentLogs();
            }}
            className="p-3 border border-gray-100 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all active:scale-95"
          >
            <ArrowClockwise size={18} className="text-gray-600" />
          </button>

          <div className="flex-1 relative group">
            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Name, Email or Method..."
              className="w-full pl-12 pr-4 py-2.5 border border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-300 font-jakarta text-sm"
            />
          </div>

          {/* SORT SECTION */}

          <div className="relative" ref={sortDropdownRef}>
            <button
              onClick={() =>
                setDropdownOpen(dropdownOpen === "sort" ? "" : "sort")
              }
              className="flex items-center gap-3 px-5 py-2.5 border border-gray-100 rounded-xl bg-white hover:bg-gray-50 transition-all font-bold font-jakarta text-sm text-gray-700 shadow-sm active:scale-95"
            >
              <FunnelSimple size={18} className="text-primary-600" />
              Sort
              <CaretDown size={14} className={`text-gray-400 transition-transform ${dropdownOpen === 'sort' ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen === "sort" && (
                <div className="absolute right-0 z-50 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-2 animate-in fade-in zoom-in duration-200">
                <div className="px-4 py-2 mb-1 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                  Sort parameters
                </div>

                <ul className="space-y-1">
                  {[
                    { label: "Newest First", sortBy: "-create" },
                    { label: "Oldest First", sortBy: "create" },
                    { label: "Amount: High to Low", sortBy: "-amount" },
                    { label: "Amount: Low to High", sortBy: "amount" },
                  ].map((opt) => {
                    const isSelected = sortBy === opt.sortBy;

                    return (
                      <li key={opt.label}>
                        <button
                          onClick={() => {
                            setSortBy(opt.sortBy as any);
                            setDropdownOpen("");
                          }}
                          className={`block w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200 font-bold text-sm ${
                            isSelected
                              ? "bg-primary-50 text-primary-600"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          {opt.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Status Filter */}
          {/* <div className="relative" ref={filterDropdownRef}>
            <button
              onClick={() => setDropdownOpen(dropdownOpen === "filter" ? "" : "filter")}
              className="flex items-center justify-between w-40 px-4 py-2 border rounded-lg"
            >
              <span className="flex items-center gap-2 text-gray-700">
                <FunnelSimple size={18} />
                {filterStatus === "all"
                  ? "All Status"
                  : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
              </span>
              <CaretDown size={14} />
            </button>

            {dropdownOpen === "filter" && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow">
                {["all", "paid", "pending", "failed"].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setFilterStatus(s);
                      setDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      s === filterStatus ? "bg-yellow-100" : "hover:bg-gray-50"
                    }`}
                  >
                    {s === "all" ? "All Status" : s.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div> */}
        </div>

        {/* List */}
        <div className="space-y-4">
          {loading ? (
            Array(5)
              .fill(0)
              .map((_, i) => <SkeletonRow key={i} />)
          ) : logs.length === 0 ? (
            <NoDataFound text="No Payment Logs Found" />
          ) : (
            logs.map((p) => (
              <div
                key={p.id}
                className="bg-white p-5 rounded-xl shadow border border-gray-100 hover:shadow-md transition-all flex justify-between items-start gap-6"
              >
                {/* LEFT SECTION */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💳</span>
                  </div>

                  {/* DETAILS BLOCK */}
                  <div className="flex flex-col gap-3 w-full">
                    {/* Amount */}
                    <p className="text-2xl font-bold text-gray-800">
                      ₹ {p.amount.toLocaleString()}
                    </p>

                    {/* Payment Details + Customer Details */}
                    <div className="flex items-start gap-6">
                      {/* Payment Info */}
                      <div className="flex flex-col text-sm text-gray-600 gap-1 min-w-[200px]">
                        <span className="font-medium">
                          Payment Method:{" "}
                          <span className="text-gray-800">
                            {p.payment_method.toUpperCase()}
                          </span>
                        </span>

                        <span>
                          Paid At:{" "}
                          <span className="text-gray-800 font-medium">
                            {new Date(p.generatedAt).toLocaleString()}
                          </span>
                        </span>
                      </div>

                      {/* Vertical Divider */}
                      <div className="w-px bg-gray-200 h-10"></div>

                      {/* Customer Info */}
                      <div className="flex flex-col text-sm">
                        <p className="text-gray-700 font-semibold">{p.name}</p>
                        <p className="text-gray-500 text-xs">{p.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="flex flex-row items-start gap-3">
                  {/* Status */}
                  <span
                    className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest self-start border ${
                      p.payment_status === "paid"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : p.payment_status === "pending"
                        ? "bg-amber-50 text-amber-600 border-amber-100"
                        : "bg-red-50 text-red-600 border-red-100"
                    }`}
                  >
                    {p.payment_status}
                  </span>

                  {/* Download Button */}
                  <button
                    data-tooltip="Download Invoice"
                    onClick={() => {
                      const a = document.createElement("a");
                      a.download = "";
                      a.href = p.invoice_url;
                      a.click();
                    }}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-100 rounded-xl bg-white hover:bg-gray-50 hover:text-primary-600 transition-all shadow-sm active:scale-90"
                  >
                    <Download size={18} weight="bold" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && logs.length > 0 && (
          <div className="mt-6 pt-4 border-t flex items-center justify-between text-sm text-gray-600">
            <div className="relative" ref={perPageDropdownRef}>
              <button
                onClick={() => setShowPerPageMenu((prev) => !prev)}
                className="flex items-center justify-between px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-yellow-400 focus:outline-none w-32"
              >
                {perPage} per page
                <CaretDown size={14} className="ml-2 text-gray-500" />
              </button>

              {showPerPageMenu && (
                <div className="absolute left-0 bottom-12 z-30 w-40 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-200 animate-fadeIn">
                  <div className="px-4 py-2 border-b text-gray-600 font-semibold text-sm">
                    Rows per page
                  </div>
                  <ul className="py-2 text-sm text-gray-700">
                    {[5, 10, 20, 50].map((num) => (
                      <li key={num}>
                        <button
                          onClick={() => {
                            setPerPage(num);
                            setCurrentPage(1);
                            setShowPerPageMenu(false);
                          }}
                          className={`block w-full px-4 py-2 text-left hover:bg-yellow-50 ${
                            num === perPage ? "bg-yellow-100 font-medium" : ""
                          }`}
                        >
                          {num} rows
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2.5 border border-gray-100 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-all active:scale-95"
              >
                <CaretLeft size={16} weight="bold" />
              </button>
              <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 font-bold font-jakarta text-xs text-gray-600">
                Page {currentPage} <span className="text-gray-300 mx-1">/</span> {totalPages}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2.5 border border-gray-100 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-all active:scale-95"
              >
                <CaretRight size={16} weight="bold" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
