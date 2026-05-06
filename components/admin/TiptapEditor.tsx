"use client";

import { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import { cn } from "@/lib/cn";

type Props = {
  name: string;
  htmlName?: string;
  initialJSON?: object | null;
  initialHTML?: string | null;
  placeholder?: string;
};

export function TiptapEditor({
  name,
  htmlName,
  initialJSON,
  initialHTML,
  placeholder = "Commence à écrire ton article…",
}: Props) {
  const [json, setJson] = useState<string>(
    initialJSON ? JSON.stringify(initialJSON) : "",
  );
  const [html, setHtml] = useState<string>(initialHTML ?? "");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        protocols: ["http", "https", "mailto"],
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Youtube.configure({
        nocookie: true,
        controls: true,
        modestBranding: true,
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: initialJSON ?? initialHTML ?? "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setJson(JSON.stringify(editor.getJSON()));
      setHtml(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && !json) {
      setJson(JSON.stringify(editor.getJSON()));
      setHtml(editor.getHTML());
    }
  }, [editor, json]);

  if (!editor) {
    return (
      <div className="border-2 border-noir bg-creme p-6 text-noir-doux mono-meta">
        Chargement de l&apos;éditeur…
      </div>
    );
  }

  return (
    <div className="border-2 border-noir bg-creme">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="px-6 py-5 min-h-[400px]" />
      <input type="hidden" name={name} value={json} />
      {htmlName && <input type="hidden" name={htmlName} value={html} />}
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const promptLink = useCallback(() => {
    const previous = editor.getAttributes("link").href;
    const url = window.prompt("URL du lien", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const promptImage = useCallback(() => {
    const url = window.prompt(
      "URL de l'image (utilise un /assets/... ou une URL publique)",
      "/assets/",
    );
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const promptYoutube = useCallback(() => {
    const url = window.prompt(
      "URL YouTube (vidéo publique, https://www.youtube.com/watch?v=...)",
      "",
    );
    if (!url) return;
    editor.commands.setYoutubeVideo({ src: url, width: 640, height: 360 });
  }, [editor]);

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b-2 border-noir bg-creme-fonce">
      <BtnGroup>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          label="Titre H2"
        >
          <span className="font-display text-base">H2</span>
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          label="Titre H3"
        >
          <span className="font-display text-sm">H3</span>
        </ToolBtn>
      </BtnGroup>

      <BtnGroup>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          label="Gras"
        >
          <strong>B</strong>
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          label="Italique"
        >
          <em>I</em>
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          label="Souligné"
        >
          <u>U</u>
        </ToolBtn>
      </BtnGroup>

      <BtnGroup>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          label="Liste à puces"
        >
          •
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          label="Liste numérotée"
        >
          1.
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          label="Citation"
        >
          &ldquo;
        </ToolBtn>
      </BtnGroup>

      <BtnGroup>
        <ToolBtn onClick={promptLink} active={editor.isActive("link")} label="Lien">
          🔗
        </ToolBtn>
        <ToolBtn onClick={promptImage} label="Image">
          🖼
        </ToolBtn>
        <ToolBtn onClick={promptYoutube} label="YouTube">
          ▶
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          label="Séparateur"
        >
          —
        </ToolBtn>
      </BtnGroup>

      <BtnGroup>
        <ToolBtn
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          label="Annuler"
        >
          ↶
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          label="Rétablir"
        >
          ↷
        </ToolBtn>
      </BtnGroup>
    </div>
  );
}

function BtnGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex border-2 border-noir bg-creme">{children}</div>
  );
}

function ToolBtn({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={cn(
        "min-w-[36px] h-9 px-2 font-body text-sm flex items-center justify-center border-r-2 border-noir last:border-0 transition-colors",
        active && "bg-accent text-noir",
        !active && "hover:bg-creme-fonce",
        disabled && "opacity-30 cursor-not-allowed hover:bg-transparent",
      )}
    >
      {children}
    </button>
  );
}
