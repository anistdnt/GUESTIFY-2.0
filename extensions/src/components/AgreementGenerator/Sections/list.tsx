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
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <ClockCounterClockwiseIcon size={22} weight="bold" className="text-violet-500" />
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 pt-0.5">
          History & Memory
        </h3>
      </div>
      
      {promptHistory?.length > 0 ? (
        <div className="space-y-4">
          {promptHistory.map((p, i) => (
            <div
              key={i}
              className="group bg-white border border-slate-200 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-900/5 p-5 rounded-2xl transition-all duration-300"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-600 line-clamp-4 leading-relaxed tracking-wide">
                    {p}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="px-2.5 py-1 bg-violet-50 rounded-lg text-[9px] font-bold text-violet-600 uppercase tracking-widest border border-violet-100">
                      Prompt Insight
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setPrompt(p);
                    setSection("home");
                  }}
                  className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-violet-600 hover:border-violet-200 hover:shadow-sm transition-all"
                  title="Reuse intelligence"
                >
                  <SwapIcon size={18} weight="bold" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center gap-6 text-center opacity-40">
          <div className="p-5 bg-slate-100 rounded-full border border-slate-200 text-slate-300">
            <ClockCounterClockwiseIcon size={48} weight="bold" />
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-900">No Record Found</p>
            <p className="text-[11px] font-medium text-slate-500 max-w-[220px] leading-relaxed uppercase">Your generation history is currently local and ephemeral.</p>
          </div>
        </div>
      )}
    </div>
  );
}
