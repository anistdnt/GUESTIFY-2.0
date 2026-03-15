"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { 
  ArrowCounterClockwiseIcon, 
  CheckCircleIcon, 
  TextBolderIcon, 
  TextItalicIcon, 
  TextUnderlineIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyIcon,
  TextHOneIcon,
  TextHTwoIcon,
  TextHThreeIcon,
  ListBulletsIcon,
  PaletteIcon,
  CaretDownIcon
} from "@phosphor-icons/react";

const FONT_FAMILIES = [
  { label: "EB Garamond", value: "var(--font-eb-garamond)" },
  { label: "Inter", value: "Inter" },
  { label: "Outfit", value: "var(--font-outfit)" },
  { label: "Montserrat", value: "Montserrat" },
  { label: "Playfair Display", value: "Playfair Display" },
];

const FONT_SIZES = [
  { label: "12px", value: "12px" },
  { label: "14px", value: "14px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "20px", value: "20px" },
  { label: "24px", value: "24px" },
];

type Props = {
  html: string | Promise<string>;
  onChange: (html: string) => void;
  handleDone: () => void;
  handleDiscard: () => void;
  output: string;
  draftOuput: string;
};

const ToolbarButton = ({ 
  icon: Icon, 
  onClick, 
  active, 
  disabled 
}: { 
  icon: any, 
  onClick: () => void, 
  active?: boolean, 
  disabled?: boolean 
}) => (
  <button
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    disabled={disabled}
    className={`p-2 rounded-lg transition-all ${active ? "bg-violet-100 text-violet-600 shadow-sm" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"} disabled:opacity-30`}
  >
    <Icon size={18} weight={active ? "bold" : "regular"} />
  </button>
);

export default function AgreementEditor({
  html,
  onChange,
  handleDiscard,
  handleDone,
  draftOuput,
  output,
}: Props) {
  const [, forceUpdate] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: typeof html === 'string' ? html : "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "agreement-editor",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const update = () => forceUpdate((v) => v + 1);
    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  useEffect(() => {
    if (editor && draftOuput === output) {
      const currentHtml = typeof html === 'string' ? html : "";
      // Only set content if it's different to avoid cursor reset bugs
      if (editor.getHTML() !== currentHtml) {
        editor.commands.setContent(currentHtml, { emitUpdate: false });
      }
    }
  }, [draftOuput, output, editor, html]);

  if (!editor) return null;

  return (
    <div className="editor-wrapper">
      {/* Premium Toolbar */}
      <div className="editor-toolbar shadow-2xl shadow-slate-200 border border-slate-200 backdrop-blur-xl bg-white/95 sticky top-4 mb-10 p-2 rounded-2xl flex items-center gap-2 flex-wrap max-w-[900px]">
        
        {/* FONT FAMILY */}
        <div className="flex items-center gap-1.5 px-2 border-r border-slate-200 mr-1">
          <div className="relative group">
            <select 
              className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[11px] font-bold text-slate-700 outline-none hover:border-violet-300 transition-all pr-8 min-w-[140px]"
              value={editor.getAttributes('textStyle').fontFamily || "var(--font-eb-garamond)"}
              onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
            >
              <optgroup label="Serif (Formal)">
                {FONT_FAMILIES.filter(f => f.label === "EB Garamond" || f.label === "Playfair Display").map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </optgroup>
              <optgroup label="Sans Serif (Modern)">
                {FONT_FAMILIES.filter(f => f.label !== "EB Garamond" && f.label !== "Playfair Display").map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </optgroup>
            </select>
            <CaretDownIcon className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={12} weight="bold" />
          </div>
        </div>

        {/* BASIC MARKS */}
        <div className="flex items-center gap-0.5 px-2 border-r border-slate-200">
          <ToolbarButton icon={TextBolderIcon} active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} />
          <ToolbarButton icon={TextItalicIcon} active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} />
          <ToolbarButton icon={TextUnderlineIcon} active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} />
        </div>

        {/* HEADINGS & LISTS */}
        <div className="flex items-center gap-0.5 px-2 border-r border-slate-200">
          <ToolbarButton icon={TextHOneIcon} active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} />
          <ToolbarButton icon={TextHTwoIcon} active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
          <ToolbarButton icon={ListBulletsIcon} active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} />
        </div>

        {/* ALIGNMENT */}
        <div className="flex items-center gap-0.5 px-2 border-r border-slate-200">
          <ToolbarButton icon={TextAlignLeftIcon} active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} />
          <ToolbarButton icon={TextAlignCenterIcon} active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} />
          <ToolbarButton icon={TextAlignRightIcon} active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} />
          <ToolbarButton icon={TextAlignJustifyIcon} active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()} />
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3 pl-4 pr-1 ml-auto">
          <button
            onClick={() => handleDiscard()}
            disabled={output === draftOuput}
            className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-red-500 rounded-xl transition-all disabled:opacity-20"
          >
            <ArrowCounterClockwiseIcon size={16} weight="bold" />
            <span>Discard</span>
          </button>
          
          <button
            onClick={() => handleDone()}
            className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 shadow-lg shadow-violet-900/20 transition-all text-[10px] font-bold uppercase tracking-[0.2em]"
          >
            <CheckCircleIcon size={16} weight="bold" />
            <span>Finalize</span>
          </button>
        </div>
      </div>

      <div className="editor-paper mx-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
