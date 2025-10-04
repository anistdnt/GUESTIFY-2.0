// Container for uploaded images - fixed square box
export const uploadedCell =
  "w-32 h-32 relative border rounded overflow-hidden flex items-center justify-center backdrop-blur-md bg-white/40 border border-gray-200 shadow-md";

// Blank upload cell - same fixed square
export const uploadCellBlank =
  "w-32 h-32 border-2 border-dashed rounded flex justify-center items-center text-gray-400 backdrop-blur-sm bg-white/40 border border-gray-200 shadow-md";

// General upload cell (kept for flexibility)
export const uploadCell =
  "w-32 h-32 border rounded flex justify-center items-center";

// Image wrapper
export const uploadImageWrapper = "absolute inset-0 flex items-center justify-center";

// Action buttons grouped in corner
export const imageActions =
  "absolute top-2 right-2 flex gap-1 z-10";

// Button style
export const imageActionsBtn =
  "p-1 bg-white rounded shadow hover:bg-gray-100 flex items-center justify-center";

// Optional hover overlay
export const actionBlock =
  "absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300";