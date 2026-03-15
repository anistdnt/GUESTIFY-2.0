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
  TextStrikethroughIcon,
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

import { Extension } from "@tiptap/core";
import Strikethrough from "@tiptap/extension-strike";

// Custom Font Size Extension
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: (fontSize) => ({ chain }) => (chain() as any).setMark("textStyle", { fontSize }).run(),
      unsetFontSize: () => ({ chain }) => (chain() as any).setMark("textStyle", { fontSize: null }).run(),
    };
  },
} as any);

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
  { label: "32px", value: "32px" },
  { label: "48px", value: "48px" },
];

type Props = {
  html: string | Promise<string>;
  onChange: (html: string) => void;
  handleDone: () => void;
  handleDiscard: () => void;
  output: string;
  draftOutput: string;
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
  draftOutput,
  output,
}: Props) {
  const [, forceUpdate] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Strikethrough,
      TextStyle,
      FontFamily,
      FontSize,
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
    if (editor && draftOutput === output) {
      const currentHtml = typeof html === 'string' ? html : "";
      // Only set content if it's different to avoid cursor reset bugs
      if (editor.getHTML() !== currentHtml) {
        editor.commands.setContent(currentHtml, { emitUpdate: false });
      }
    }
  }, [draftOutput, output, editor, html]);

  if (!editor) return null;

  return (
    <div className="agreement-editor-container">
      {/* Premium Multi-Row Toolbar (Sticky Top) */}
      <div className="agreement-editor-toolbar">
        
        {/* ROW 1: Typography Groups & Global Actions */}
        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 pr-3 mr-1">Typography</span>
            <div className="relative group">
              <select 
                className="appearance-none bg-transparent rounded-xl px-2 py-1.5 text-[11px] font-bold text-slate-700 outline-none hover:text-violet-600 transition-all pr-6 min-w-[140px]"
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
              <CaretDownIcon className="absolute right-1 top-2 text-slate-400 pointer-events-none" size={12} weight="bold" />
            </div>

            <div className="w-px h-4 bg-slate-200 mx-2" />

            <div className="relative group">
              <select 
                className="appearance-none bg-transparent rounded-xl px-2 py-1.5 text-[11px] font-bold text-slate-700 outline-none hover:text-violet-600 transition-all pr-6 min-w-[70px]"
                value={editor.getAttributes('textStyle').fontSize || "18px"}
                onChange={(e) => (editor.chain() as any).focus().setFontSize(e.target.value).run()}
              >
                {FONT_SIZES.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
              <CaretDownIcon className="absolute right-1 top-2 text-slate-400 pointer-events-none" size={12} weight="bold" />
            </div>
          </div>

          <div className="h-px flex-1 bg-slate-200/20" />
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDiscard()}
              disabled={output === draftOutput}
              className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2rem] text-slate-400 hover:text-red-500 rounded-xl transition-all disabled:opacity-20"
            >
              <ArrowCounterClockwiseIcon size={16} weight="bold" />
              <span>Discard</span>
            </button>
            
            <button
              onClick={() => handleDone()}
              className="flex items-center gap-2 px-6 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 shadow-lg shadow-violet-900/20 transition-all text-[10px] font-bold uppercase tracking-[0.2rem]"
            >
              <CheckCircleIcon size={16} weight="bold" />
              <span>Finalize</span>
            </button>
          </div>
        </div>

        {/* ROW 2: Formatting Tools & Alignment */}
        <div className="flex items-center gap-1 w-full pt-1 border-t border-slate-100/50">
          
          {/* TEXT MARKS */}
          <div className="flex items-center bg-slate-50/50 rounded-xl p-0.5 border border-slate-100/50">
            <ToolbarButton icon={TextBolderIcon} active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} />
            <ToolbarButton icon={TextItalicIcon} active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} />
            <ToolbarButton icon={TextUnderlineIcon} active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} />
            <ToolbarButton icon={TextStrikethroughIcon} active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} />
            <ToolbarButton icon={PaletteIcon} active={editor.isActive("highlight")} onClick={() => editor.chain().focus().toggleHighlight().run()} />
          </div>

          <div className="w-px h-6 bg-slate-200/50 mx-2" />

          {/* HEADINGS */}
          <div className="flex items-center gap-1">
            <ToolbarButton icon={TextHOneIcon} active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} />
            <ToolbarButton icon={TextHTwoIcon} active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
            <ToolbarButton icon={TextHThreeIcon} active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
          </div>

          <div className="w-px h-6 bg-slate-200/50 mx-2" />

          {/* LISTS */}
          <div className="flex items-center gap-1">
            <ToolbarButton icon={ListBulletsIcon} active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} />
          </div>

          <div className="w-px h-6 bg-slate-200/50 mx-2" />

          {/* ALIGNMENT */}
          <div className="flex items-center bg-slate-50/50 rounded-xl p-0.5 border border-slate-100/50">
            <ToolbarButton icon={TextAlignLeftIcon} active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} />
            <ToolbarButton icon={TextAlignCenterIcon} active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} />
            <ToolbarButton icon={TextAlignRightIcon} active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} />
            <ToolbarButton icon={TextAlignJustifyIcon} active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()} />
          </div>
        </div>
      </div>

      <div className="agreement-editor-paper mx-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
