"use client";
import React, { Dispatch, SetStateAction } from "react";
import {
  ClockCounterClockwiseIcon,
  RobotIcon,
  StopCircleIcon,
  SwapIcon,
} from "@phosphor-icons/react";

type Props = {
  name: string;
  email: string;
  prompt: string;
  setPrompt: Dispatch<SetStateAction<string>>;
  isStreaming: boolean;
  handleGenerate: () => Promise<void>;
  promptHistory: string[];
  stopGeneration: () => void;
};

export default function HomeSection({
  email,
  handleGenerate,
  isStreaming,
  name,
  prompt,
  setPrompt,
  promptHistory,
  stopGeneration,
}: Props) {
  return (
    <div>
      <div className="my-4">
        <h4 className="text-lg font-medium text-gray-500 mb-1">Welcome,</h4>
        <h2 className="text-4xl font-medium text-gray-800">
          {name || "John Doe"}
        </h2>
        <p className="text-sm font-medium text-gray-500">
          {email || "john@gmail.com"}
        </p>
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={isStreaming}
        placeholder="Add custom instructions..."
        className="w-full h-28 border rounded p-3 text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-gray-200"
      />

      <div className="flex gap-2">
        <button
          onClick={handleGenerate}
          disabled={isStreaming || !prompt.trim()}
          className="flex-1 flex flex-row items-center justify-center gap-2 bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {isStreaming ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          ) : (
            <RobotIcon size={22} />
          )}
          {isStreaming ? "Generating..." : "Generate"}
        </button>
        {isStreaming && (
          <button
            onClick={stopGeneration}
            className=" bg-red-600 text-white py-2 rounded hover:bg-red-700 px-2"
          >
            <StopCircleIcon size={22} weight="bold" />
          </button>
        )}
      </div>

      {/* Prompt History */}
      <div className="mt-4 flex-1 flex flex-col">
        <h3 className="flex flex-row justify-start items-center gap-2 text-sm font-medium mb-3 text-gray-700">
          <ClockCounterClockwiseIcon size={22} weight="fill" />
          <span>Prompt History</span>
        </h3>
        <ul className="text-sm text-gray-600 space-y-2 overflow-y-scroll h-52">
          {promptHistory.map((p, i) => (
            <li
              key={i}
              className="cursor-pointer p-2 bg-zinc-50 rounded break-words flex justify-between items-center"
            >
              <span>{p}</span>
              <span onClick={() => setPrompt(p)} className="cursor-pointer">
                <SwapIcon size={20} weight="fill" />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
