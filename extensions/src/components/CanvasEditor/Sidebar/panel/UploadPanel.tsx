"use client";

import { Canvas, FabricImage } from "fabric";
import { UploadSimpleIcon } from "@phosphor-icons/react";
import PanelSection from "./PanelSection";

export default function UploadPanel({ canvas }: { canvas: Canvas | null }) {
  const upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !e.target.files?.[0]) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (typeof ev.target?.result !== "string") return;
      FabricImage.fromURL(ev.target.result).then(img => {
        img.scaleToWidth(250);
        canvas.add(img);
      });
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <PanelSection title="Upload">
      <label className="panel-btn cursor-pointer">
        <UploadSimpleIcon size={18} />
        Upload Image
        <input hidden type="file" onChange={upload} />
      </label>
    </PanelSection>
  );
}
