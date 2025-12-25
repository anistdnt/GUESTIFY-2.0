"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { api_caller } from "@/lib/api_caller";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface ChatResponse {
  reply: string;
}

export default function ChatBot() {
  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const pathname = usePathname();
  const [sessionId] = useState<string>(() => crypto.randomUUID());

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // show user message instantly
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      const res = await api_caller<ChatResponse, any>(
        "POST",
        "/api/chat",
        {
          message: text,
          sessionId,
          page: pathname,
        }
      );

      if (res.success && res.data) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: res.data.reply },
        ]);
      } else {
        throw new Error(res.message);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col">
          <div className="flex justify-between items-center p-3 border-b font-semibold">
            <span>AI Assistant</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <ChatMessages messages={messages} loading={loading} />
          <ChatInput onSend={sendMessage} loading={loading} />
        </div>
      )}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
        >
          💬
        </button>
      )}
    </div>
  );
}
