"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import Underline from "@tiptap/extension-underline";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import { ToolbarButton } from "./ToolbarButton";
import { FONT_SIZES, transformSelection } from "@/utils/Generator";
import { ArrowCounterClockwiseIcon, CheckCircleIcon } from "@phosphor-icons/react";

type Props = {
  html: string | Promise<string>;
  onChange: (html: string) => void;
  handleDone: () => void;
  handleDiscard: () => void;
  output: string;
  draftOuput: string;
};

export default function AgreementEditor({
  html,
  onChange,
  handleDiscard,
  handleDone,
  draftOuput,
  output
}: Props) {
  const [, forceUpdate] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      TextStyle,
      FontSize.configure({
        types: ["textStyle"],
      }),
    ],
    content: html,
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

  /* Update toolbar on cursor movement */
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

  if (!editor) return null;

  return (
    <div className="editor-wrapper">
      {/* Toolbar */}
      <div className="editor-toolbar">
        <ToolbarButton
          label="B"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />

        <ToolbarButton
          label="I"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />

        <ToolbarButton
          label="U"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />

        <ToolbarButton
          label="H1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        />

        <ToolbarButton
          label="H2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        />

        <ToolbarButton
          label="H3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        />

        <div className="mx-2 h-5 w-px bg-zinc-300" />

        {FONT_SIZES.map(({ label, size }) => (
          <ToolbarButton
            key={size}
            label={label}
            active={editor.isActive("textStyle", { fontSize: size })}
            onClick={() => editor.chain().focus().setFontSize(size).run()}
          />
        ))}

        <ToolbarButton
          label="• List"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />

        <ToolbarButton
          label="AA"
          onClick={() =>
            transformSelection(editor, (text) => text.toUpperCase())
          }
        />

        <ToolbarButton
          label="aa"
          onClick={() =>
            transformSelection(editor, (text) => text.toLowerCase())
          }
        />

        <ToolbarButton
          label="Page Break"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertContent('<div class="page-break"></div>')
              .run()
          }
        />

        <div className="mx-2 h-5 w-px bg-zinc-300" />

        <div className="flex gap-2">
          <button
            onClick={() => handleDone()}
            className="border bg-green-700 hover:bg-green-800 text-white px-2 py-1 rounded-md flex justify-center items-center gap-1 text-sm"
          >
            <span><CheckCircleIcon size={15} weight="fill" /></span>
            <span>Done</span>
          </button>

          <button
            onClick={() => handleDiscard()}
            className="border bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 flex justify-center items-center gap-1 text-sm"
            disabled={output === draftOuput}
          >
            <span><ArrowCounterClockwiseIcon size={15} weight="fill" /></span>
            <span>Discard Changes</span>
          </button>
        </div>
      </div>

      {/* Document */}
      <div className="editor-paper">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
