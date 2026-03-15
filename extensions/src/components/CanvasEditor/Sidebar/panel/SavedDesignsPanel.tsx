"use client";

import { Canvas } from "fabric";
import { FileCloudIcon } from "@phosphor-icons/react";
import PanelSection from "./PanelSection";

export default function SavedDesignsPanel({ canvas }: { canvas: Canvas | null }) {
  const loadDummy = () => {
    if (!canvas) return;
    // future: fetch JSON → canvas.loadFromJSON()
  };

  return (
    <PanelSection title="Saved Designs">
      <button onClick={loadDummy} className="panel-btn">
        <FileCloudIcon size={18} />
        Sample Design
      </button>
    </PanelSection>
  );
}
