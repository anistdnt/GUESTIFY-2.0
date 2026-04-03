"use client";

import React, { useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Visit } from "./types";

interface VisitCalendarViewProps {
  visits: Visit[];
  onVisitClick: (visit: Visit) => void;
  selectedVisitId?: string | null;
}

export default function VisitCalendarView({ 
  visits, 
  onVisitClick,
  selectedVisitId 
}: VisitCalendarViewProps) {
  
  const events = visits.map((visit) => ({
    id: visit._id,
    title: `${visit.visitor} • ${visit.pg.name}`,
    start: visit.startDateTime,
    end: visit.endDateTime,
    extendedProps: visit,
    backgroundColor: getStatusColor(visit.status).bg,
    borderColor: getStatusColor(visit.status).border,
    textColor: getStatusColor(visit.status).text,
    className: `cursor-pointer transition-all hover:scale-[1.02] ${selectedVisitId === visit._id ? "ring-2 ring-primary-500 ring-offset-2" : ""}`
  }));

  const renderEventContent = useCallback((eventInfo: any) => {
    const visit = eventInfo.event.extendedProps as Visit;
    return (
      <div className="p-1.5 overflow-hidden">
        <div className="flex items-center gap-1.5 mb-0.5">
          <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(visit.status).dot}`} />
          <p className="text-[10px] font-bold truncate uppercase tracking-wider">{visit.visitor}</p>
        </div>
        <p className="text-[9px] opacity-80 truncate font-jakarta">{visit.pg.name}</p>
        <p className="text-[8px] opacity-60 font-bold mt-1">{visit.time}</p>
      </div>
    );
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 min-h-[600px] visitor-calendar scrollbar-hide overflow-y-auto">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
          }}
          events={events}
          eventClick={(info) => onVisitClick(info.event.extendedProps as Visit)}
          eventContent={renderEventContent}
          height="100%"
          dayMaxEvents={3}
          nowIndicator={true}
          slotMinTime="08:00:00"
          slotMaxTime="22:00:00"
          handleWindowResize={true}
          aspectRatio={1.5}
          themeSystem="standard"
        />
      </div>

      <style jsx global>{`
        .visitor-calendar .fc {
          --fc-button-bg-color: #f9fafb;
          --fc-button-border-color: #f3f4f6;
          --fc-button-text-color: #4b5563;
          --fc-button-hover-bg-color: #f3f4f6;
          --fc-button-hover-border-color: #e5e7eb;
          --fc-button-active-bg-color: #primary-600;
          --fc-button-active-border-color: #primary-600;
          --fc-border-color: #f3f4f6;
          --fc-today-bg-color: #fffbeb;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .visitor-calendar .fc-header-toolbar {
          margin-bottom: 2rem !important;
        }

        .visitor-calendar .fc-toolbar-title {
          font-size: 1.25rem !important;
          font-weight: 800 !important;
          color: #111827 !important;
          letter-spacing: -0.025em;
        }

        .visitor-calendar .fc-button {
          padding: 0.25rem 0.6rem !important;
          font-weight: 700 !important;
          font-size: 0.65rem !important;
          text-transform: capitalize !important;
          letter-spacing: 0em !important;
          border-radius: 0.5rem !important;
          transition: all 0.2s !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .visitor-calendar .fc-button-group {
          gap: 0.25rem !important;
        }

        .visitor-calendar .fc-toolbar-chunk {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 0.25rem !important;
        }

        .visitor-calendar .fc-prev-button,
        .visitor-calendar .fc-next-button {
          padding: 0.2rem !important;
          width: 28px !important;
          height: 28px !important;
        }

        .visitor-calendar .fc-button-primary:not(:disabled).fc-button-active,
        .visitor-calendar .fc-button-primary:not(:disabled):active {
          background-color: #eab308 !important; /* Adjust if primary is different */
          border-color: #eab308 !important;
          color: white !important;
        }

        .visitor-calendar .fc-event {
          border-radius: 0.75rem !important;
          overflow: hidden !important;
          border: 1px solid transparent !important;
          margin: 1px 2px !important;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
        }

        .visitor-calendar .fc-daygrid-day-number {
          font-size: 0.875rem !important;
          font-weight: 700 !important;
          color: #9ca3af !important;
          padding: 0.5rem !important;
        }

        .visitor-calendar .fc-col-header-cell-cushion {
          font-size: 0.75rem !important;
          font-weight: 800 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          color: #6b7280 !important;
          padding: 1rem 0 !important;
        }
      `}</style>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "upcoming":
      return { bg: "#bcd8fcff", border: "#dbeafe", text: "#1e40af", dot: "bg-blue-500" };
    case "completed":
      return { bg: "#b0fad7ff", border: "#d1fae5", text: "#065f46", dot: "bg-emerald-500" };
    case "cancelled":
      return { bg: "#fec8c8ff", border: "#fee2e2", text: "#991b1b", dot: "bg-red-500" };
    case "rescheduled":
      return { bg: "#fef3c7", border: "#fef3c7", text: "#92400e", dot: "bg-amber-500" };
    case "no-show":
      return { bg: "#f8fafc", border: "#f1f5f9", text: "#475569", dot: "bg-slate-500" };
    default:
      return { bg: "#f9fafb", border: "#f3f4f6", text: "#374151", dot: "bg-gray-500" };
  }
}
