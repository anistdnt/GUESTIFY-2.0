"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { marked } from "marked";
import toast from "react-hot-toast";
import { API } from "@/app/api/_api_const";
import Link from "next/link";
import Image from "next/image";
import HomeSection from "../AgreementGenerator/Sections/home";
import { ClockCounterClockwiseIcon, HouseIcon, InfoIcon, List, ListDashesIcon, SlidersHorizontalIcon } from "@phosphor-icons/react";
import ListSection from "../AgreementGenerator/Sections/list";
import SettingsSection from "../AgreementGenerator/Sections/settings";
import Preview from "../AgreementGenerator/Preview";
import { Mode, PageSettings, Sections } from "@/types/AgreementGenerator";
import SavedAssets from "../AgreementGenerator/Sections/saved";
import { setCookie } from "cookies-next/client";

const AgreementEditor = dynamic(() => import("../AgreementGenerator/Editor"), {
  ssr: false,
});
// Remove TurndownService as it's no longer needed
marked.setOptions({
  gfm: true,
  breaks: true,
});
interface CompProps {
  name: string;
  email?: string;
  token: string;
}

export default function AgreementGenerator({ name, token, email }: CompProps) {
  const [prompt, setPrompt] = useState("");
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [output, setOutput] = useState(""); // Markdown during stream, HTML after edit
  const [draftOutput, setDraftOutput] = useState(""); // Always HTML
  const [isRichText, setIsRichText] = useState(false); // Flag: true = HTML, false = Markdown
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("preview");
  const [section, setSection] = useState<Sections>("home");
  const [isStreaming, setIsStreaming] = useState(false);

  const [agreementPayload, setAgreementPayload] = useState<any>({});
  const [newsessionId, setNewSessionId] = useState<string>("");
  const [pageSettings, setPageSettings] = useState<PageSettings>({ 
    top: 25, 
    bottom: 25, 
    left: 25, 
    right: 25,
    showBorder: true,
    borderWidth: 1,
    borderStyle: "solid"
  });

  const [error, setError] = useState<string>("");

  // Ref for AbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Setting token in the cookies for further API calls
    setCookie("extensionAccessToken", token, {
      maxAge: 2 * 60 * 60, // 2 hours
    });
  }, [token]);

  /* ---------------- Stop Streaming ---------------- */
  const stopGeneration = () => {
    // Abort the fetch request
    abortControllerRef.current?.abort();
    setIsStreaming(false);
    setLoading(false);
  };

  /* ---------------- Generate Agreement ---------------- */
  const handleGenerate = async (payload?: any, sessionId?: string) => {

    setPromptHistory((prev) => [prompt, ...prev]);
    setOutput("");
    setIsRichText(false); // New content starts as Markdown
    setLoading(true);
    setMode("preview");
    setIsStreaming(true);

    // Create a new AbortController
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const res = await fetch(`/api/generateAgreement?token=${token}`, {
        method: "POST",
        body: JSON.stringify({
          url: API.ADMIN.EXTENSION.GENERATE_AGREEMENT,
          sessionId: sessionId || "",
          payload: payload || {},
          instruction: prompt,
        }),
        signal: abortController.signal,
        cache: "no-store",
      });

      setPrompt("");

      if (!res.body || !res.ok) {
        setLoading(false);
        setIsStreaming(false);
        setError(res.statusText || "Something went wrong while generating");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const e of events) {
          if (!e.startsWith("data:")) continue;

          const payload = JSON.parse(e.replace("data:", "").trim());

          if (payload.chunk_type === "done") {
            setLoading(false);
            setIsStreaming(false); // Reset streaming state
            return;
          }

          if (payload.chunk_type === "markdown") {
            setOutput((prev) => prev + payload.content);
          }
        }
      }

      setLoading(false);
      setIsStreaming(false); // Ensure reset if done is true but no 'done' chunk
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Generation stopped by user.");
      } else {
        console.error(err);
        setError(err.message || "Something went wrong while generating");
      }
      setLoading(false);
      setIsStreaming(false);
    }
  };

  const loadAgreement = (agreement: any) => {
    setOutput(agreement.content);
    setAgreementPayload(agreement.metadata.formData);
    setPageSettings(agreement.metadata.settings || { top: 25, bottom: 25, left: 25, right: 25, showBorder: true, borderWidth: 1, borderStyle: "solid" });
    setIsRichText(true);
    setMode("preview");
    setSection("home");
    toast.success("Agreement loaded into workspace");
  };

  // -------- Actions-----------
  const handleEdit = () => {
    // When entering edit mode, we convert Markdown to HTML EXACTLY ONCE
    const initialHtml = isRichText ? output : (marked(output) as string);
    setDraftOutput(initialHtml); 
    setMode("edit");
  };

  const handleDone = () => {
    // Commit the rich HTML changes
    setOutput(draftOutput); 
    setIsRichText(true); // Content is now definitively HTML
    setMode("preview");
  };

  const handleDiscard = () => {
    // Reset the draft to the current output (converting if needed)
    setDraftOutput(isRichText ? output : (marked(output) as string));
  };

  const handleSave = async (customData?: { title: string; description: string }) => {
    if (!output) {
      toast.error("No content to save");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: customData?.title || `Agreement - ${agreementPayload.tenant_name || "Untitled"}`,
        description: customData?.description || "",
        userEmail: email,
        content: isRichText ? output : (marked.parse(output) as string),
        metadata: {
          formData: agreementPayload,
          settings: pageSettings,
          generatedAt: new Date().toISOString(),
          sessionId: newsessionId,
        },
        status: "COMPLETED",
        version: 1,
      };

      console.log("Industrial Payload for MongoDB:", payload);

      // Placeholder for actual API call
      // const res = await fetch('/api/agreements/save', { 
      //   method: 'POST', 
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });
      
      // Simulate success for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Agreement saved to workspace!", {
        icon: '🚀',
        style: {
          borderRadius: '12px',
          background: '#1e293b',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to save agreement");
    } finally {
      setLoading(false);
    }
  };

  // Final rendering logic: uses flag instead of unreliable regex
  const html = isRichText ? output : (marked.parse(output) as string);
  const draftHtml = draftOutput;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* PROFESSIONAL UNIFIED SIDEBAR (CLEAN WHITE) */}
      <div className="w-[500px] shrink-0 h-full bg-white border-r border-slate-200 flex flex-col overflow-hidden relative z-20">
        
        {/* BRAND & NAVIGATION HEADER */}
        <div className="p-8 pb-4">
          <div className="flex justify-between items-center mb-10">
            <Link href="/" className="flex shrink-0 items-center">
              <Image
                src={"/new_logo.png"}
                alt="Logo"
                width={120}
                height={60}
                className="opacity-90 hover:opacity-100 transition-opacity"
                loading="eager"
              />
            </Link>
            <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-2 border ${mode === "edit" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-violet-50 text-violet-600 border-violet-200"}`}>
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${mode === "edit" ? "bg-amber-500" : "bg-violet-500"}`} />
              {mode === "edit" ? "Editor" : "Preview"}
            </div>
          </div>

          {/* SEGMENTED NAVIGATION (LIGHT STYLE) */}
          <div className="flex p-1.5 bg-slate-200/50 rounded-2xl mb-8 border border-slate-200">
            <button 
              onClick={() => setSection("home")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${section === "home" ? "bg-white text-violet-600 shadow-md shadow-violet-900/5 ring-1 ring-slate-200" : "text-slate-400 hover:text-slate-600"}`}
            >
              <HouseIcon size={18} weight={section === "home" ? "fill" : "bold"} />
              <span>Workspace</span>
            </button>
            <button 
              onClick={() => setSection("list")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${section === "list" ? "bg-white text-violet-600 shadow-md shadow-violet-900/5 ring-1 ring-slate-200" : "text-slate-400 hover:text-slate-600"}`}
            >
              <ClockCounterClockwiseIcon size={18} weight={section === "list" ? "fill" : "bold"} />
              <span>History</span>
            </button>
            <button 
              onClick={() => setSection("saved")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${section === "saved" ? "bg-white text-violet-600 shadow-md shadow-violet-900/5 ring-1 ring-slate-200" : "text-slate-400 hover:text-slate-600"}`}
            >
              <ListDashesIcon size={18} weight={section === "saved" ? "fill" : "bold"} />
              <span>Saved</span>
            </button>
            <button 
              onClick={() => setSection("settings")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${section === "settings" ? "bg-white text-violet-600 shadow-md shadow-violet-900/5 ring-1 ring-slate-200" : "text-slate-400 hover:text-slate-600"}`}
            >
              <SlidersHorizontalIcon size={18} weight={section === "settings" ? "fill" : "bold"} />
              <span>Setup</span>
            </button>
          </div>
        </div>

        {/* SIDEBAR CONTENT AREA */}
        <div className="flex-1 overflow-y-auto px-8 pb-10 scrollbar-hide">
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
            {section === "home" && (
              <HomeSection
                email={email as string}
                name={name}
                handleGenerate={handleGenerate}
                isStreaming={isStreaming}
                prompt={prompt}
                setPrompt={setPrompt}
                stopGeneration={stopGeneration}
                agreementPayload={agreementPayload}
                setAgreementPayload={setAgreementPayload}
                newsessionId={newsessionId}
                setNewSessionId={setNewSessionId}
              />
            )}

            {section === "list" && (
              <ListSection
                promptHistory={promptHistory}
                setPrompt={setPrompt}
                setSection={setSection}
              />
            )}

            {section === "saved" && (
              <SavedAssets 
                setSection={setSection}
                loadAgreement={loadAgreement}
              />
            )}

            {section === "settings" && (
              <SettingsSection 
                pageSettings={pageSettings}
                setPageSettings={setPageSettings}
              />
            )}
          </div>
        </div>
      </div>

      {/* RIGHT — Document Canvas */}
      <div className="flex-1 overflow-auto bg-[#f8fafc]">
        {/* Thinking animation (Cinematic AI Drafting) */}
        {loading && !output && (
          <div className="flex justify-center items-center h-[80vh] animate-in fade-in duration-1000">
            <div className="flex flex-col items-center gap-8">
              <div className="relative">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-violet-500/20 blur-[60px] rounded-full animate-pulse-glow" />
                
                {/* Intelligence Rings */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full animate-float-gentle">
                    <defs>
                      <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#c084fc" />
                      </linearGradient>
                    </defs>
                    {/* Pulsing Core */}
                    <circle cx="50" cy="50" r="35" fill="none" stroke="url(#aiGradient)" strokeWidth="0.5" strokeDasharray="4 4" className="animate-spin duration-[10s]" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.3" />
                  </svg>
                  
                  {/* Floating Sparkles */}
                  <div className="absolute inset-0">
                    {[...Array(6)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute w-1 h-1 bg-violet-400 rounded-full animate-sparkle"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.4}s`
                        }}
                      />
                    ))}
                  </div>

                  {/* AI Hub Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-3xl shadow-2xl flex items-center justify-center border border-slate-100/50 backdrop-blur-sm">
                      <div className="w-2.5 h-2.5 bg-violet-600 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.4em] text-slate-800 animate-pulse">Drafting Agreement</span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-slate-400 via-violet-400 to-slate-400 animate-ai-shimmer">Synthesizing legal context...</span>
              </div>
            </div>
          </div>
        )}

        {/* Preview (Visible during stream/loading if there is output) */}
        {mode === "preview" && output && (
          <Preview 
            handleEdit={handleEdit} 
            handleSave={handleSave} 
            html={html} 
            pageSettings={pageSettings}
          />
        )}

        {/* Edit */}
        {!loading && mode === "edit" && (
          <AgreementEditor 
            html={draftOutput} 
            onChange={setOutput} 
            handleDiscard={handleDiscard}
            handleDone={handleDone}
            output={output}
            draftOutput={draftOutput}
            pageSettings={pageSettings}
          />
        )}

        {!loading && !output && (
          <div className="flex justify-center items-center h-[80vh] animate-in fade-in duration-1000">
            <div className="flex flex-col items-center gap-10">
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Cinematic Empty State Stars */}
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-1 h-1 bg-violet-300 rounded-full animate-sparkle"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.3}s`
                    }}
                  />
                ))}
                
                {/* Abstract Parchment Outline */}
                <svg viewBox="0 0 100 120" className="w-48 h-48 opacity-20 text-slate-300 transition-all group-hover:opacity-40" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M25 10h50l15 15v85a5 5 0 0 1-5 5H25a5 5 0 0 1-5-5V15a5 5 0 0 1 5-5z" />
                  <path d="M75 10v15h15" />
                  <line x1="35" y1="40" x2="65" y2="40" />
                  <line x1="35" y1="50" x2="65" y2="50" />
                  <line x1="35" y1="60" x2="55" y2="60" />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-12 h-12 rounded-full border border-violet-100 bg-violet-50/30 backdrop-blur-sm flex items-center justify-center animate-pulse-glow">
                      <div className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                   </div>
                </div>
              </div>

              <div className="text-center space-y-3">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.5em] text-slate-800">Workspace Ready</h3>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest max-w-[280px] leading-relaxed mx-auto">
                  Configure the legal schema on the left to begin <span className="text-violet-500 font-bold">AI generation</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
