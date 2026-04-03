"use client";

import React from "react";
import { MagnifyingGlass, Funnel, Plus } from "@phosphor-icons/react";
import { VisitStatus } from "./types";

interface VisitFiltersBarProps {
  search: string;
  setSearch: (val: string) => void;
  status: VisitStatus | "all";
  setStatus: (val: VisitStatus | "all") => void;
  onAddVisit: () => void;
}

import Select, { StylesConfig } from "react-select";

export default function VisitFiltersBar({
  search,
  setSearch,
  status,
  setStatus,
}: Omit<VisitFiltersBarProps, "onAddVisit">) {
  const options = [
    { label: "All Visits", value: "all" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Rescheduled", value: "rescheduled" },
    { label: "No-Show", value: "no-show" },
  ];

  const customStyles: StylesConfig<any, false> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#f9fafb",
      border: "none",
      borderRadius: "0.75rem",
      padding: "2px 8px",
      fontSize: "0.75rem",
      fontWeight: "700",
      fontFamily: "var(--font-jakarta)",
      boxShadow: state.isFocused ? "0 0 0 2px #f59e0b" : "none",
      cursor: "pointer",
      minWidth: "160px",
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: "0.75rem",
      fontWeight: "600",
      backgroundColor: state.isSelected ? "#d97706" : state.isFocused ? "#fffbeb" : "white",
      color: state.isSelected ? "white" : "#374151",
      cursor: "pointer",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#4b5563",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
        <div className="flex items-center gap-2 px-3 border-r border-gray-100 mr-2">
          <h2 className="text-xl font-black text-gray-900 tracking-tight whitespace-nowrap">Visitor Visits</h2>
        </div>
        
        <div className="relative w-full sm:w-80">
          <MagnifyingGlass 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
            size={18} 
            weight="bold" 
          />
          <input
            type="text"
            placeholder="Search visitor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all font-jakarta"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Select
          instanceId="visitor-status-select"
          options={options}
          value={options.find(opt => opt.value === status)}
          onChange={(opt: any) => setStatus(opt.value)}
          styles={customStyles}
          isSearchable={false}
        />
      </div>
    </div>
  );
}
