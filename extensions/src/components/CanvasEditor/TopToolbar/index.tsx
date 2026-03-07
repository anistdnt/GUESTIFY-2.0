"use client";

import { useState } from "react";
import { Canvas, Textbox, ActiveSelection, Object as FabricObject } from "fabric";
import {
  ArrowCounterClockwiseIcon,
  ArrowClockwiseIcon,
  TrashIcon,
  CopySimpleIcon,
  TextBIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  PaletteIcon,
  PlusIcon,
  MinusIcon,
  FloppyDiskIcon,
  DownloadSimpleIcon,
  PencilSimpleIcon,
  EraserIcon,
} from "@phosphor-icons/react";

interface TopToolbarProps {
  canvas: Canvas | null;
  pgId?: string;
}

export default function TopToolbar({ canvas, pgId }: TopToolbarProps) {
  const [fontSize, setFontSize] = useState<number>(24);
  const [fillColor, setFillColor] = useState<string>("#111827");
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [freeDraw, setFreeDraw] = useState<boolean>(false);

  // --- Helpers ---
  const getActiveObj = (): FabricObject | null => canvas?.getActiveObject() || null;

  // --- Undo/Redo (placeholder, implement history stack if needed) ---
  const undo = () => console.log("Undo clicked");
  const redo = () => console.log("Redo clicked");

  // --- Copy/Delete ---
  const copyObject = () => {
    const obj = getActiveObj();
    if (obj) obj.clone((cloned) => canvas?.add(cloned));
  };
  const deleteObject = () => {
    const obj = getActiveObj();
    if (obj) canvas?.remove(obj);
  };

  // --- Text Formatting ---
  const toggleBold = () => {
    const obj = getActiveObj();
    if (obj?.type === "textbox") {
      const textbox = obj as Textbox;
      textbox.set("fontWeight", textbox.fontWeight === "bold" ? "normal" : "bold");
      canvas?.requestRenderAll();
    }
  };

  const toggleItalic = () => {
    const obj = getActiveObj();
    if (obj?.type === "textbox") {
      const textbox = obj as Textbox;
      textbox.set("fontStyle", textbox.fontStyle === "italic" ? "normal" : "italic");
      canvas?.requestRenderAll();
    }
  };

  const toggleUnderline = () => {
    const obj = getActiveObj();
    if (obj?.type === "textbox") {
      const textbox = obj as Textbox;
      textbox.set("underline", !textbox.underline);
      canvas?.requestRenderAll();
    }
  };

  const alignText = (align: "left" | "center" | "right") => {
    const obj = getActiveObj();
    if (obj?.type === "textbox") {
      const textbox = obj as Textbox;
      textbox.set("textAlign", align);
      canvas?.requestRenderAll();
    }
  };

  const changeFontSize = (size: number) => {
    const obj = getActiveObj();
    if (obj?.type === "textbox") {
      const textbox = obj as Textbox;
      textbox.set("fontSize", size);
      canvas?.requestRenderAll();
    }
    setFontSize(size);
  };

  const changeFillColor = (color: string) => {
    const obj = getActiveObj();
    if (obj) {
      if ("set" in obj) obj.set("fill", color);
      canvas?.requestRenderAll();
    }
    setFillColor(color);
  };

  // --- Stroke / Layer ---
  const increaseStroke = () => setStrokeWidth((prev) => Math.min(prev + 1, 10));
  const decreaseStroke = () => setStrokeWidth((prev) => Math.max(prev - 1, 1));
  const bringForward = () => getActiveObj()?.bringForward();
  const sendBackward = () => getActiveObj()?.sendBackwards();

  // --- Free Draw & Eraser ---
  const toggleFreeDraw = () => {
    if (!canvas) return;
    canvas.isDrawingMode = !canvas.isDrawingMode;
    setFreeDraw(canvas.isDrawingMode);
    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush.width = strokeWidth;
      canvas.freeDrawingBrush.color = fillColor;
    }
  };

  // --- Zoom ---
  const zoomIn = () => {
    if (!canvas) return;
    const newZoom = Math.min((canvas.getZoom() || 1) + 0.1, 3);
    canvas.setZoom(newZoom);
    canvas.requestRenderAll();
  };
  const zoomOut = () => {
    if (!canvas) return;
    const newZoom = Math.max((canvas.getZoom() || 1) - 0.1, 0.1);
    canvas.setZoom(newZoom);
    canvas.requestRenderAll();
  };

  // --- Save & Export ---
  const save = async () => {
    if (!canvas) return;
    await fetch("/api/designs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pgId,
        data: canvas.toJSON(),
        thumbnail: canvas.toDataURL({ multiplier: 0.2 }),
      }),
    });
  };
  const exportPNG = () => {
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL({ format: "png" });
    link.download = "design.png";
    link.click();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-white border-b">
      {/* Undo/Redo */}
      <div className="flex gap-1 border-r pr-2">
        <button onClick={undo} className="p-2 hover:bg-gray-100 rounded"><ArrowCounterClockwiseIcon size={20} /></button>
        <button onClick={redo} className="p-2 hover:bg-gray-100 rounded"><ArrowClockwiseIcon size={20} /></button>
      </div>

      {/* Copy/Delete */}
      <div className="flex gap-1 border-r pr-2">
        <button onClick={copyObject} className="p-2 hover:bg-gray-100 rounded"><CopySimpleIcon size={20} /></button>
        <button onClick={deleteObject} className="p-2 hover:bg-gray-100 rounded"><TrashIcon size={20} /></button>
      </div>

      {/* Text Formatting */}
      <div className="flex gap-1 border-r pr-2">
        <button onClick={toggleBold} className="p-2 hover:bg-gray-100 rounded"><TextBIcon size={20} /></button>
        <button onClick={toggleItalic} className="p-2 hover:bg-gray-100 rounded"><TextItalicIcon size={20} /></button>
        <button onClick={toggleUnderline} className="p-2 hover:bg-gray-100 rounded"><TextUnderlineIcon size={20} /></button>
        <button onClick={() => alignText("left")} className="p-2 hover:bg-gray-100 rounded"><TextAlignLeftIcon size={20} /></button>
        <button onClick={() => alignText("center")} className="p-2 hover:bg-gray-100 rounded"><TextAlignCenterIcon size={20} /></button>
        <button onClick={() => alignText("right")} className="p-2 hover:bg-gray-100 rounded"><TextAlignRightIcon size={20} /></button>
      </div>

      {/* Font & Color */}
      <div className="flex items-center gap-1 border-r pr-2">
        <input
          type="number"
          value={fontSize}
          min={8}
          max={72}
          onChange={(e) => changeFontSize(parseInt(e.target.value))}
          className="w-14 px-2 py-1 border rounded"
          title="Font Size"
        />
        <input
          type="color"
          value={fillColor}
          onChange={(e) => changeFillColor(e.target.value)}
          className="w-10 h-8 p-0 border rounded cursor-pointer"
          title="Fill Color"
        />
      </div>

      {/* Stroke / Layer */}
      <div className="flex items-center gap-1 border-r pr-2">
        <button onClick={decreaseStroke} className="p-2 hover:bg-gray-100 rounded" title="Decrease Stroke"><MinusIcon size={18} /></button>
        <button onClick={increaseStroke} className="p-2 hover:bg-gray-100 rounded" title="Increase Stroke"><PlusIcon size={18} /></button>
        <button onClick={bringForward} className="p-2 hover:bg-gray-100 rounded" title="Bring Forward">↑</button>
        <button onClick={sendBackward} className="p-2 hover:bg-gray-100 rounded" title="Send Backward">↓</button>
      </div>

      {/* Free Draw / Eraser */}
      <div className="flex items-center gap-1 border-r pr-2">
        <button onClick={toggleFreeDraw} className="p-2 hover:bg-gray-100 rounded" title="Free Draw"><PencilSimpleIcon size={20} /></button>
        <button onClick={() => { if(canvas) canvas.isDrawingMode=false; }} className="p-2 hover:bg-gray-100 rounded" title="Eraser"><EraserIcon size={20} /></button>
      </div>

      {/* Zoom */}
      <div className="flex items-center gap-1 border-r pr-2">
        <button onClick={zoomOut} className="p-2 hover:bg-gray-100 rounded" title="Zoom Out">-</button>
        <span>{Math.round((canvas?.getZoom() || 1) * 100)}%</span>
        <button onClick={zoomIn} className="p-2 hover:bg-gray-100 rounded" title="Zoom In">+</button>
      </div>

      {/* Save / Export */}
      <div className="flex items-center gap-1 ml-auto">
        <button onClick={save} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"><FloppyDiskIcon size={18} /> Save</button>
        <button onClick={exportPNG} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"><DownloadSimpleIcon size={18} /> Export PNG</button>
      </div>
    </div>
  );
}
