"use client";

import { Canvas, Rect, Circle, Triangle, Polygon, Line } from "fabric";
import {
  SquareIcon,
  CircleIcon,
  TriangleIcon,
  StarIcon,
  PencilSimpleIcon,
  LineSegmentIcon,
} from "@phosphor-icons/react";
import PanelSection from "./PanelSection";

export default function ShapesPanel({ canvas }: { canvas: Canvas | null }) {
  if (!canvas) return null;

  const addShape = (type: string) => {
    let shape: any;
    const strokeColor = "#111827";
    const strokeWidth = 2;

    switch (type) {
      case "rectangle":
        shape = new Rect({ left: 120, top: 120, width: 120, height: 80, fill: "", stroke: strokeColor, strokeWidth });
        break;
      case "circle":
        shape = new Circle({ left: 120, top: 120, radius: 50, fill: "", stroke: strokeColor, strokeWidth });
        break;
      case "triangle":
        shape = new Triangle({ left: 120, top: 120, width: 100, height: 100, fill: "", stroke: strokeColor, strokeWidth });
        break;
      case "star":
        const points = [];
        const outerRadius = 50;
        const innerRadius = 20;
        for (let i = 0; i < 10; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (Math.PI / 5) * i;
          points.push({ x: radius * Math.sin(angle), y: -radius * Math.cos(angle) });
        }
        shape = new Polygon(points, { left: 120, top: 120, fill: "", stroke: strokeColor, strokeWidth });
        break;
      case "line":
        shape = new Line([0, 0, 120, 0], { left: 120, top: 120, stroke: strokeColor, strokeWidth });
        break;
      case "freeDraw":
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = strokeWidth;
        canvas.freeDrawingBrush.color = strokeColor;
        return;
    }

    if (shape) {
      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.renderAll();
    }
  };

  const shapes = [
    { type: "rectangle", icon: SquareIcon, label: "Rectangle" },
    { type: "circle", icon: CircleIcon, label: "Circle" },
    { type: "triangle", icon: TriangleIcon, label: "Triangle" },
    { type: "star", icon: StarIcon, label: "Star" },
    { type: "line", icon: LineSegmentIcon, label: "Line" },
    { type: "freeDraw", icon: PencilSimpleIcon, label: "Free Draw" },
  ];

  return (
    <PanelSection title="Shapes">
      <div className="flex flex-col gap-3">
        {shapes.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.type}
              onClick={() => addShape(s.type)}
              className="flex items-center gap-3 p-3 border rounded-lg hover:border-blue-400 hover:bg-blue-50 transition w-full"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded border">
                <Icon size={20} />
              </div>
              <span className="text-sm text-gray-700">{s.label}</span>
            </button>
          );
        })}
      </div>
    </PanelSection>
  );
}
