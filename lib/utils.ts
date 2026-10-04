export function formatDate(
  value?: string,
  opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" }
) {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString("en-US", opts);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Strip HTML produced by the rich text editor so it can be shown as a plain excerpt. */
export function stripHtml(html?: string) {
  return (html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Content may be plain text or HTML (from the editor); wrap plain text in paragraphs. */
export function toHtml(content?: string) {
  if (!content) return "";
  if (/<\/?[a-z][\s\S]*>/i.test(content)) return content;
  return content
    .split(/\n{2,}/)
    .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");
}

export function initials(name: string) {
  return name
    .replace(/^((Prof|Dr|Md|Mr|Ms|Mrs)\.\s*)+/gi, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
