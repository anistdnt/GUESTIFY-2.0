"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Canvas,
  FabricImage,
  Rect,
  Circle,
  Triangle,
  Polygon,
  Textbox,
} from "fabric";
import {
  TextT,
  Image as ImageIcon,
  Square,
  Circle as CircleIcon,
  Star,
  UploadSimple,
  DownloadSimple,
  Trash,
  CopySimple,
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight,
  TextB,
  TextItalic,
  TextUnderline,
  CaretLeft,
  CaretRight,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  ArrowCounterClockwise,
  ArrowClockwise,
  FloppyDisk,
  Folder,
  Triangle as TriangleIcon,
} from "@phosphor-icons/react";

export default function CanvasEditor() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [activeTab, setActiveTab] = useState("text");
  const [selectedObject, setSelectedObject] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(0);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [zoom, setZoom] = useState(100);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const saveState = () => {
    if (!canvas) return;
    const json = canvas.toJSON();
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(json);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleObjectModified = () => {
    void saveState(); // explicitly ignore Promise
  };

  useEffect(() => {
    const fabricCanvas = new Canvas(canvasRef.current!, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
    });

    setCanvas(fabricCanvas);

    fabricCanvas.on("selection:created", (e) =>
      setSelectedObject(e.selected?.[0] ?? null),
    );

    fabricCanvas.on("selection:updated", (e) =>
      setSelectedObject(e.selected?.[0] ?? null),
    );

    fabricCanvas.on("selection:cleared", () => setSelectedObject(null));

    fabricCanvas.on("object:modified", handleObjectModified);

    return () => {
      fabricCanvas.off("object:modified", handleObjectModified);
      fabricCanvas.dispose();
    };
  }, []);

  const undo = () => {
    if (historyStep > 0 && canvas) {
      const newStep = historyStep - 1;
      canvas.loadFromJSON(history[newStep], () => {
        canvas.renderAll();
        setHistoryStep(newStep);
      });
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1 && canvas) {
      const newStep = historyStep + 1;
      canvas.loadFromJSON(history[newStep], () => {
        canvas.renderAll();
        setHistoryStep(newStep);
      });
    }
  };

  // Add text
  const addText = (type = "normal") => {
    if (!canvas) return;

    const text = new Textbox(type === "heading" ? "Heading" : "Add text", {
      left: 100,
      top: 100,
      fontSize: type === "heading" ? 48 : 24,
      fontWeight: type === "heading" ? "bold" : "normal",
      fill: "#000000",
      width: 200,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    saveState();
  };

  // Add shapes
  const addShape = (type) => {
    if (!canvas) return;

    let shape;
    switch (type) {
      case "rectangle":
        shape = new Rect({
          left: 100,
          top: 100,
          width: 200,
          height: 150,
          fill: "#3b82f6",
        });
        break;
      case "circle":
        shape = new Circle({
          left: 100,
          top: 100,
          radius: 75,
          fill: "#10b981",
        });
        break;
      case "triangle":
        shape = new Triangle({
          left: 100,
          top: 100,
          width: 150,
          height: 150,
          fill: "#f59e0b",
        });
        break;
      case "star":
        const points = [];
        const outerRadius = 75;
        const innerRadius = 35;
        for (let i = 0; i < 10; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (Math.PI / 5) * i;
          points.push({
            x: radius * Math.sin(angle),
            y: -radius * Math.cos(angle),
          });
        }
        shape = new Polygon(points, {
          left: 100,
          top: 100,
          fill: "#ef4444",
        });
        break;
    }
    if (shape) {
      canvas.add(shape);
      canvas.setActiveObject(shape);
      saveState();
    }
  };

  // Add image
  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas) return;

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") return;

      FabricImage.fromURL(reader.result).then((img) => {
        img.scaleToWidth(300);
        img.set({ left: 100, top: 100 });
        canvas.add(img);
        void saveState();
      });
    };

    reader.readAsDataURL(file);
  };

  // Delete object
  const deleteObject = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active) {
      canvas.remove(active);
      saveState();
    }
  };

  // Copy object
  const copyObject = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active) {
      active.clone((cloned) => {
        cloned.set({ left: active.left + 20, top: active.top + 20 });
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        saveState();
      });
    }
  };

  // Text formatting
  const formatText = (property, value) => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (
      active &&
      (active.type === "textbox" ||
        active.type === "i-text" ||
        active.type === "text")
    ) {
      active.set(property, value);
      canvas.renderAll();
      saveState();
    }
  };

  // Alignment
  const alignObject = (alignment) => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active) {
      switch (alignment) {
        case "left":
          active.set({ left: 0 });
          break;
        case "center":
          active.set({
            left: (canvas.width - active.width * active.scaleX) / 2,
          });
          break;
        case "right":
          active.set({ left: canvas.width - active.width * active.scaleX });
          break;
      }
      canvas.renderAll();
      saveState();
    }
  };

  // Zoom
  const handleZoom = (delta) => {
    if (!canvas) return;
    const newZoom = Math.max(10, Math.min(200, zoom + delta));
    setZoom(newZoom);
    canvas.setZoom(newZoom / 100);
    canvas.renderAll();
  };

  // Save design
  const saveDesign = async () => {
    if (!canvas) return;
    const json = canvas.toJSON();
    const thumbnail = canvas.toDataURL({
      format: "png",
      quality: 0.5,
      multiplier: 0.2,
    });
    const design = {
      id: `design:${Date.now()}`,
      name: `Design ${savedDesigns.length + 1}`,
      data: json,
      thumbnail,
      timestamp: Date.now(),
    };

    try {
      alert("Design saved successfully!");
    } catch (error) {
      console.error("Error saving design:", error);
      alert("Failed to save design");
    }
  };

  // Load design
  const loadDesign = (design) => {
    if (!canvas) return;
    canvas.loadFromJSON(design.data, () => {
      canvas.renderAll();
      saveState();
    });
  };

  // Delete saved design
  const deleteSavedDesign = async (design) => {
    try {
    } catch (error) {
      console.error("Error deleting design:", error);
    }
  };

  // Export
  const exportCanvas = (format) => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({ format, quality: 1 });
    const link = document.createElement("a");
    link.download = `design.${format}`;
    link.href = dataURL;
    link.click();
  };

  const tabs = [
    { id: "text", icon: TextT, label: "Text" },
    { id: "images", icon: ImageIcon, label: "Images" },
    { id: "shapes", icon: Square, label: "Shapes" },
    { id: "uploads", icon: UploadSimple, label: "Uploads" },
    { id: "saved", icon: Folder, label: "Saved" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white border-r transition-all duration-300 ${isSidebarCollapsed ? "w-16" : "w-72"}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {!isSidebarCollapsed && (
            <h2 className="font-semibold text-lg">Canvas Editor</h2>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            {isSidebarCollapsed ? (
              <CaretRight size={20} />
            ) : (
              <CaretLeft size={20} />
            )}
          </button>
        </div>

        {!isSidebarCollapsed && (
          <>
            <div className="flex border-b">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 p-3 flex flex-col items-center gap-1 ${activeTab === tab.id ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600" : "hover:bg-gray-50"}`}
                >
                  <tab.icon size={20} />
                  <span className="text-xs">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-4 overflow-y-auto h-[calc(100vh-140px)]">
              {activeTab === "text" && (
                <div className="space-y-3">
                  <button
                    onClick={() => addText("heading")}
                    className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-left"
                  >
                    <div className="font-bold text-xl">Add Heading</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Large title text
                    </div>
                  </button>
                  <button
                    onClick={() => addText("normal")}
                    className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-left"
                  >
                    <div className="font-medium">Add Text</div>
                    <div className="text-xs text-gray-500 mt-1">Body text</div>
                  </button>
                </div>
              )}

              {activeTab === "shapes" && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => addShape("rectangle")}
                    className="p-6 bg-gray-50 hover:bg-gray-100 rounded-lg flex flex-col items-center gap-2"
                  >
                    <Square size={32} className="text-blue-600" />
                    <span className="text-sm">Rectangle</span>
                  </button>
                  <button
                    onClick={() => addShape("circle")}
                    className="p-6 bg-gray-50 hover:bg-gray-100 rounded-lg flex flex-col items-center gap-2"
                  >
                    <CircleIcon size={32} className="text-green-600" />
                    <span className="text-sm">Circle</span>
                  </button>
                  <button
                    onClick={() => addShape("triangle")}
                    className="p-6 bg-gray-50 hover:bg-gray-100 rounded-lg flex flex-col items-center gap-2"
                  >
                    <TriangleIcon size={32} className="text-amber-600" />
                    <span className="text-sm">Triangle</span>
                  </button>
                  <button
                    onClick={() => addShape("star")}
                    className="p-6 bg-gray-50 hover:bg-gray-100 rounded-lg flex flex-col items-center gap-2"
                  >
                    <Star size={32} className="text-red-600" />
                    <span className="text-sm">Star</span>
                  </button>
                </div>
              )}

              {activeTab === "uploads" && (
                <div className="space-y-3">
                  <label className="w-full p-8 bg-gray-50 hover:bg-gray-100 rounded-lg border-2 border-dashed flex flex-col items-center gap-2 cursor-pointer">
                    <UploadSimple size={32} className="text-gray-400" />
                    <span className="text-sm font-medium">Upload Image</span>
                    <span className="text-xs text-gray-500">PNG, JPG, SVG</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={addImage}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {activeTab === "saved" && (
                <div className="space-y-3">
                  {savedDesigns.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Folder size={48} className="mx-auto mb-2 opacity-50" />
                      <p>No saved designs yet</p>
                    </div>
                  ) : (
                    savedDesigns.map((design) => (
                      <div
                        key={design.id}
                        className="bg-gray-50 rounded-lg overflow-hidden"
                      >
                        <img
                          src={design.thumbnail}
                          alt={design.name}
                          className="w-full h-32 object-cover cursor-pointer"
                          onClick={() => loadDesign(design)}
                        />
                        <div className="p-3 flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">
                              {design.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(design.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteSavedDesign(design)}
                            className="p-2 hover:bg-red-100 rounded text-red-600"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b p-3 flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 border-r pr-2">
            <button
              onClick={undo}
              disabled={historyStep === 0}
              className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
              title="Undo"
            >
              <ArrowCounterClockwise size={20} />
            </button>
            <button
              onClick={redo}
              disabled={historyStep === history.length - 1}
              className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
              title="Redo"
            >
              <ArrowClockwise size={20} />
            </button>
          </div>

          <div className="flex items-center gap-1 border-r pr-2">
            <button
              onClick={copyObject}
              disabled={!selectedObject}
              className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
              title="Copy"
            >
              <CopySimple size={20} />
            </button>
            <button
              onClick={deleteObject}
              disabled={!selectedObject}
              className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
              title="Delete"
            >
              <Trash size={20} />
            </button>
          </div>

          {selectedObject?.type === "textbox" && (
            <div className="flex items-center gap-1 border-r pr-2">
              <button
                onClick={() =>
                  formatText(
                    "fontWeight",
                    selectedObject.fontWeight === "bold" ? "normal" : "bold",
                  )
                }
                className={`p-2 hover:bg-gray-100 rounded ${selectedObject.fontWeight === "bold" ? "bg-gray-200" : ""}`}
                title="Bold"
              >
                <TextB size={20} />
              </button>
              <button
                onClick={() =>
                  formatText(
                    "fontStyle",
                    selectedObject.fontStyle === "italic" ? "normal" : "italic",
                  )
                }
                className={`p-2 hover:bg-gray-100 rounded ${selectedObject.fontStyle === "italic" ? "bg-gray-200" : ""}`}
                title="Italic"
              >
                <TextItalic size={20} />
              </button>
              <button
                onClick={() =>
                  formatText("underline", !selectedObject.underline)
                }
                className={`p-2 hover:bg-gray-100 rounded ${selectedObject.underline ? "bg-gray-200" : ""}`}
                title="Underline"
              >
                <TextUnderline size={20} />
              </button>
            </div>
          )}

          {selectedObject && (
            <div className="flex items-center gap-1 border-r pr-2">
              <button
                onClick={() => alignObject("left")}
                className="p-2 hover:bg-gray-100 rounded"
                title="Align Left"
              >
                <TextAlignLeft size={20} />
              </button>
              <button
                onClick={() => alignObject("center")}
                className="p-2 hover:bg-gray-100 rounded"
                title="Align Center"
              >
                <TextAlignCenter size={20} />
              </button>
              <button
                onClick={() => alignObject("right")}
                className="p-2 hover:bg-gray-100 rounded"
                title="Align Right"
              >
                <TextAlignRight size={20} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 border-r pr-2">
            <button
              onClick={() => handleZoom(-10)}
              className="p-2 hover:bg-gray-100 rounded"
              title="Zoom Out"
            >
              <MagnifyingGlassMinus size={20} />
            </button>
            <span className="px-2 text-sm font-medium">{zoom}%</span>
            <button
              onClick={() => handleZoom(10)}
              className="p-2 hover:bg-gray-100 rounded"
              title="Zoom In"
            >
              <MagnifyingGlassPlus size={20} />
            </button>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={saveDesign}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <FloppyDisk size={18} />
              Save
            </button>
            <button
              onClick={() => exportCanvas("png")}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
            >
              <DownloadSimple size={18} />
              Export PNG
            </button>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="flex-1 bg-gray-200 p-8 overflow-auto flex items-center justify-center">
          <div className="bg-white shadow-lg">
            <canvas ref={canvasRef} />
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      {selectedObject && (
        <div className="w-64 bg-white border-l p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4">Properties</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Fill Color
              </label>
              <input
                type="color"
                value={selectedObject.fill || "#000000"}
                onChange={(e) => {
                  selectedObject.set("fill", e.target.value);
                  canvas.renderAll();
                  saveState();
                }}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Opacity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={selectedObject.opacity || 1}
                onChange={(e) => {
                  selectedObject.set("opacity", parseFloat(e.target.value));
                  canvas.renderAll();
                  saveState();
                }}
                className="w-full"
              />
            </div>

            {selectedObject.type === "textbox" && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Font Size
                </label>
                <input
                  type="number"
                  value={selectedObject.fontSize || 24}
                  onChange={(e) => {
                    selectedObject.set("fontSize", parseInt(e.target.value));
                    canvas.renderAll();
                    saveState();
                  }}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Rotation</label>
              <input
                type="range"
                min="0"
                max="360"
                value={selectedObject.angle || 0}
                onChange={(e) => {
                  selectedObject.set("angle", parseInt(e.target.value));
                  canvas.renderAll();
                  saveState();
                }}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
