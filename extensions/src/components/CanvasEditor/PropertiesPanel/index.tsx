import { Canvas } from "fabric";

export default function PropertiesPanel({
  canvas,
  selectedObject,
}: {
  canvas: Canvas | null;
  selectedObject: any;
}) {
  if (!selectedObject) return null;

  return (
    <div className="w-64 border-l bg-white p-4">
      <label>Opacity</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={selectedObject.opacity ?? 1}
        onChange={e => {
          selectedObject.set("opacity", Number(e.target.value));
          canvas?.requestRenderAll();
        }}
      />
    </div>
  );
}
