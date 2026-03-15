"use client";

import ComplaintCard from "./ComplaintCard";
import { MagnifyingGlass } from "@phosphor-icons/react";

interface ComplaintListProps {
  complaints: any[];
  loading: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (complaint: any) => void;
}

export default function ComplaintList({ complaints, loading, onDelete, onEdit }: ComplaintListProps) {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[40vh] space-y-4">
        <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
        <p className="text-gray-400 font-jakarta text-sm animate-pulse tracking-wide uppercase font-bold">Fetching complaints...</p>
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4 space-y-6 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
        <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center border border-gray-100">
          <MagnifyingGlass size={40} weight="thin" className="text-gray-200" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-normal text-gray-900 font-display tracking-tight">No complaints <span className="italic-serif text-primary-600">found</span></h3>
          <p className="text-gray-400 font-jakarta text-sm max-w-xs mx-auto">You haven't logged any complaints yet. Use the form on the left to report an issue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {complaints.map((complaint) => (
        <ComplaintCard
          key={complaint._id}
          complaint={complaint}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
