"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { marked } from "marked";
import TurndownService from "turndown";
import { API } from "@/app/api/_api_const";
import Link from "next/link";
import Image from "next/image";
import HomeSection from "../AgreementGenerator/Sections/home";
import { ClockCounterClockwiseIcon, HouseIcon, InfoIcon, List, ListDashesIcon } from "@phosphor-icons/react";
import ListSection from "../AgreementGenerator/Sections/list";
import Preview from "../AgreementGenerator/Preview";
import { Mode, Sections } from "@/types/AgreementGenerator";
import SavedAssets from "../AgreementGenerator/Sections/saved";
import { setCookie } from "cookies-next/client";

const AgreementEditor = dynamic(() => import("../AgreementGenerator/Editor"), {
  ssr: false,
});
const turndown = new TurndownService();
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
                src={"/logo-bg-removed.png"}
                alt="Logo"
                width={110}
                height={40}
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
              />
            )}
          </div>
        </div>
      </div>

      {/* RIGHT — Document Canvas */}
      <div className="flex-1 overflow-auto bg-[#f8fafc]">
        {/* Thinking animation (only if no output yet) */}
        {loading && !output && (
          <div className="flex justify-center items-center text-zinc-400 h-[80vh]">
            <div className="flex flex-col items-center gap-3">
              {/* Thinking SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-64 h-64"
              >
                <path d="M30 10h36l14 14v66a6 6 0 0 1-6 6H30a6 6 0 0 1-6-6V16a6 6 0 0 1 6-6z" />
                <path d="M66 10v14h14" />

                <line x1="36" y1="40" x2="72" y2="40" />
                <line x1="36" y1="48" x2="72" y2="48" />
                <line x1="36" y1="56" x2="60" y2="56" />

                <circle cx="46" cy="74" r="2">
                  <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur="1.4s"
                    repeatCount="indefinite"
                    begin="0s"
                  />
                </circle>
                <circle cx="58" cy="74" r="2">
                  <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur="1.4s"
                    repeatCount="indefinite"
                    begin="0.2s"
                  />
                </circle>
                <circle cx="70" cy="74" r="2">
                  <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur="1.4s"
                    repeatCount="indefinite"
                    begin="0.4s"
                  />
                </circle>
              </svg>

              <span className="text-sm tracking-wide">
                Drafting your agreement…
              </span>
            </div>
          </div>
        )}

        {/* Preview (Visible during stream/loading if there is output) */}
        {mode === "preview" && output && (
          <Preview handleEdit={handleEdit} html={html} />
        )}

        {/* Edit */}
        {!loading && mode === "edit" && (
          <AgreementEditor
            html={draftOutput}
            onChange={(h) => setDraftOutput(h)}
            handleDone={handleDone}
            handleDiscard={handleDiscard}
            output={output}
            draftOutput={draftOutput}
          />
        )}

        {!loading && !output && (
          <div className="text-zinc-400 flex justify-center items-center h-[80vh]">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-64 h-64"
                >
                  <path d="M14 2h26l10 10v46a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z" />
                  <path d="M40 2v10h10" />

                  <line x1="18" y1="20" x2="46" y2="20" />
                  <line x1="18" y1="26" x2="46" y2="26" />
                  <line x1="18" y1="32" x2="38" y2="32" />

                  <line x1="18" y1="42" x2="34" y2="42" />
                  <path d="M36 40c2 2 4 2 6 0" />

                  <path d="M42 48l4 4 8-8" />
                </svg>
                <span>Agreement will appear here…</span>
              </div>
              {error && (
                <div className="mt-5 bg-red-300 text-red-900 border border-red-900 rounded-lg px-3 py-2 font-semibold">
                  {error}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
