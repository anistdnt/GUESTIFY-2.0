"use client";

import React, { useState, useMemo } from "react";
import VisitStatsCards from "../Visitors/VisitStatsCards";
import VisitFiltersBar from "../Visitors/VisitFiltersBar";
import VisitCalendarView from "../Visitors/VisitCalendarView";
import VisitDetailPanel from "../Visitors/VisitDetailPanel";
import { MOCK_VISITS } from "../Visitors/mockData";
import { Visit, VisitStatus } from "../Visitors/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function AdminVisitorsComp() {
  const [visits, setVisits] = useState<Visit[]>(MOCK_VISITS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<VisitStatus | "all">("all");
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Calendar shows ALL visits that match the search (ignoring status filter)
  const calendarVisits = useMemo(() => {
    return visits.filter((visit) => {
      const matchesSearch = 
        visit.visitor.toLowerCase().includes(search.toLowerCase()) ||
        visit.phone.includes(search);
      return matchesSearch;
    });
  }, [visits, search]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setIsActionLoading(true);
    
    // Simulate API Call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    setVisits(prev => prev.map(v => 
      v._id === id 
        ? { ...v, status: newStatus as VisitStatus, updatedAt: dayjs().toISOString() } 
        : v
    ));

    // Also update the local selected visit to reflect the change immediately
    if (selectedVisit?._id === id) {
      setSelectedVisit(prev => prev ? { ...prev, status: newStatus as VisitStatus, updatedAt: dayjs().toISOString() } : null);
    }

    setIsActionLoading(false);
  };

  return (
    <div className="flex flex-col gap-6 min-h-screen">
      {/* Stats Section */}
      <VisitStatsCards visits={visits} />

      {/* Main Content Area: Master-Detail Split View */}
      <div className="flex flex-col gap-6 h-[calc(100vh-280px)] min-h-[700px]">
        {/* Filters Top Bar */}
        <VisitFiltersBar 
          search={search}
          setSearch={setSearch}
          status={statusFilter}
          setStatus={setStatusFilter}
        />

        {/* Content Split: Calendar | Details */}
        <div className="flex flex-1 gap-6 min-h-0">
          {/* Calendar Side - All statuses shown */}
          <div className="flex-1 min-h-0">
            <VisitCalendarView 
              visits={calendarVisits}
              onVisitClick={(visit) => setSelectedVisit(visit)}
              selectedVisitId={selectedVisit?._id}
            />
          </div>

          {/* Details Side Panel - Professional & Simple */}
          <div className={`w-[400px] flex-shrink-0 transition-all duration-500 ${selectedVisit ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0 lg:opacity-100 lg:translate-x-0"}`}>
            <VisitDetailPanel 
              visit={selectedVisit}
              onClose={() => setSelectedVisit(null)}
              onStatusUpdate={handleStatusUpdate}
              isLoading={isActionLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
