"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { api_caller } from "@/lib/api_caller";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { API } from "@/lib/api_const";
import { Chat, ChatCenteredDots, ChatCircleDots } from "@phosphor-icons/react";

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

    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      const res = await api_caller<ChatResponse, any>(
        "POST",
        API.CHATBOT.CHAT,
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
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="w-96 h-[32rem] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <h3 className="font-semibold text-base">AI Assistant</h3>
                <p className="text-xs text-blue-100">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center text-lg"
            >
              ×
            </button>
          </div>

          <ChatMessages messages={messages} loading={loading} />
          <ChatInput onSend={sendMessage} loading={loading} />
        </div>
      )}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="group relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-5 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110"
        >
          <ChatCircleDots size={24} weight="bold" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
        </button>
      )}
    </div>
  );
}
