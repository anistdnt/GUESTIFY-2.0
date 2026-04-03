"use client";

import React from "react";
import { 
  User, 
  Phone, 
  EnvelopeSimple, 
  MapPin, 
  Calendar, 
  Clock, 
  Info, 
  CheckCircle, 
  XCircle, 
  HandArrowDown, 
  ArrowRight,
  PencilSimple,
  Binoculars,
  Couch
} from "@phosphor-icons/react";
import { Visit } from "./types";
import dayjs from "dayjs";

interface VisitDetailPanelProps {
  visit: Visit | null;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string) => void;
  isLoading?: boolean;
}

export default function VisitDetailPanel({ 
  visit, 
  onClose,
  onStatusUpdate,
  isLoading = false
}: VisitDetailPanelProps) {
  if (!visit) {
    return (
      <div className="hidden lg:flex flex-col items-center justify-center h-full bg-gray-50/50 rounded-2xl border border-gray-100 p-8 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 border border-gray-100">
          <Binoculars size={32} weight="light" className="text-gray-300" />
        </div>
        <h4 className="text-gray-900 font-bold text-lg mb-2">No Visit Selected</h4>
        <p className="text-gray-400 text-sm max-w-[240px] leading-relaxed font-jakarta">
          Select an event from the calendar to view visitor details and manage the visit status.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-right duration-300 relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-[100] flex items-center justify-center animate-in fade-in duration-200">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
            <p className="text-[10px] font-bold text-primary-700 uppercase tracking-widest">Updating...</p>
          </div>
        </div>
      )}

      {/* Professional Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm">
            <User size={24} weight="bold" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">{visit.visitor}</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Visitor Profile</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
        >
          <ArrowRight size={20} weight="bold" />
        </button>
      </div>

      <div className="px-6 py-6 flex-1 overflow-y-auto scrollbar-hide space-y-8">
        {/* Status Section */}
        <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current Status</p>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm ${getStatusBadgeStyles(visit.status)}`}>
              {visit.status.replace("-", " ")}
            </span>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-primary-600 hover:bg-primary-50 rounded-lg text-xs font-bold transition-all">
            <PencilSimple size={16} weight="bold" />
            Edit Info
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Contact Section */}
          <section>
            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              Contact Details
            </h5>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                    <Phone size={18} weight="bold" />
                  </div>
                  <p className="text-sm font-bold text-gray-700">{visit.phone}</p>
                </div>
                <button className="text-[10px] font-bold text-blue-600 uppercase hover:underline">Call</button>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                    <EnvelopeSimple size={18} weight="bold" />
                  </div>
                  <p className="text-sm font-bold text-gray-700">{visit.email}</p>
                </div>
                <button className="text-[10px] font-bold text-red-600 uppercase hover:underline">Email</button>
              </div>
            </div>
          </section>

          {/* Schedule Section */}
          <section>
            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              Appointment Schedule
            </h5>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <p className="text-gray-400 text-[9px] font-bold uppercase mb-1.5">Scheduled Date</p>
                <div className="flex items-center gap-2.5">
                  <Calendar size={18} className="text-primary-600" />
                  <span className="text-sm font-bold text-gray-900">{dayjs(visit.date).format("DD MMM YYYY")}</span>
                </div>
              </div>
              <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <p className="text-gray-400 text-[9px] font-bold uppercase mb-1.5">Arrival Time</p>
                <div className="flex items-center gap-2.5">
                  <Clock size={18} className="text-primary-600" />
                  <span className="text-sm font-bold text-gray-900">{visit.time}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Professional Property Card */}
          <section>
            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              Target Property
            </h5>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 opacity-50" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-base font-bold text-gray-900">{visit.pg.name}</h4>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <MapPin size={12} weight="bold" /> {visit.pg.address}
                    </p>
                  </div>
                  <div className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-[10px] font-bold">PREMIUM</div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Couch size={18} weight="bold" />
                    <span className="text-xs font-bold">{visit.room.type}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Monthly Rent</p>
                    <p className="text-lg font-black text-primary-600">₹{visit.room.rent.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Notes Section - simplified */}
          <section>
            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              Administrative Notes
            </h5>
            <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 border-dashed">
              <p className="text-xs text-gray-500 font-jakarta leading-relaxed italic">
                "{visit.notes || "No additional notes for this visitor."}"
              </p>
              <div className="flex items-center justify-between mt-4 text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                <span>Source: {visit.source}</span>
                <span>ID: {visit._id}</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Simplified Action Footer */}
      <div className="p-6 border-t border-gray-100 bg-white">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button 
            disabled={isLoading}
            onClick={() => onStatusUpdate(visit._id, "completed")}
            className="flex items-center justify-center gap-2 bg-emerald-600 text-white p-3 rounded-xl font-bold text-xs shadow-md shadow-emerald-500/10 hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <CheckCircle size={18} weight="bold" />
            Mark Completed
          </button>
          <button 
            disabled={isLoading}
            onClick={() => onStatusUpdate(visit._id, "rescheduled")}
            className="flex items-center justify-center gap-2 bg-amber-500 text-white p-3 rounded-xl font-bold text-xs shadow-md shadow-amber-500/10 hover:bg-amber-600 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <HandArrowDown size={18} weight="bold" />
            Reschedule
          </button>
        </div>
        <button 
          disabled={isLoading}
          onClick={() => onStatusUpdate(visit._id, "cancelled")}
          className="w-full flex items-center justify-center gap-2 py-3.5 text-red-500 font-bold text-xs hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
        >
          <XCircle size={18} weight="bold" />
          Cancel Appointment
        </button>
      </div>
    </div>
  );
}

function getStatusBadgeStyles(status: string) {
  switch (status) {
    case "upcoming": return "bg-blue-100 text-blue-700 border border-blue-200";
    case "completed": return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    case "cancelled": return "bg-red-100 text-red-700 border border-red-200";
    case "rescheduled": return "bg-amber-100 text-amber-700 border border-amber-200";
    case "no-show": return "bg-slate-100 text-slate-700 border border-slate-200";
    default: return "bg-gray-100 text-gray-700 border border-gray-200";
  }
}
