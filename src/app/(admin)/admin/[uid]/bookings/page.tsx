"use client";

import { useState, useEffect, useRef } from "react";
import {
    Check,
    X,
    DownloadSimple,
    MagnifyingGlass,
    FunnelSimple,
    CaretDown,
    CaretLeft,
    CaretRight,
} from "@phosphor-icons/react";
import toast from "react-hot-toast";

export type BookingStatus = "pending" | "accepted" | "declined";

export interface Booking {
    id: string;
    image: string;
    name: string;
    pgName: string;
    dateOfBooking: string;
    status: BookingStatus;
    email?: string;
    phone?: string;
}

const SkeletonRow = () => (
    <div className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/5"></div>
            </div>
            <div className="flex gap-2">
                <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
            </div>
        </div>
    </div>
);

export default function BookingList() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<BookingStatus | "all">("all");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showPerPageMenu, setShowPerPageMenu] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(5);

    const filterDropdownRef = useRef<HTMLDivElement>(null);
    const perPageDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        setTimeout(() => {
            const mockBookings: Booking[] = Array.from({ length: 22 }).map((_, i) => ({
                id: `${i + 1}`,
                image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
                name: `User ${i + 1}`,
                pgName: ["Sunrise PG", "Royal Stay", "Comfort Zone", "Paradise PG"][i % 4],
                dateOfBooking: `2025-10-${(i % 28) + 1}`,
                status: ["pending", "accepted", "declined"][i % 3] as BookingStatus,
            }));
            setBookings(mockBookings);
            setLoading(false);
        }, 800);
    };

    const handleAccept = (id: string) => {
        setBookings((prev) =>
            prev.map((b) => (b.id === id ? { ...b, status: "accepted" } : b))
        );
        toast.success("Booking accepted successfully!");
    };

    const handleDecline = (id: string) => {
        setBookings((prev) =>
            prev.map((b) => (b.id === id ? { ...b, status: "declined" } : b))
        );
        toast.success("Booking declined");
    };

    const handleDownload = (b: Booking) => {
        const data = JSON.stringify(b, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `booking-${b.id}-${b.name}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Booking details downloaded");
    };

    const filteredBookings = bookings.filter((b) => {
        const matchesSearch =
            b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.pgName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || b.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const totalPages = Math.ceil(filteredBookings.length / perPage);
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    const getStatusBadge = (status: BookingStatus) => {
        const styles = {
            pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
            accepted: "bg-green-100 text-green-700 border-green-300",
            declined: "bg-red-100 text-red-700 border-red-300",
        };
        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (
                filterDropdownRef.current &&
                !filterDropdownRef.current.contains(e.target as Node)
            )
                setDropdownOpen(false);

            if (
                perPageDropdownRef.current &&
                !perPageDropdownRef.current.contains(e.target as Node)
            )
                setShowPerPageMenu(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-gray-500">
                    <span>Your</span> <br />
                    <span className="text-4xl font-semibold text-gray-700">
                        Booking <span className="text-yellow-700">Requests</span>
                    </span>
                </h1>
                <p className="text-gray-500 mt-2">
                    Review and manage all booking requests from tenants.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_0_10px_0_rgba(0,0,0,0.12)] p-6">
                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name or PG..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                    </div>

                    {/* Status Filter Dropdown */}
                    <div className="relative" ref={filterDropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center justify-between w-40 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-yellow-500"
                        >
                            <span className="flex items-center gap-2">
                                <FunnelSimple size={18} className="text-gray-500" />
                                {filterStatus === "all"
                                    ? "All Status"
                                    : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                            </span>
                            <CaretDown size={14} className="text-gray-500" />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 z-10 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-200 animate-fadeIn">
                                <div className="px-4 py-2 border-b text-gray-600 font-semibold text-sm">
                                    Filter by status
                                </div>
                                <ul className="py-2 text-sm text-gray-700">
                                    {["all", "pending", "accepted", "declined"].map((s) => (
                                        <li key={s}>
                                            <button
                                                onClick={() => {
                                                    setFilterStatus(s as BookingStatus | "all");
                                                    setDropdownOpen(false);
                                                }}
                                                className={`block w-full text-left px-4 py-2 rounded-md transition-colors duration-150 ${s === filterStatus
                                                        ? "bg-yellow-100 font-medium text-yellow-800"
                                                        : "hover:bg-yellow-50"
                                                    }`}
                                            >
                                                {s === "all"
                                                    ? "All Status"
                                                    : s.charAt(0).toUpperCase() + s.slice(1)}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    </div>
                </div>

                {/* Booking Cards */}
                <div className="space-y-4">
                    {loading ? (
                        Array(5)
                            .fill(0)
                            .map((_, i) => <SkeletonRow key={i} />)
                    ) : paginatedBookings.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg">No bookings found</p>
                        </div>
                    ) : (
                        paginatedBookings.map((b) => (
                            <div
                                key={b.id}
                                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                    <img
                                        src={b.image}
                                        alt={b.name}
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {b.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">{b.pgName}</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Booking Date: {formatDate(b.dateOfBooking)}
                                                </p>
                                            </div>
                                            <div>{getStatusBadge(b.status)}</div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAccept(b.id)}
                                            disabled={b.status !== "pending"}
                                            className={`p-2 rounded-md transition-all ${b.status === "pending"
                                                ? "bg-green-500 hover:bg-green-600 text-white"
                                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                }`}
                                            title="Accept"
                                        >
                                            <Check size={18} weight="bold" />
                                        </button>

                                        <button
                                            onClick={() => handleDecline(b.id)}
                                            disabled={b.status !== "pending"}
                                            className={`p-2 rounded-md transition-all ${b.status === "pending"
                                                ? "bg-red-500 hover:bg-red-600 text-white"
                                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                }`}
                                            title="Decline"
                                        >
                                            <X size={18} weight="bold" />
                                        </button>

                                        <button
                                            onClick={() => handleDownload(b)}
                                            className="p-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-all"
                                            title="Download"
                                        >
                                            <DownloadSimple size={18} weight="bold" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination Footer */}
                {!loading && filteredBookings.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 gap-3">
                        {/* Per page dropdown */}
                        <div className="relative" ref={perPageDropdownRef}>
                            <button
                                onClick={() => setShowPerPageMenu((prev) => !prev)}
                                className="flex items-center justify-between px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-yellow-400 focus:outline-none w-32"
                            >
                                {perPage} per page
                                <CaretDown size={14} className="ml-2 text-gray-500" />
                            </button>

                            {showPerPageMenu && (
                                <div
                                    className="absolute left-0 bottom-12 z-30 w-40 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-200 animate-fadeIn"
                                >
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
                                                    className={`block w-full px-4 py-2 text-left hover:bg-yellow-50 ${num === perPage ? "bg-yellow-100 font-medium" : ""
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

                        {/* Pagination */}
                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-40"
                            >
                                <CaretLeft size={16} weight="bold" />
                            </button>

                            <span>
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                                }
                                className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-40"
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
