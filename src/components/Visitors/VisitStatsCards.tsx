"use client";

import React from "react";
import { Users, CalendarCheck, CheckCircle, XCircle, Clock } from "@phosphor-icons/react";
import { Visit } from "./types";
import dayjs from "dayjs";

interface VisitStatsCardsProps {
  visits: Visit[];
}

export default function VisitStatsCards({ visits }: VisitStatsCardsProps) {
  const now = dayjs();
  
  const stats = [
    {
      label: "Total Visits",
      value: visits.length,
      icon: <Users size={24} weight="bold" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Today's Visits",
      value: visits.filter(v => dayjs(v.date).isSame(now, "day")).length,
      icon: <Clock size={24} weight="bold" />,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Upcoming",
      value: visits.filter(v => v.status === "upcoming").length,
      icon: <CalendarCheck size={24} weight="bold" />,
      color: "bg-primary-50 text-primary-600",
    },
    {
      label: "Completed",
      value: visits.filter(v => v.status === "completed").length,
      icon: <CheckCircle size={24} weight="bold" />,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Cancelled",
      value: visits.filter(v => v.status === "cancelled").length,
      icon: <XCircle size={24} weight="bold" />,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat, idx) => (
        <div 
          key={idx} 
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-xl ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
            <h4 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h4>
          </div>
        </div>
      ))}
    </div>
  );
}
