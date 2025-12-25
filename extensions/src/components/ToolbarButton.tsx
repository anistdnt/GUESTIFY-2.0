export const ToolbarButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) => (
  <button
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={`
        px-3 py-1 text-sm rounded
        transition cursor-pointer
        ${active ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-200"}
      `}
  >
    {label}
  </button>
);
