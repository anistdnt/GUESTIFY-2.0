"use client";

import { Visit } from "./types";
import dayjs from "dayjs";

const now = dayjs();

export const MOCK_VISITS: Visit[] = [
  {
    _id: "visit_101",
    visitor: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul@example.com",
    pg: {
      _id: "pg_123",
      name: "Lake View PG",
      address: "Salt Lake, Sector V, Kolkata"
    },
    room: {
      _id: "room_456",
      type: "Single Occupancy",
      rent: 7500
    },
    date: now.format("YYYY-MM-DD"),
    time: "11:00",
    startDateTime: now.hour(11).minute(0).second(0).toISOString(),
    endDateTime: now.hour(11).minute(30).second(0).toISOString(),
    status: "upcoming",
    notes: "Visitor is interested in a 6-month stay. Prefers high floor.",
    source: "Website",
    createdAt: now.subtract(2, "days").toISOString(),
    updatedAt: now.subtract(2, "days").toISOString()
  },
  {
    _id: "visit_102",
    visitor: "Priya Das",
    phone: "8765432109",
    email: "priya.das@example.com",
    pg: {
      _id: "pg_124",
      name: "Heritage Heights",
      address: "Park Street, Kolkata"
    },
    room: {
      _id: "room_457",
      type: "Double Sharing",
      rent: 5500
    },
    date: now.format("YYYY-MM-DD"),
    time: "14:30",
    startDateTime: now.hour(14).minute(30).second(0).toISOString(),
    endDateTime: now.hour(15).minute(0).second(0).toISOString(),
    status: "upcoming",
    notes: "Coming with parents. Needs to see the kitchen.",
    source: "Direct Call",
    createdAt: now.subtract(1, "days").toISOString(),
    updatedAt: now.subtract(1, "days").toISOString()
  },
  {
    _id: "visit_103",
    visitor: "Amitabh Banerjee",
    phone: "7654321098",
    email: "amitabh.b@example.com",
    pg: {
      _id: "pg_123",
      name: "Lake View PG",
      address: "Salt Lake, Sector V, Kolkata"
    },
    room: {
      _id: "room_458",
      type: "Triple Sharing",
      rent: 4500
    },
    date: now.subtract(1, "day").format("YYYY-MM-DD"),
    time: "10:00",
    startDateTime: now.subtract(1, "day").hour(10).minute(0).toISOString(),
    endDateTime: now.subtract(1, "day").hour(10).minute(30).toISOString(),
    status: "completed",
    notes: "Very happy with the facilities. Might book next week.",
    source: "Google Search",
    createdAt: now.subtract(3, "days").toISOString(),
    updatedAt: now.subtract(1, "days").toISOString()
  },
  {
    _id: "visit_104",
    visitor: "Sania Mirza",
    phone: "6543210987",
    email: "sania.mirza@example.com",
    pg: {
      _id: "pg_125",
      name: "Comfort Zone PG",
      address: "New Town, Kolkata"
    },
    room: {
      _id: "room_459",
      type: "Single",
      rent: 8000
    },
    date: now.add(1, "day").format("YYYY-MM-DD"),
    time: "16:00",
    startDateTime: now.add(1, "day").hour(16).minute(0).toISOString(),
    endDateTime: now.add(1, "day").hour(16).minute(30).toISOString(),
    status: "rescheduled",
    notes: "Was supposed to come today but requested tomorrow afternoon.",
    source: "Instagram",
    createdAt: now.subtract(1, "day").toISOString(),
    updatedAt: now.toISOString()
  },
  {
    _id: "visit_105",
    visitor: "Vikram Seth",
    phone: "5432109876",
    email: "vikram.seth@example.com",
    pg: {
      _id: "pg_123",
      name: "Lake View PG",
      address: "Salt Lake, Sector V, Kolkata"
    },
    room: {
      _id: "room_456",
      type: "Single",
      rent: 7500
    },
    date: now.subtract(2, "days").format("YYYY-MM-DD"),
    time: "18:00",
    startDateTime: now.subtract(2, "days").hour(18).minute(0).toISOString(),
    endDateTime: now.subtract(2, "days").hour(18).minute(30).toISOString(),
    status: "cancelled",
    notes: "Found another accommodation closer to office.",
    source: "Housing.com",
    createdAt: now.subtract(5, "days").toISOString(),
    updatedAt: now.subtract(2, "days").toISOString()
  },
  {
    _id: "visit_106",
    visitor: "Ananya Panday",
    phone: "4321098765",
    email: "ananya.p@example.com",
    pg: {
      _id: "pg_126",
      name: "Elite Residency",
      address: "Kasba, Kolkata"
    },
    room: {
      _id: "room_460",
      type: "Double Sharing",
      rent: 6000
    },
    date: now.subtract(3, "days").format("YYYY-MM-DD"),
    time: "11:30",
    startDateTime: now.subtract(3, "days").hour(11).minute(30).toISOString(),
    endDateTime: now.subtract(3, "days").hour(12).minute(0).toISOString(),
    status: "no-show",
    notes: "Didn't pick up the call at the time of visit.",
    source: "Website",
    createdAt: now.subtract(4, "days").toISOString(),
    updatedAt: now.subtract(3, "days").toISOString()
  },
  {
    _id: "visit_107",
    visitor: "Rohan Mehra",
    phone: "3210987654",
    email: "rohan.mehra@example.com",
    pg: {
      _id: "pg_123",
      name: "Lake View PG",
      address: "Salt Lake, Sector V, Kolkata"
    },
    room: {
      _id: "room_456",
      type: "Single",
      rent: 7500
    },
    date: now.add(2, "days").format("YYYY-MM-DD"),
    time: "12:00",
    startDateTime: now.add(2, "days").hour(12).minute(0).toISOString(),
    endDateTime: now.add(2, "days").hour(12).minute(30).toISOString(),
    status: "upcoming",
    notes: "Looking for short term stay (2 months).",
    source: "Direct Call",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  }
];
