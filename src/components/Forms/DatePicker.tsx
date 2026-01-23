"use client";

import { useState, useRef, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function formatDate(date: Date | null) {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}


export default function DatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Input Field */}
      <input
        type="text"
        readOnly
        value={value ? formatDate(value) : ""}
        onClick={() => setOpen(!open)}
        className="w-full border border-gray-300 rounded-md p-2 cursor-pointer"
        placeholder="Select start date"
      />

      {/* Popup Calendar */}
      {open && (
        <div className="absolute z-50 mt-2 bg-white shadow-lg border rounded-md">
          <Calendar
            onChange={(date) => {
              onChange(date);
              setOpen(false);
            }}
            value={value}
          />
        </div>
      )}
    </div>
  );
}
