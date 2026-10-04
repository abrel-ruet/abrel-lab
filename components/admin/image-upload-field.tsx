"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X, FileUp, FileText } from "lucide-react";
import { uploadImageToCloudinary, uploadFileToCloudinary } from "@/lib/cloudinary";

/** Uploads to Cloudinary and stores the resulting URL. `kind="file"` accepts PDFs/docs/archives. */
export default function UploadField({
  value,
  onChange,
  label,
  kind = "image",
  accept,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
  kind?: "image" | "file";
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const url = kind === "image" ? await uploadImageToCloudinary(file) : await uploadFileToCloudinary(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? `Upload failed: ${err.message}` : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-ink-200 mb-2">{label}</label>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-xl bg-ink-900 border border-white/[0.08] flex items-center justify-center overflow-hidden shrink-0">
          {uploading ? (
            <Loader2 className="w-5 h-5 text-aqua-400 animate-spin" />
          ) : value && kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : value ? (
            <FileText className="w-7 h-7 text-aqua-300" />
          ) : kind === "image" ? (
            <ImagePlus className="w-6 h-6 text-ink-500" />
          ) : (
            <FileUp className="w-6 h-6 text-ink-500" />
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="btn-ghost !py-2 !px-4 !text-xs">
              {value ? "Replace" : "Upload"} {kind === "image" ? "image" : "file"}
            </button>
            {value && (
              <button type="button" onClick={() => onChange("")} className="p-2 rounded-lg text-ink-400 hover:text-red-300 transition-colors" aria-label="Remove">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {value && kind === "file" && (
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-xs text-aqua-300 truncate hover:underline">
              {value}
            </a>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept ?? (kind === "image" ? "image/*" : undefined)}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {error && <p className="text-xs text-red-300 mt-2">{error}</p>}
    </div>
  );
}
