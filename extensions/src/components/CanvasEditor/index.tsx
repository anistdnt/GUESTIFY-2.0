"use client";

import { Canvas } from "fabric";
import { useEffect, useRef, useState } from "react";
import FabricCanvas from "./FabricCanvas/index";
import TopToolbar from "./TopToolbar/index";
import Sidebar from "./Sidebar/index";
import PropertiesPanel from "./PropertiesPanel/index";

interface CompProps {
  name: string;
  email?: string;
  token: string;
}


export default function CanvasEditor(props : CompProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<any>(null);

  const initialize = (fabricCanvas: Canvas)=>{
    setCanvas(fabricCanvas);

    fabricCanvas.on("selection:created", e =>
      setSelectedObject(e.selected?.[0] ?? null)
    );

    fabricCanvas.on("selection:updated", e =>
      setSelectedObject(e.selected?.[0] ?? null)
    );

    fabricCanvas.on("selection:cleared", () =>
      setSelectedObject(null)
    );
  }

  const dispose = (fabricCanvas: Canvas) => {
    fabricCanvas.dispose();
  }

  useEffect(() => {
    const fabricCanvas = new Canvas(canvasRef.current!, {
      width: 800,
      height: 600,
      backgroundColor: "#fff",
    });

    initialize(fabricCanvas);

    return () => dispose(fabricCanvas);
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar canvas={canvas} {...props} />
      <div className="flex-1 flex flex-col">
        <TopToolbar canvas={canvas} />
        <FabricCanvas canvasRef={canvasRef} />
      </div>
      <PropertiesPanel canvas={canvas} selectedObject={selectedObject} />
    </div>
  );
}
