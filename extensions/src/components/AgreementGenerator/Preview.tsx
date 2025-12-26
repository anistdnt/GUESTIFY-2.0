"use client";

import { PenNibIcon, CaretDownIcon } from "@phosphor-icons/react";
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

  const downloadPDF = () => {
    // Typically handled via backend
    console.log("Download as PDF");
  };

  const downloadDOCX = () => {
    // Typically handled via backend
    console.log("Download as DOCX");
  };

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
    <div className="editor-wraper">
      {/* Toolbar */}
      <div className="preview-toolbar flex justify-end gap-3 relative">
        {/* Edit */}
        <button
          onClick={handleEdit}
          className="border bg-gray-600 text-white px-2 py-2 rounded hover:bg-gray-700 flex justify-center items-center gap-2 text-sm"
        >
          <PenNibIcon size={15} weight="fill" />
          <span className="">Edit</span>
        </button>

        {/* Download Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 border bg-gray-800 text-white px-3 py-2 rounded text-sm"
          >
            <span className="pe-1">Download As</span>
            <span className="border-l ps-1"><CaretDownIcon size={15} weight="fill" /></span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-36 rounded-lg border bg-white shadow-md z-50 text-gray-600">
              <button
                onClick={downloadPDF}
                className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
              >
                PDF (.pdf)
              </button>
              <button
                onClick={downloadDOCX}
                className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
              >
                DOCX (.doc)
              </button>
              <button
                onClick={downloadHTML}
                className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
              >
                HTML (.html)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white p-4 rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.12)]">
        <div
          className="agreement-editor"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
