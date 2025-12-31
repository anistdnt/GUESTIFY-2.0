"use client";

import { PaperPlaneTilt } from "@phosphor-icons/react";
import { useState } from "react";

interface Props {
  onSend: (message: string) => void;
  loading: boolean;
}

export default function ChatInput({ onSend, loading }: Props) {
  const [value, setValue] = useState<string>("");

  const handleSend = () => {
    if (!value.trim() || loading) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="flex gap-2 p-4 bg-gray-50 border-t border-gray-100">
      <div className="flex-1 relative">
        <input
          className="w-full text-sm py-3 px-4 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white disabled:bg-gray-50 disabled:text-gray-400"
          placeholder="Type your message..."
          value={value}
          disabled={loading}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
      </div>
      <button
        onClick={handleSend}
        disabled={loading || !value.trim()}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <PaperPlaneTilt size={20} weight="bold" />
        )}
      </button>
    </div>
  );
}
