"use client";

import Image from "next/image";
import { X, User, Phone, MapPin, Calendar, WarningCircle, CheckCircle, Clock } from "@phosphor-icons/react";
import { formatDate } from "@/lib/utils/utilities";
import { EnvelopeIcon, UserIcon } from "@phosphor-icons/react/dist/ssr";

interface ComplaintDetailsModalProps {
  setshowModal: (show: boolean) => void;
  modalData: any;
}

export default function ComplaintDetailsModal({ setshowModal, modalData }: ComplaintDetailsModalProps) {
  const complaint = modalData || {};

  const statusIcons: any = {
    pending: <Clock className="text-amber-500" size={24} weight="bold" />,
    resolved: <CheckCircle className="text-green-500" size={24} weight="bold" />,
    rejected: <X className="text-red-500" size={24} weight="bold" />,
  };

  const priorityStyles: any = {
    high: "text-red-600 bg-red-50 border-red-100",
    medium: "text-amber-600 bg-amber-50 border-amber-100",
    low: "text-green-600 bg-green-50 border-green-100",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setshowModal(false)}
      ></div>
      
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
              {statusIcons[complaint.status] || <WarningCircle size={24} />}
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-gray-900 tracking-tight leading-tight">
                Complaint <span className="italic-serif text-primary-600">Details</span>
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">ID: {complaint._id?.slice(-8)}</p>
            </div>
          </div>
          <button 
            onClick={() => setshowModal(false)}
            className="p-2 hover:bg-gray-200/50 rounded-full transition-colors text-gray-400 hover:text-gray-900"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          {/* Subject & Description */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${priorityStyles[complaint.priority]}`}>
                {complaint.priority} Priority
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-gray-100 text-gray-500 border border-gray-200">
                {complaint.complaint_type}
              </span>
            </div>
            <h4 className="text-2xl font-display font-normal text-gray-900 leading-snug">
              {complaint.subject}
            </h4>
            <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 italic-serif text-gray-600 leading-relaxed font-jakarta">
              "{complaint.description}"
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Info */}
            <div className="space-y-4">
              <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Reporter Details</h5>
              <div className="p-5 bg-white border border-gray-100 rounded-3xl space-y-3">
                <div className="flex items-center gap-3">
                  <UserIcon size={18} className="text-primary-600" />
                  <span className="text-sm font-bold text-gray-900 font-jakarta">{complaint.user_id?.first_name + " " + complaint.user_id?.last_name || "Anonymous"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <EnvelopeIcon size={18} className="text-primary-600" />
                  <span className="text-sm text-gray-600 font-jakarta">{complaint.user_id?.email || "No email provided"}</span>
                </div>
              </div>
            </div>

            {/* PG/Room Info */}
            <div className="space-y-4">
              <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Location Details</h5>
              <div className="p-5 bg-white border border-gray-100 rounded-3xl space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-primary-600" />
                  <span className="text-sm font-bold text-gray-900 font-jakarta">{complaint.pg_id?.pg_name || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-primary-600" />
                  <span className="text-sm text-gray-600 font-jakarta">Room: {complaint.room_id?.room_type || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attachment */}
          {complaint.image_url && (
            <div className="space-y-4">
              <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Attachment</h5>
              <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border border-gray-100 bg-gray-50 shadow-inner group">
                <Image 
                  src={complaint.image_url} 
                  alt="Attachment" 
                  fill 
                  className="object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-center gap-2 pt-4">
             <Clock size={16} className="text-gray-300" />
             <span className="text-xs font-jakarta text-gray-400">Created on {formatDate(complaint.createdAt)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={() => setshowModal(false)}
            className="px-8 py-3 bg-white text-gray-900 border border-gray-200 rounded-2xl font-bold text-xs tracking-widest uppercase hover:bg-gray-50 transition-all shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
