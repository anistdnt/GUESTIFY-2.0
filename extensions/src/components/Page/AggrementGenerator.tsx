"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { marked } from "marked";
import TurndownService from "turndown";
import { API } from "@/app/api/_api_const";
import Link from "next/link";
import Image from "next/image";
import HomeSection from "../AgreementGenerator/Sections/home";
import { HouseIcon, InfoIcon, ListDashesIcon } from "@phosphor-icons/react";
import ListSection from "../AgreementGenerator/Sections/list";
import Preview from "../AgreementGenerator/Preview";

const AgreementEditor = dynamic(() => import("../AgreementGenerator/Editor"), {
  ssr: false,
});
const turndown = new TurndownService();

type Mode = "preview" | "edit";

type Sections = "home" | "list" | "settings";

interface CompProps {
  name: string;
  email?: string;
  token: string;
}

export default function AgreementGenerator({ name, token, email }: CompProps) {
  const [prompt, setPrompt] = useState("");
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [output, setOutput] = useState(""); // markdown
  const [draftOutput, setDraftOutput] = useState("");
  const [queue, setQueue] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("preview");
  const [section, setSection] = useState<Sections>("home");
  const [isStreaming, setIsStreaming] = useState(false);

  const [error, setError] = useState<string>("");

  // Ref for AbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  /* ---------------- Smooth streaming typing ---------------- */
  useEffect(() => {
    if (!queue) {
      setIsStreaming(false);
      return;
    }

    const interval = setInterval(() => {
      setOutput((prev) => prev + queue.slice(0, 2));
      setQueue((prev) => prev.slice(2));
    }, 16);

    return () => clearInterval(interval);
  }, [queue]);

  /* ---------------- Stop Streaming ---------------- */
  const stopGeneration = () => {
    // Abort the fetch request
    abortControllerRef.current?.abort();
    setQueue("");
    setIsStreaming(false);
    setLoading(false);
  };

  /* ---------------- Generate Agreement ---------------- */
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setPromptHistory((prev) => [prompt, ...prev]);
    setOutput("");
    setQueue("");
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
          sessionId: "abcdefgh",
          payload: {},
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
            return;
          }

          if (payload.chunk_type === "markdown") {
            setQueue((prev) => prev + payload.content);
          }
        }
      }

      setLoading(false);
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Generation stopped by user.");
      } else {
        console.error(err);
        setError(err.message || "Something went wrong while generating");
      }
      setQueue("");
      setLoading(false);
      setIsStreaming(false);
    }
  };

  // -------- Actions-----------
  const handleEdit = () => {
    setDraftOutput(output); // snapshot
    setMode("edit");
  };

  const handleDone = () => {
    setOutput(draftOutput); // commit changes
    setMode("preview");
  };

  const handleDiscard = () => {
    setDraftOutput(output); // drop edits
  };

  const html = marked(output);

  return (
    <div className="flex h-screen bg-zinc-100">
      {/* LEFT — Welcome, Prompt & History */}
      <div className="w-1/3 p-3 flex flex-row gap-4">
        <div className="bg-white py-3 px-2 h-full shadow-[0_0_10px_rgba(0,0,0,0.16)] rounded-lg flex flex-col gap-4">
          <div onClick={() => setSection("home")} className="cursor-pointer">
            <HouseIcon
              size={28}
              weight="fill"
              className={section === "home" ? "text-gray-600" : "text-gray-400"}
            />
          </div>
          <hr />
          <div onClick={() => setSection("list")} className="cursor-pointer">
            <ListDashesIcon
              size={28}
              weight="fill"
              className={section === "list" ? "text-gray-600" : "text-gray-400"}
            />
          </div>
        </div>
        <div className="bg-white py-3 px-4 h-full shadow-[0_0_10px_rgba(0,0,0,0.16)] rounded-2xl flex-1">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex shrink-0 items-center mb-1">
              <Image
                src={"/logo-bg-removed.png"}
                alt="Logo"
                width={130}
                height={50}
                loading="eager"
              />
            </Link>
            <p className="text-xs text-gray-600 bg-gray-200 border border-gray-600 px-2 py-1 rounded-lg flex justify-center items-center gap-1">
              <span><InfoIcon size={14} weight="fill" /></span>
              <span>{mode === "edit" ? "Editor Mode" : "Preview Mode"}</span>
            </p>
          </div>
          <hr />

          {/* Sections */}
          {section === "home" && (
            <HomeSection
              email={email as string}
              name={name}
              handleGenerate={handleGenerate}
              isStreaming={isStreaming}
              prompt={prompt}
              setPrompt={setPrompt}
              promptHistory={promptHistory}
              stopGeneration={stopGeneration}
            />
          )}

          {section === "list" && <ListSection />}
        </div>
      </div>

      {/* RIGHT — Agreement */}
      <div className="w-2/3 p-8 overflow-auto bg-zinc-100">
        {/* Thinking animation */}
        {loading && (
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

        {/* Preview */}
        <div className="flex justify-start mb-2">
          {!loading && mode === "preview" && output && (
            <Preview handleEdit={handleEdit} html={html} />
          )}
        </div>

        {/* Edit */}
        {!loading && mode === "edit" && (
          <AgreementEditor
            html={html}
            onChange={(newHtml) => {
              const md = turndown.turndown(newHtml);
              setDraftOutput(md);
            }}
            handleDone={handleDone}
            handleDiscard={handleDiscard}
            output={output}
            draftOuput={draftOutput}
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
