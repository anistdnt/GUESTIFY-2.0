"use client";

import { useEffect, useRef, useState } from "react";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import {
  ClockAfternoon,
  CreditCard,
  DownloadSimple,
  UserCheck,
} from "@phosphor-icons/react";
import { Money } from "@phosphor-icons/react/dist/ssr";

export interface PaymentInvoice {
  url: string;
  generated_at: string;
}

export interface PaymentIntent {
  name: string;
  email: string;
}

export interface PaymentLog {
  _id: string;
  booking_id: string;
  amount: number;
  payment_status: "paid" | "failed" | "pending" | string; // adjust if needed
  payment_method: "card" | "upi" | "cash" | "bank" | string;
  transaction_id: string;
  invoice: PaymentInvoice;
  intent: PaymentIntent;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PaymentResponse {
  page: number;
  per_page: number;
  total_pages: number;
  payments: PaymentLog[];
}


export default function BookingPaymentLogs({ booking_id }: any) {
  const [payments, setPayments] = useState<PaymentLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const bottomRef = useRef<HTMLDivElement>(null);

  async function fetchPayments(pageNo: number) {
    try {
      if (pageNo === 1) setLoading(true);
      else setLoadingMore(true);

      const res: ApiReturn<PaymentResponse> = await api_caller<PaymentResponse>(
        "GET",
        `${API.ADMIN.BOOKING.PAYMENTS}`
          .replace(":id", booking_id)
          + `?page=${pageNo}&show=5`
      );

      if (!res.success) throw new Error(res.message || "Failed to load payments");

      const newPayments = res.data.payments || [];

      setPayments((prev) => (pageNo === 1 ? newPayments : [...prev, ...newPayments]));

      setHasMore(pageNo < res.data.total_pages);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    if (booking_id) {
      setPage(1);
      fetchPayments(1);
    }
  }, [booking_id]);

  // Observe bottom of list for infinite scroll
  useEffect(() => {
    if (!bottomRef.current || !hasMore || loadingMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPayments(nextPage);
      }
    });

    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [bottomRef.current, hasMore, loadingMore, page]);

  const Loader = () => (
    <div className="space-y-4 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 bg-gray-100 border rounded-xl">
          <div className="h-4 w-32 bg-gray-300 rounded mb-2" />
          <div className="h-4 w-20 bg-gray-300 rounded mb-2" />
          <div className="h-4 w-40 bg-gray-300 rounded mb-4" />
          <div className="h-8 w-24 bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  );

  function downloadFile(url: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = "invoice.pdf";
    a.click();
  }

  if (loading && page === 1) return <Loader />;

  if (!payments.length) {
    return <p className="text-gray-500 text-sm">No payment logs available.</p>;
  }

  return (
    <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
      {payments.map((p) => (
        <div
          key={p._id}
          className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-gray-700">
                <Money className="w-4 h-4" /> Amount:
                <span className="font-semibold text-gray-900">₹{p?.amount}</span>
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <CreditCard className="w-4 h-4" /> Method:
                <span className="font-medium">{p?.payment_method}</span>
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <ClockAfternoon className="w-4 h-4" /> Date:
                <span>{new Date(p?.createdAt).toLocaleString()}</span>
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <UserCheck className="w-4 h-4" /> Paid By:
                <span className="font-semibold">{p?.intent?.name} ({p?.intent?.email})</span>
              </p>
            </div>

            {/* Download Invoice */}
            <button
              onClick={() => downloadFile(p.invoice?.url)}
              className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <DownloadSimple className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      {/* Sentinel div for infinite scroll */}
      <div ref={bottomRef} className="h-10"></div>

      {loadingMore && (
        <p className="text-center text-gray-500 text-sm py-3">Loading more…</p>
      )}
    </div>
  );
}