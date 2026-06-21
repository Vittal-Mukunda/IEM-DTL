/**
 * Serialize a JSON-LD object for safe injection via dangerouslySetInnerHTML.
 *
 * The data here is fully static and author-controlled, so this is defense in
 * depth rather than a fix for a live hole: escaping `<` (and the U+2028 / U+2029
 * line/paragraph separators that can break inline scripts) guarantees the
 * payload can never close the surrounding <script> tag or trip a strict JSON
 * parser, even if future content happens to contain those characters.
 *
 * The separators are derived from char codes so this source file stays free of
 * invisible characters.
 */
const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data)
    .replaceAll("<", "\\u003c")
    .replaceAll(LINE_SEPARATOR, "\\u2028")
    .replaceAll(PARAGRAPH_SEPARATOR, "\\u2029");
}
