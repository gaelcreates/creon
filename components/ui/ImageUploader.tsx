"use client";

import { useState, useRef } from "react";
import { uploadImage } from "@/lib/upload-actions";
import { cn } from "@/lib/cn";

type Props = {
  name: string;
  defaultValue?: string | null;
  aspect?: string;
  folder?: "events" | "articles" | "creators" | "misc";
  shape?: "rect" | "square" | "wide";
  hint?: string;
};

export function ImageUploader({
  name,
  defaultValue,
  aspect,
  folder = "misc",
  shape = "rect",
  hint,
}: Props) {
  const initial = defaultValue ?? "";
  const [url, setUrl] = useState<string>(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectStyle = aspect
    ? { aspectRatio: aspect }
    : shape === "square"
      ? { aspectRatio: "1/1" }
      : shape === "wide"
        ? { aspectRatio: "21/9" }
        : { aspectRatio: "4/3" };

  const previewWidth =
    shape === "square"
      ? "max-w-[200px]"
      : shape === "wide"
        ? "w-full max-w-2xl"
        : "w-full max-w-md";

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const newUrl = await uploadImage(fd);
      setUrl(newUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload échoué");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function clear() {
    setUrl("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      <div className={previewWidth}>
        {url ? (
          <div className="relative">
            <div
              className="border-2 border-noir bg-creme-fonce overflow-hidden"
              style={aspectStyle}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={clear}
              disabled={uploading}
              className="absolute top-2 right-2 w-8 h-8 border-2 border-noir bg-creme hover:bg-noir hover:text-creme transition-colors flex items-center justify-center font-body text-sm"
              aria-label="Retirer l'image"
              title="Retirer"
            >
              ✕
            </button>
          </div>
        ) : (
          <div
            className="border-2 border-dashed border-noir/40 bg-creme-fonce/30 flex items-center justify-center"
            style={aspectStyle}
          >
            <div className="text-center px-4">
              <p className="font-display text-3xl text-noir/30 mb-1">
                Aucune image
              </p>
              <p className="mono-meta text-noir-doux">
                JPG · PNG · WebP · 5 MB max
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "px-4 py-2 border-2 border-noir font-body text-xs uppercase tracking-wider transition-all",
            uploading
              ? "bg-creme-fonce text-noir-doux cursor-wait"
              : "bg-creme hover:bg-creme-fonce hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--color-noir)]",
          )}
        >
          {uploading ? "Upload…" : url ? "Remplacer" : "Choisir un fichier"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
          className="hidden"
        />
        {error && (
          <span className="font-body text-sm text-accent-deep border-2 border-noir bg-accent/30 px-2 py-1">
            {error}
          </span>
        )}
        {hint && !error && (
          <span className="mono-meta text-noir-doux">{hint}</span>
        )}
      </div>

      <input type="hidden" name={name} value={url} />
    </div>
  );
}
