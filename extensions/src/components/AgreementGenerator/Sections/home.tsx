"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { InfoIcon, NoteIcon, PlusCircleIcon, RobotIcon, StopCircleIcon, XIcon } from "@phosphor-icons/react";
import AgreementModal from "./AgreementModal";
import { AgreementSchema } from "@/utils/Generator/form.validation";
import { v4 as uuidv4 } from 'uuid';

type AgreementFormValues = typeof AgreementSchema.initialValues;

type Props = {
  name: string;
  email: string;
  prompt: string;
  setPrompt: Dispatch<SetStateAction<string>>;
  isStreaming: boolean;
  handleGenerate: (payload?: any, sessionId?: string) => Promise<void>;
  stopGeneration: () => void;
};

export default function HomeSection({
  email,
  handleGenerate,
  isStreaming,
  name,
  prompt,
  setPrompt,
  stopGeneration,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [agreementPayload, setAgreementPayload] = useState<any>({});
  const [newsessionId, setNewSessionId] = useState<string>("");

  const handleModalSubmit = (values: AgreementFormValues) => {
    const payload = {
      ...values,
    };
    setAgreementPayload(payload);
    setIsModalOpen(false);
  };

  // Generating a new sesssion ID whenever a new payload is set
  useEffect(() => {
    if (Object.keys(agreementPayload).length > 0) {
      const uniqueSessionId = uuidv4();
      setNewSessionId(uniqueSessionId);
    }
  }, [agreementPayload]);

  return (
    <div className="space-y-10 text-slate-900">
      {/* PROFESSIONAL WELCOME AREA */}
      <div>
        <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-500 mb-2">Legal Intelligence</h4>
        <h2 className="text-3xl font-bold text-slate-900 mb-2 leading-tight">
          Welcome back, {name?.split(' ')[0] || "Admin"}
        </h2>
        <p className="text-sm font-medium text-slate-500">
          {email || "Configure your professional workspace below"}
        </p>
      </div>

      <div className="h-px bg-slate-200 w-full" />

      {/* PAYLOAD / TEMPLATE SELECTION AREA */}
      <div className="space-y-4">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block px-1">Active Context</label>
        
        {Object.keys(agreementPayload).length > 0 ? (
          <div className="group relative bg-white border border-slate-200 rounded-2xl p-5 transition-all hover:border-violet-200 hover:shadow-lg hover:shadow-violet-900/5">
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-violet-50 rounded-xl border border-violet-100">
                <NoteIcon size={24} weight="duotone" className="text-violet-600" />
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <p className="text-sm font-bold text-slate-900 truncate mb-1.5">Rent Agreement Template</p>
                <div className="text-[11px] font-medium text-slate-500 leading-relaxed overflow-hidden flex items-center gap-2 flex-wrap">
                  <span className="text-slate-400 uppercase tracking-tighter">Owner:</span>
                  <span className="text-slate-700 font-bold">{agreementPayload.owner_name}</span>
                  <span className="opacity-30">•</span>
                  <span className="text-slate-400 uppercase tracking-tighter">Tenant:</span>
                  <span className="text-slate-700 font-bold">{agreementPayload.tenant_name}</span>
                </div>
              </div>
              
              <button
                onClick={() => setAgreementPayload({})}
                className="absolute top-5 right-5 text-slate-300 hover:text-red-500 transition-colors p-1"
                title="Detach context"
              >
                <XIcon size={16} weight="bold" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isStreaming}
            className="w-full py-12 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center gap-4 text-slate-400 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50 transition-all duration-500 group disabled:opacity-50 disabled:pointer-events-none"
          >
            <div className="p-4 bg-slate-100 rounded-full group-hover:bg-violet-100 transition-colors">
              <PlusCircleIcon size={32} weight="bold" />
            </div>
            <div className="space-y-1 text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] block">Load Agreement Schema</span>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Required for generation</p>
            </div>
          </button>
        )}
      </div>

      {/* PROMPT AREA */}
      <div className="space-y-4 pt-4">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block px-1">Refinement Instructions</label>
        <div className="relative group">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isStreaming}
            placeholder="Add custom clauses, change legal tone, or specify jurisdictions..."
            className="w-full h-36 bg-white border border-slate-200 rounded-2xl p-5 text-sm text-slate-700 placeholder:text-slate-300 resize-none focus:outline-none focus:ring-4 focus:ring-violet-50 focus:border-violet-200 transition-all shadow-sm"
          />
        </div>

        <div className="flex gap-4 pt-2">
          <button
            onClick={() => handleGenerate(agreementPayload, newsessionId)}
            disabled={isStreaming || Object.keys(agreementPayload).length === 0}
            className="flex-1 flex items-center justify-center gap-3 bg-violet-600 text-white h-16 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-violet-900/20 hover:bg-violet-700 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-20 disabled:translate-y-0 disabled:shadow-none"
          >
            {isStreaming ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
            ) : (
              <RobotIcon size={22} weight="bold" />
            )}
            {isStreaming ? "AI Processing..." : "Generate Agreement"}
          </button>
          
          {isStreaming && (
            <button
              onClick={stopGeneration}
              className="w-16 h-16 bg-red-50 text-red-500 border border-red-100 rounded-2xl flex items-center justify-center hover:bg-red-100 transition-colors"
            >
              <StopCircleIcon size={26} weight="bold" />
            </button>
          )}
        </div>

        <div className="flex items-start gap-3 px-1 pt-4 opacity-70">
          <InfoIcon size={14} className="mt-0.5 text-violet-500" />
          <p className="text-[10px] font-medium leading-relaxed text-slate-400 uppercase tracking-widest">
            AI Agreement Generator uses specialized models to draft legal documents. Always review generated content.
          </p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AgreementModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}
