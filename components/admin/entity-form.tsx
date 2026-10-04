"use client";

import { useState, type FormEvent } from "react";
import dynamic from "next/dynamic";
import { X, Loader2, Wand2 } from "lucide-react";
import UploadField from "./image-upload-field";
import { slugify } from "@/lib/utils";

const RichTextEditor = dynamic(() => import("./rich-text-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-56 bg-ink-900 rounded-xl border border-white/[0.08] animate-pulse flex items-center justify-center text-sm text-ink-400">
      Loading editor...
    </div>
  ),
});

export type FieldType = "text" | "textarea" | "richtext" | "number" | "date" | "month" | "select" | "checkbox" | "tags" | "image" | "file";

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string }[];
  required?: boolean;
  placeholder?: string;
  rows?: number;
  helpText?: string;
  /** For `text` slug fields: the key whose value can be slugified via the wand button. */
  slugFrom?: string;
  /** Render at half width on larger screens. */
  half?: boolean;
}

type RawRecord = Record<string, unknown>;

function toFormValue(field: FieldConfig, raw: RawRecord): unknown {
  const v = raw[field.key];
  if (field.type === "tags") return Array.isArray(v) ? v.join(", ") : "";
  if (field.type === "number") return v === undefined || v === null ? "" : String(v);
  if (field.type === "checkbox") return Boolean(v);
  return v ?? "";
}

function serializeValues(fields: FieldConfig[], state: RawRecord): RawRecord {
  const out: RawRecord = {};
  for (const f of fields) {
    const v = state[f.key];
    if (f.type === "tags") {
      out[f.key] = String(v ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (f.type === "number") {
      out[f.key] = v === "" || v === undefined ? null : Number(v);
    } else if (f.type === "checkbox") {
      out[f.key] = Boolean(v);
    } else {
      out[f.key] = typeof v === "string" ? v.trim() : v ?? "";
    }
  }
  return out;
}

function FormBody({
  title,
  fields,
  initialValues,
  onClose,
  onSubmit,
}: {
  title: string;
  fields: FieldConfig[];
  initialValues: object;
  onClose: () => void;
  onSubmit: (values: RawRecord) => Promise<void>;
}) {
  const [state, setState] = useState<RawRecord>(() => {
    const s: RawRecord = {};
    for (const f of fields) s[f.key] = toFormValue(f, initialValues as RawRecord);
    return s;
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = (key: string, value: unknown) => setState((s) => ({ ...s, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await onSubmit(serializeValues(fields, state));
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl my-8">
        <form onSubmit={handleSubmit} className="glass-card !bg-ink-900 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button type="button" onClick={onClose} className="text-ink-400 hover:text-white transition-colors" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-5 max-h-[68vh] overflow-y-auto">
            {fields.map((field) => {
              const val = String(state[field.key] ?? "");
              return (
                <div key={field.key} className={field.half ? "" : "sm:col-span-2"}>
                  {!["checkbox", "image", "file"].includes(field.type) && (
                    <label className="block text-sm font-medium text-ink-200 mb-2">
                      {field.label}
                      {field.required && <span className="text-leaf-400 ml-1">*</span>}
                    </label>
                  )}

                  {(field.type === "text" || field.type === "tags") && (
                    <div className="relative">
                      <input
                        type="text"
                        required={field.required}
                        value={val}
                        onChange={(e) => update(field.key, e.target.value)}
                        placeholder={field.placeholder || (field.type === "tags" ? "Comma-separated values" : undefined)}
                        className={`input-field ${field.slugFrom ? "!pr-11" : ""}`}
                      />
                      {field.slugFrom && (
                        <button
                          type="button"
                          title="Generate from title"
                          onClick={() => update(field.key, slugify(String(state[field.slugFrom!] ?? "")))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-ink-400 hover:text-aqua-300 hover:bg-aqua-400/10"
                        >
                          <Wand2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}

                  {(field.type === "number" || field.type === "date" || field.type === "month") && (
                    <input
                      type={field.type}
                      required={field.required}
                      value={val}
                      onChange={(e) => update(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="input-field [color-scheme:dark]"
                    />
                  )}

                  {field.type === "textarea" && (
                    <textarea
                      required={field.required}
                      rows={field.rows || 4}
                      value={val}
                      onChange={(e) => update(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="input-field resize-y"
                    />
                  )}

                  {field.type === "richtext" && (
                    <RichTextEditor value={val} onChange={(v) => update(field.key, v)} placeholder={field.placeholder} />
                  )}

                  {field.type === "select" && (
                    <select
                      required={field.required}
                      value={val}
                      onChange={(e) => update(field.key, e.target.value)}
                      className="input-field cursor-pointer"
                    >
                      <option value="">Select...</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  )}

                  {field.type === "checkbox" && (
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={Boolean(state[field.key])}
                        onChange={(e) => update(field.key, e.target.checked)}
                        className="w-4 h-4 rounded accent-aqua-400"
                      />
                      <span className="text-sm text-ink-200">{field.label}</span>
                    </label>
                  )}

                  {(field.type === "image" || field.type === "file") && (
                    <UploadField label={field.label} kind={field.type} value={val} onChange={(url) => update(field.key, url)} />
                  )}

                  {field.helpText && <p className="text-xs text-ink-500 mt-1.5">{field.helpText}</p>}
                </div>
              );
            })}
          </div>

          {error && <p className="px-6 text-sm text-red-300 pb-2">{error}</p>}

          <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-white/[0.06]">
            <button type="button" onClick={onClose} className="btn-ghost !py-2.5">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary !py-2.5 !px-6">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/** Modal form generated from a field config. Remounts on every open so state always starts fresh. */
export default function EntityFormModal(props: {
  open: boolean;
  title: string;
  fields: FieldConfig[];
  initialValues: object;
  onClose: () => void;
  onSubmit: (values: RawRecord) => Promise<void>;
}) {
  if (!props.open) return null;
  return <FormBody {...props} />;
}
