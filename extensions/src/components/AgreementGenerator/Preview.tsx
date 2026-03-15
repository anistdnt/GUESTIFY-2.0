"use client";

import { PenNibIcon, CaretDownIcon, ListDashesIcon, ShieldCheckIcon } from "@phosphor-icons/react";
import React, { useState } from "react";

type Props = {
  handleEdit: () => void;
  html: string | Promise<string>;
};

export default function Preview({ handleEdit, html }: Props) {
  const [open, setOpen] = useState(false);

  const downloadHTML = () => {
    const blob = new Blob([html as string], { type: "text/html;charset=utf-8" });
    triggerDownload(blob, "agreement.html");
  };

  const downloadPDF = () => console.log("Download as PDF");
  const downloadDOCX = () => console.log("Download as DOCX");

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  return (
    <div className="editor-wrapper">
      {/* Professional Preview Toolbar */}
      <div className="preview-toolbar shadow-2xl shadow-slate-200 border border-slate-200 backdrop-blur-xl bg-white/95 sticky top-4 mb-10 p-2 rounded-2xl flex items-center justify-between gap-4 w-full max-w-[850px]">
        <div className="flex items-center gap-4 pl-4 border-l-2 border-emerald-500 py-1">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon size={16} weight="bold" className="text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">Finalized Version</span>
            </div>
            <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Read-Only Certification Layer</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pr-1">
          {/* Edit Button */}
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-5 py-2.5 text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all text-[10px] font-bold uppercase tracking-[0.2em]"
          >
            <PenNibIcon size={16} weight="bold" />
            <span>Unlock Editor</span>
          </button>

          <div className="w-px h-6 bg-slate-200 mx-1" />

          {/* Download Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 shadow-lg shadow-violet-900/20 transition-all text-[10px] font-bold uppercase tracking-[0.2em]"
            >
              <span>Export Document</span>
              <CaretDownIcon size={14} weight="bold" />
            </button>

            {open && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                <div className="absolute right-0 mt-4 w-56 rounded-2xl border border-slate-200 bg-white shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-3 border-b border-slate-50 bg-slate-50/50">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] px-2">Select Format</span>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={downloadPDF}
                      className="flex items-center w-full px-4 py-3 text-[11px] font-bold text-slate-700 hover:bg-violet-50 hover:text-violet-600 rounded-xl transition-colors text-left uppercase tracking-widest"
                    >
                      Portable (PDF)
                    </button>
                    <button
                      onClick={downloadDOCX}
                      className="flex items-center w-full px-4 py-3 text-[11px] font-bold text-slate-700 hover:bg-violet-50 hover:text-violet-600 rounded-xl transition-colors text-left uppercase tracking-widest"
                    >
                      Word (DOCX)
                    </button>
                    <button
                      onClick={downloadHTML}
                      className="flex items-center w-full px-4 py-3 text-[11px] font-bold text-slate-700 hover:bg-violet-50 hover:text-violet-600 rounded-xl transition-colors text-left uppercase tracking-widest"
                    >
                      Web (HTML)
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Preview Paper */}
      <div className="editor-paper mx-auto">
        <div className="absolute top-10 left-0 right-0 flex justify-center opacity-[0.03] pointer-events-none select-none">
          <span className="text-6xl font-black uppercase tracking-[1em]">OFFICIAL</span>
        </div>
        <div
          className="agreement-editor font-eb-garamond"
          dangerouslySetInnerHTML={{ __html: html as string }}
        />
      </div>
    </div>
  );
}
