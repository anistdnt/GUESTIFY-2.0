"use client";

import { useState } from "react";

interface Props {
  onSend: (message: string) => void;
  loading: boolean;
}

export default function ChatInput({ onSend, loading }: Props) {
  const [value, setValue] = useState<string>("");

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="flex gap-2 border-t p-2">
      <input
        className="flex-1 text-sm p-2 border rounded outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Ask for help..."
        value={value}
        disabled={loading}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        onClick={handleSend}
        disabled={loading}
        className="bg-blue-600 text-white px-3 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
      >
        Send
      </button>
    </div>
  );
}
