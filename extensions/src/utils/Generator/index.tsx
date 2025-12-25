export function transformSelection(
  editor: any,
  transformer: (text: string) => string
) {
  const { from, to } = editor.state.selection;
  if (from === to) return;

  const text = editor.state.doc.textBetween(from, to);

  editor.chain().focus().insertContentAt({ from, to }, transformer(text)).run();
}

export const FONT_SIZES = [
  { label: "S", size: "14px" },
  { label: "M", size: "16px" },
  { label: "L", size: "18px" },
  { label: "XL", size: "20px" },
];
