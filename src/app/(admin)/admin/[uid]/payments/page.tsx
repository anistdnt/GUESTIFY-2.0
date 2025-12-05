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
    const [sortBy, setSortBy] = useState("generatedAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");


    const [dropdownOpen, setDropdownOpen] = useState<"" | "filter" | "sort">("");
    const filterDropdownRef = useRef<HTMLDivElement>(null);

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
    }, [currentPage, perPage, filterStatus, debouncedSearch, sortBy, sortOrder]);

    const fetchPaymentLogs = async () => {
        setLoading(true);
        try {
            const res: ApiReturn<any> = await api_caller(
                "GET",
                `${API.ADMIN.PAYMENTS.LOGS}?page=${currentPage}&show=${perPage}&filter=${filterStatus}&search=${debouncedSearch}`
            );

            if (res?.success) {
                const mapped = res?.data?.map((p: any) => ({
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

                // SORTING LOGIC
                mapped.sort((a: any, b: any) => {
                    const valA = sortBy === "amount" ? a.amount : new Date(a.generatedAt).getTime();
                    const valB = sortBy === "amount" ? b.amount : new Date(b.generatedAt).getTime();

                    return sortOrder === "asc" ? valA - valB : valB - valA;
                });

                setLogs(mapped);
                setTotalPages(res.data.total_pages);
            } else {
                toast.error(res.message || "Failed to fetch logs");
            }
        } finally {
            setLoading(false);
        }
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-gray-500">
                    <span>View All</span> <br />
                    <span className="text-4xl font-semibold text-gray-700">
                        Payment <span className="text-yellow-700">Logs</span>
                    </span>
                </h1>
                <p className="text-gray-500 mt-2">
                    Track all payments made by tenants — amounts, methods, status and invoices.
                </p>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-xl shadow-[0_0_10px_0_rgba(0,0,0,0.12)] p-6">

                {/* Search + Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setFilterStatus("all");
                            setCurrentPage(1);
                            fetchPaymentLogs();
                        }}
                        className="p-3 border rounded-md bg-gray-100 hover:bg-gray-200"
                    >
                        <ArrowClockwise size={18} />
                    </button>

                    <div className="flex-1 relative">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by Name, Email or Method..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    {/* SORT SECTION */}

                    <div className="relative">
                        <button
                            onClick={() =>
                                setDropdownOpen(dropdownOpen === "sort" ? "" : "sort")
                            }
                            className="flex items-center gap-2 px-4 py-2 border rounded-lg"
                        >
                            <FunnelSimple size={18} />
                            Sort
                            <CaretDown size={14} />
                        </button>

                        {dropdownOpen === "sort" && (
                            <div className="absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-200 animate-fadeIn">
                                <div className="px-4 py-2 border-b text-gray-600 font-semibold text-sm">
                                    Sort by
                                </div>

                                <ul className="py-2 text-sm text-gray-700">
                                    {[
                                        { label: "Newest First", sortBy: "generatedAt", sortOrder: "desc" },
                                        { label: "Oldest First", sortBy: "generatedAt", sortOrder: "asc" },
                                        { label: "Amount – High to Low", sortBy: "amount", sortOrder: "desc" },
                                        { label: "Amount – Low to High", sortBy: "amount", sortOrder: "asc" },
                                    ].map((opt) => {
                                        const isSelected =
                                            sortBy === opt.sortBy && sortOrder === opt.sortOrder;

                                        return (
                                            <li key={opt.label}>
                                                <button
                                                    onClick={() => {
                                                        setSortBy(opt.sortBy as any);
                                                        setSortOrder(opt.sortOrder as any);
                                                        setDropdownOpen("");
                                                    }}
                                                    className={`block w-full text-left px-4 py-2 rounded-md transition-colors duration-150 ${isSelected
                                                        ? "bg-yellow-100 font-medium text-yellow-800"
                                                        : "hover:bg-yellow-50"
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
                                                    Payment Method: <span className="text-gray-800">{p.payment_method.toUpperCase()}</span>
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

                                    {/* Status Chip */}
                                    <span
                                        className={`text-xs px-3 py-1 rounded-full font-semibold tracking-wide self-start ${p.payment_status === "paid"
                                            ? "bg-green-100 text-green-700"
                                            : p.payment_status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {p.payment_status.toUpperCase()}
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
                                        className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors text-sm"
                                    >
                                        <Download size={18} />
                                    </button>

                                </div>
                            </div>

                        ))
                    )}
                </div>

                {/* Pagination */}
                {!loading && logs.length > 0 && (
                    <div className="mt-6 pt-4 border-t flex items-center justify-between text-sm text-gray-600">
                        <div>
                            <span>{perPage} per page</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                                className="p-2 border rounded-md disabled:opacity-30"
                            >
                                <CaretLeft size={16} />
                            </button>
                            <span>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                                className="p-2 border rounded-md disabled:opacity-30"
                            >
                                <CaretRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
