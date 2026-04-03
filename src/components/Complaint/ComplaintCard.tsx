"use client";

import Image from "next/image";
import { Warning, CheckCircle, Clock, Trash, PencilSimple, CurrencyInr } from "@phosphor-icons/react";
import { formatDate } from "@/lib/utils/utilities";
import { useState } from "react";
import CommonConfirmationModal from "../Modals/CommonConfirmationModal";

interface ComplaintCardProps {
  complaint: any;
  onDelete?: (id: string) => void;
  onEdit?: (complaint: any) => void;
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

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    pending: "bg-amber-500 text-white",
    resolved: "bg-green-500 text-white",
    rejected: "bg-red-500 text-white",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase shadow-sm ${styles[status] || "bg-gray-500 text-white"}`}>
      {status}
    </span>
  );
};

export default function ComplaintCard({ complaint, onDelete, onEdit }: ComplaintCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(complaint._id);
    }
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="group relative bg-white border border-gray-100 rounded-[2rem] p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-100/10 flex flex-col">
      {/* Complaint Image */}
      {complaint.image_url && (
        <div className="relative w-full h-40 overflow-hidden rounded-[1.5rem] bg-gray-50 mb-4">
          <Image
            src={complaint.image_url}
            alt="Complaint Attachment"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex justify-between items-start mb-2">
        <h4 className="text-lg font-normal text-gray-900 font-display tracking-tight group-hover:text-primary-600 transition-colors line-clamp-1">
          {complaint.subject}
        </h4>
        <StatusBadge status={complaint.status} />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <PriorityBadge priority={complaint.priority} />
        <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
          {complaint.complaint_type}
        </span>
      </div>

      <p className="text-sm text-gray-500 font-jakarta line-clamp-3 mb-6 bg-gray-50/50 p-3 rounded-xl border border-gray-50">
        {complaint.description}
      </p>

      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-jakarta font-bold text-gray-400">
          <Clock size={14} />
          <span>{formatDate(complaint.createdAt)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              data-tooltip="Edit Complaint"
              onClick={() => onEdit(complaint)}
              className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-primary-600 hover:bg-primary-50 transition-all"
            >
              <PencilSimple size={16} />
            </button>
          )}
          {onDelete && (
             <button
              data-tooltip="Delete Complaint"
              onClick={handleDeleteClick}
              className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-red-600 hover:bg-red-50 transition-all"
            >
              <Trash size={16} />
            </button>
          )}
        </div>
      </div>
      {complaint.pg_id && (
        <div className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-primary-600"></span>
          {complaint.pg_id.pg_name}
        </div>
      )}
    </div>

    <CommonConfirmationModal
      isOpen={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      onConfirm={handleConfirmDelete}
      title="Delete Complaint"
      message="Are you sure you want to permanently delete this complaint? This action cannot be undone."
      confirmText="Confirm Delete"
      variant="danger"
    />
    </>
  );
}
