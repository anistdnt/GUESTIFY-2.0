"use client";

import Image from "next/image";
import { Warning, CheckCircle, Clock, Trash, Eye, CaretDown, User } from "@phosphor-icons/react";
import { formatDate } from "@/lib/utils/utilities";
import { useState } from "react";
import CommonConfirmationModal from "../Modals/CommonConfirmationModal";

interface AdminComplaintCardProps {
  complaint: any;
  onDelete: (id: string) => void;
  onStatusUpdate: (id: string, status: string) => void;
  onView: (complaint: any) => void;
}

const PriorityBadge = ({ priority }: { priority: string }) => {
  const styles: any = {
    high: "bg-red-50 text-red-600 border-red-100",
    medium: "bg-amber-50 text-amber-600 border-amber-100",
    low: "bg-green-50 text-green-600 border-green-100",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase border ${styles[priority] || "bg-gray-50 text-gray-500 border-gray-100"}`}>
      {priority}
    </span>
  );
};

export default function AdminComplaintCard({ complaint, onDelete, onStatusUpdate, onView }: AdminComplaintCardProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(complaint._id);
    setShowDeleteModal(false);
  };

  const statuses = [
    { label: "Pending", value: "pending", color: "bg-amber-500" },
    { label: "Resolved", value: "resolved", color: "bg-green-500" },
    { label: "Rejected", value: "rejected", color: "bg-red-500" },
  ];

  const currentStatus = statuses.find(s => s.value === complaint.status) || statuses[0];

  return (
    <>
      <div className="group relative bg-white border border-gray-100 rounded-[1rem] p-5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-100/10 flex flex-col animate-slideFadeIn">
        {/* User & Date Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600">
              <User size={20} weight="bold" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 font-jakarta line-clamp-1">
                {complaint.user_id?.first_name + " " + complaint.user_id?.last_name || "Anonymous User"}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <Clock size={12} />
                <span>{formatDate(complaint.createdAt)}</span>
              </div>
            </div>
          </div>
          
          {/* Status Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase text-white shadow-sm transition-all hover:brightness-110 ${currentStatus.color}`}
            >
              {currentStatus.label}
              <CaretDown size={12} weight="bold" className={`transition-transform duration-300 ${showStatusMenu ? "rotate-180" : ""}`} />
            </button>
            
            {showStatusMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowStatusMenu(false)}></div>
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  {statuses.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => {
                        onStatusUpdate(complaint._id, s.value);
                        setShowStatusMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors ${
                        complaint.status === s.value ? "text-primary-600 bg-primary-50/50" : "text-gray-500"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-normal text-gray-900 font-display tracking-tight group-hover:text-primary-600 transition-colors line-clamp-1 mb-1">
              {complaint.subject}
            </h4>
            <div className="flex items-center gap-2">
              <PriorityBadge priority={complaint.priority} />
              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                {complaint.complaint_type}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-500 font-jakarta line-clamp-2 leading-relaxed">
            {complaint.description}
          </p>
        </div>

        {/* Footer Info */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            {complaint.pg_id && (
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                PG: <span className="text-primary-600">{complaint.pg_id.pg_name}</span>
              </p>
            )}
            {complaint.room_id && (
              <p className="text-[9px] font-jakarta text-gray-400">
                Room: {complaint.room_id.room_type || "N/A"}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView(complaint)}
              className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:text-primary-600 hover:bg-primary-50 transition-all border border-transparent hover:border-primary-100"
              title="View Details"
            >
              <Eye size={18} weight="bold" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
              title="Delete"
            >
              <Trash size={18} weight="bold" />
            </button>
          </div>
        </div>
      </div>

      <CommonConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Permanently Delete Complaint?"
        message="Are you sure you want to delete this complaint? This action is irreversible and the record will be lost forever."
        confirmText="Confirm Delete"
        variant="danger"
      />
    </>
  );
}
