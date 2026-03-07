"use client";

import { Canvas, Textbox } from "fabric";
import PanelSection from "./PanelSection";
import { TextTIcon } from "@phosphor-icons/react";

// Define a consistent schema for all text types
interface TextOption {
  type: string;
  label: string;
  placeholder: string;
  fontSize: number;
  fontWeight?: "normal" | "bold" | "semibold" | "lighter";
  fontStyle?: "normal" | "italic";
  fill: string;
  width?: number;
}

// Define all options with consistent schema
const textOptions: TextOption[] = [
  {
    type: "heading",
    label: "Heading",
    placeholder: "Heading",
    fontSize: 36,
    fontWeight: "bold",
    fontStyle: "normal",
    fill: "#111827",
    width: 300,
  },
  {
    type: "subheading",
    label: "Subheading",
    placeholder: "Subheading",
    fontSize: 28,
    fontWeight: "semibold",
    fontStyle: "normal",
    fill: "#1F2937",
    width: 280,
  },
  {
    type: "body",
    label: "Body",
    placeholder: "Body text",
    fontSize: 20,
    fontWeight: "normal",
    fontStyle: "normal",
    fill: "#374151",
    width: 300,
  },
  {
    type: "quote",
    label: "Quote",
    placeholder: "“Your quote here”",
    fontSize: 24,
    fontWeight: "normal",
    fontStyle: "italic",
    fill: "#6B7280",
    width: 320,
  },
  {
    type: "caption",
    label: "Caption",
    placeholder: "Caption text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    fill: "#4B5563",
    width: 250,
  },
  {
    type: "highlight",
    label: "Highlight",
    placeholder: "Highlighted text",
    fontSize: 22,
    fontWeight: "bold",
    fontStyle: "normal",
    fill: "#F59E0B",
    width: 280,
  },
  {
    type: "small",
    label: "Small text",
    placeholder: "Small text",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    fill: "#6B7280",
    width: 200,
  },
];

export default function TextPanel({ canvas }: { canvas: Canvas | null }) {
  const addText = (option: TextOption) => {
    if (!canvas) return;

    const text = new Textbox(option.placeholder, {
      left: 120,
      top: 120,
      fontSize: option.fontSize,
      fontWeight: option.fontWeight as any,
      fontStyle: option.fontStyle || "normal",
      fill: option.fill,
      width: option.width || 300,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  return (
    <PanelSection title="Text Options">
      <div className="space-y-3">
        {textOptions.map((opt) => (
          <button
            key={opt.type}
            onClick={() => addText(opt)}
            className="w-full flex flex-col items-start gap-1 p-3 border rounded-lg hover:border-blue-400 hover:bg-blue-50 transition"
          >
            {/* Preview */}
            <div
              className="w-full text-left truncate"
              style={{
                fontSize: opt.fontSize,
                fontWeight: opt.fontWeight as any,
                fontStyle: opt.fontStyle,
                color: opt.fill,
              }}
            >
              {opt.placeholder}
            </div>
            {/* Label */}
            <span className="text-xs text-gray-500">{opt.label}</span>
          </button>
        ))}
      </div>
    </PanelSection>
  );
}
