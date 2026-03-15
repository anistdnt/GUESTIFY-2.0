"use client";

import { PenNibIcon, CaretDownIcon, ListDashesIcon, ShieldCheckIcon, CloudArrowUpIcon, X } from "@phosphor-icons/react";
import React, { useState } from "react";

type Props = {
  handleEdit: () => void;
  handleSave: (customData: { title: string; description: string }) => Promise<void>;
  html: string | Promise<string>;
};

export default function Preview({ handleEdit, handleSave, html }: Props) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Save Template Modal State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");

  const onSaveClick = () => {
    setIsSaveModalOpen(true);
  };

  const onConfirmSave = async () => {
    if (!templateName.trim()) return;
    setIsSaving(true);
    await handleSave({
      title: templateName,
      description: templateDescription,
    });
    setIsSaving(false);
    setIsSaveModalOpen(false);
  };

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
    <div className="agreement-preview-container">
      {/* Professional Preview Toolbar (Sticky Top) */}
      <div className="agreement-preview-toolbar">
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
                <div className="absolute right-0 top-full mt-4 w-56 rounded-2xl border border-slate-200 bg-white shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
      <div className="agreement-preview-paper mx-auto">
        <div className="absolute top-10 left-0 right-0 flex justify-center opacity-[0.03] pointer-events-none select-none">
          <span className="text-6xl font-black uppercase tracking-[1em]">OFFICIAL</span>
        </div>
        <div
          className="agreement-editor font-eb-garamond"
          dangerouslySetInnerHTML={{ __html: typeof html === 'string' ? html : "" }}
        />
      </div>

      {/* Save Template Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsSaveModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-violet-600 mb-1">Persist Workspace</h3>
                  <h2 className="text-xl font-bold text-slate-900">Save as Template</h2>
                </div>
                <button 
                  onClick={() => setIsSaveModalOpen(false)}
                  className="p-2 hover:bg-slate-200/50 rounded-xl text-slate-400 transition-colors"
                >
                  <X size={20} weight="bold" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block px-1">Template Name</label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="e.g., Premium Rent Agreement 2024"
                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-violet-50 focus:border-violet-200 transition-all font-medium"
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block px-1">Description</label>
                  <textarea
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    placeholder="Short summary for your records..."
                    className="w-full h-24 bg-white border border-slate-200 rounded-2xl p-5 text-sm text-slate-700 placeholder:text-slate-300 resize-none focus:outline-none focus:ring-4 focus:ring-violet-50 focus:border-violet-200 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-white flex gap-3">
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="flex-1 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={onConfirmSave}
                disabled={!templateName.trim() || isSaving}
                className="flex-[2] py-4 bg-violet-600 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-violet-900/20 hover:bg-violet-700 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-30 disabled:translate-y-0 disabled:shadow-none"
              >
                {isSaving ? "Finalizing..." : "Confirm Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
