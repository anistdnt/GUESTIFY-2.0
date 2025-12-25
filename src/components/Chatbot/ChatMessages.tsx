interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface Props {
  messages: ChatMessage[];
  loading: boolean;
}

export default function ChatMessages({ messages, loading }: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-2 rounded max-w-[80%] ${
            msg.role === "user"
              ? "ml-auto bg-blue-100 text-right"
              : "bg-gray-100"
          }`}
        >
          {msg.text}
        </div>
      ))}

      {loading && (
        <div className="text-xs text-gray-400">
          Assistant is typing...
        </div>
      )}
    </div>
  );
}
