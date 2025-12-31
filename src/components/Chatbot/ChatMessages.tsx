"use client";

import { ChatTeardropDots } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface Props {
  messages: ChatMessage[];
  loading: boolean;
}

export default function ChatMessages({ messages, loading }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50 to-white">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-4">
            <ChatTeardropDots size={32} weight="light" className="text-blue-600" />
          </div>
          <p className="text-gray-600 font-medium mb-1">
            Hi! How can I help you today?
          </p>
          <p className="text-sm text-gray-400">
            Ask me anything about this page
          </p>
        </div>
      )}

      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
        >
          <div
            className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-md shadow-md"
                : "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100"
            }`}
          >
            <Markdown remarkPlugins={[remarkGfm]}>{msg.text}</Markdown>
          </div>
        </div>
      ))}

      {loading && (
        <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
          <div className="bg-white px-5 py-4 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
