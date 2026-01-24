"use client";

import { useEffect, useRef } from "react";
import { Canvas, Rect, Circle, PencilBrush } from "fabric";

export default function FabricCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // INIT CANVAS
    const canvas = new Canvas(canvasRef.current, {
      width: 900,
      height: 500,
      backgroundColor: "#ffffff",
    });

    fabricRef.current = canvas;

    // FREE DRAW ENABLED
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.width = 2;
    canvas.freeDrawingBrush.color = "#000";

    // CLEANUP
    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <canvas
        ref={canvasRef}
        className="border border-gray-300 shadow-sm bg-white"
      />
    </div>
  );
}
