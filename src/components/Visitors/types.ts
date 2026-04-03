"use client";

export type VisitStatus = "upcoming" | "completed" | "cancelled" | "rescheduled" | "no-show";

export interface VisitPG {
  _id: string;
  name: string;
  address: string;
}

export interface VisitRoom {
  _id: string;
  type: string;
  rent: number;
}

export interface Visit {
  _id: string;
  visitor: string;
  phone: string;
  email: string;
  pg: VisitPG;
  room: VisitRoom;
  date: string;
  time: string;
  startDateTime: string;
  endDateTime: string;
  status: VisitStatus;
  notes: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface VisitFilters {
  search: string;
  status: VisitStatus | "all";
  pgId?: string;
  dateRange?: [string, string];
}
