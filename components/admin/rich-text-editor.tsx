"use client";

import { useEffect, useRef, memo } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const onChangeRef = useRef(onChange);
  const initialValue = useRef(value);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const host = containerRef.current;
    if (!host || quillRef.current) return;

    // Quill injects its toolbar as a sibling, so mount into a child we own and clean up fully.
    const editorEl = document.createElement("div");
    host.appendChild(editorEl);

    const quill = new Quill(editorEl, {
      theme: "snow",
      placeholder,
      modules: {
        toolbar: [
          [{ header: [2, 3, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "clean"],
        ],
      },
    });
    if (initialValue.current) quill.clipboard.dangerouslyPasteHTML(initialValue.current);

    quill.on("text-change", () => {
      const html = quill.root.innerHTML;
      onChangeRef.current(html === "<p><br></p>" ? "" : html);
    });
    quillRef.current = quill;

    return () => {
      quillRef.current = null;
      host.innerHTML = "";
    };
  }, [placeholder]);

  return <div ref={containerRef} />;
}

export default memo(RichTextEditor);
