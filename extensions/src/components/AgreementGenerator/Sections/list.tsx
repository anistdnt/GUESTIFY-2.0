import { Sections } from "@/types/AgreementGenerator";
import { ClockCounterClockwiseIcon, SwapIcon } from "@phosphor-icons/react";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  promptHistory: string[];
  setPrompt: Dispatch<SetStateAction<string>>;
  setSection: Dispatch<SetStateAction<Sections>>;
};

export default function ListSection({
  promptHistory,
  setPrompt,
  setSection,
}: Props) {
  return (
    <div>
      {/* Prompt History */}
      <div className="mt-4 flex flex-col h-fit">
        <h3 className="flex flex-row justify-start items-center gap-2 text-sm font-medium mb-3 text-gray-700">
          <ClockCounterClockwiseIcon size={22} weight="fill" />
          <span>Prompt History</span>
        </h3>
        {promptHistory?.length > 0 ? (
          <ul className="text-sm text-gray-600 space-y-2 max-h-[70vh] overflow-y-scroll">
            {promptHistory.map((p, i) => (
              <li
                key={i}
                className="cursor-pointer p-2 bg-zinc-50 rounded break-words flex justify-between items-center"
              >
                <span>{p}</span>
                <span
                  onClick={() => {
                    setPrompt(p);
                    setSection("home");
                  }}
                  className="cursor-pointer"
                >
                  <SwapIcon size={20} weight="fill" />
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 text-center mt-3">
            No prompt history found.
          </div>
        )}
      </div>
    </div>
  );
}
