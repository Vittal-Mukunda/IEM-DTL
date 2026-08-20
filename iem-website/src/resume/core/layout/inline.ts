/**
 * Inline flow — turning a sequence of styled fragments into positioned lines.
 *
 * A row like Yale's
 *
 *     **Employer,** *Your Title*, City, State          →tab      Dates
 *
 * is four fragments in three different styles that must wrap as one paragraph,
 * while `Dates` is pinned to a tab stop and never participates in the wrap.
 * This module handles the wrapping half; `block.ts` handles the pinning.
 */

import type { FontBook } from "../fonts";
import type { TextRole, TextStyle } from "../schema";
import type { LineBox, PositionedRun, TextPiece } from "./types";

export interface Fragment {
  text: string;
  style: TextStyle;
  color: string;
  href?: string;
  role: TextRole;
}

interface Token {
  text: string;
  style: TextStyle;
  color: string;
  href?: string;
  role: TextRole;
  width: number;
  /** Trailing whitespace collapses at a line break. */
  space: boolean;
}

/**
 * Splits fragments into whitespace-delimited tokens, keeping each token's
 * style. Interior spaces become their own tokens so a break can drop them.
 */
function tokenize(book: FontBook, fragments: Fragment[]): Token[] {
  const tokens: Token[] = [];
  for (const frag of fragments) {
    if (!frag.text) continue;
    for (const part of frag.text.split(/(\s+)/)) {
      if (!part) continue;
      const space = /^\s+$/.test(part);
      // Whitespace runs keep their real width — "honors.  SAT" in the Harvard
      // sample is two spaces, and collapsing them would shift the rest of the
      // line. They still break like a single space.
      const text = space ? part.replace(/[\t\n\r]/g, " ") : part;
      tokens.push({
        text,
        style: frag.style,
        color: frag.color,
        href: frag.href,
        role: frag.role,
        width: book.measure(text, frag.style),
        space,
      });
    }
  }
  return tokens;
}

/**
 * Break a token that is wider than the measure, character by character.
 * Without this, a pasted URL or an unhyphenated German compound runs off the
 * page — FontBook.wrap already did this for paragraph cells; flowing rows did not.
 */
function splitToken(book: FontBook, token: Token, maxWidth: number): Token[] {
  if (token.width <= maxWidth || maxWidth <= 0) return [token];
  const chunks: Token[] = [];
  let chunk = "";
  for (const ch of token.text) {
    const next = chunk + ch;
    if (chunk && book.measure(next, token.style) > maxWidth) {
      chunks.push({ ...token, text: chunk, width: book.measure(chunk, token.style) });
      chunk = ch;
    } else {
      chunk = next;
    }
  }
  if (chunk) chunks.push({ ...token, text: chunk, width: book.measure(chunk, token.style) });
  return chunks.length ? chunks : [token];
}

function buildPiece(book: FontBook, tokens: Token[], x: number): TextPiece {
  const style = tokens[0].style;
  const runs: PositionedRun[] = [];
  let dx = 0;
  for (const token of tokens) {
    for (const run of book.shape(token.text, token.style)) {
      runs.push({ ...run, dx });
      dx += run.width;
    }
  }
  return {
    x,
    width: dx,
    runs,
    style,
    role: tokens[0].role,
    color: tokens[0].color,
    href: tokens[0].href,
  };
}

/** Consecutive tokens sharing style+colour+href become one piece. */
function assemble(book: FontBook, tokens: Token[], startX: number): TextPiece[] {
  const pieces: TextPiece[] = [];
  let group: Token[] = [];
  let x = startX;

  const flush = () => {
    if (!group.length) return;
    const piece = buildPiece(book, group, x);
    pieces.push(piece);
    x += piece.width;
    group = [];
  };

  for (const token of tokens) {
    const prev = group[group.length - 1];
    if (prev && (prev.style !== token.style || prev.color !== token.color || prev.href !== token.href)) {
      flush();
    }
    group.push(token);
  }
  flush();
  return pieces;
}

export interface FlowOptions {
  /** Usable width of the first line — usually shortened by a tab stop. */
  firstWidth: number;
  /** Usable width of every line after the first. */
  restWidth: number;
  /** Left inset applied to lines after the first (hanging indent). */
  restIndent?: number;
  startX: number;
  leadingRatio: number;
  /** Force everything onto one line, even if it overruns. */
  noWrap?: boolean;
}

/**
 * Greedy line breaking. This is what Word does, and it agrees with LaTeX's
 * paragraph breaker on every résumé fixture we test — single-column prose in a
 * narrow measure rarely gives the Knuth-Plass algorithm anything to improve.
 */
export function flowInline(
  book: FontBook,
  fragments: Fragment[],
  opts: FlowOptions,
): LineBox[] {
  const tokens = tokenize(book, fragments);
  if (!tokens.length) return [];

  const lines: Token[][] = [];
  let current: Token[] = [];
  let width = 0;
  let lineIndex = 0;

  const limitFor = (i: number) => (i === 0 ? opts.firstWidth : opts.restWidth);

  if (opts.noWrap) {
    lines.push(tokens);
  } else {
    for (const token of tokens) {
      // A space at the start of a line is dropped rather than indenting it.
      if (token.space && current.length === 0) continue;

      const tooWide = !token.space && token.width > limitFor(lineIndex);
      if (tooWide) {
        if (current.length) {
          while (current.length && current[current.length - 1].space) {
            width -= current.pop()!.width;
          }
          lines.push(current);
          lineIndex += 1;
          current = [];
          width = 0;
        }
        const chunks = splitToken(book, token, limitFor(lineIndex));
        for (let i = 0; i < chunks.length; i += 1) {
          if (i > 0) {
            lines.push(current);
            lineIndex += 1;
            current = [];
          }
          current = [chunks[i]];
          width = chunks[i].width;
        }
        continue;
      }

      const next = width + token.width;
      if (current.length && next > limitFor(lineIndex)) {
        // Trailing spaces do not push a line over its measure.
        while (current.length && current[current.length - 1].space) {
          width -= current.pop()!.width;
        }
        lines.push(current);
        lineIndex += 1;
        current = token.space ? [] : [token];
        width = token.space ? 0 : token.width;
        continue;
      }
      current.push(token);
      width = next;
    }
    if (current.length) lines.push(current);
  }

  return lines.map((lineTokens, i) => {
    const x = opts.startX + (i > 0 ? (opts.restIndent ?? 0) : 0);
    const pieces = assemble(book, lineTokens, x);
    let ascent = 0;
    let height = 0;
    const last = i === lines.length - 1;
    for (const piece of pieces) {
      ascent = Math.max(ascent, book.ascentOf(piece.style));
      const leading = book.lineHeight(piece.style, opts.leadingRatio);
      // Display-size names declare a tight leading meant for the gap to the
      // *next row* (contact), not to another line of the same name. Wrapped
      // continuation lines must clear the glyph box or they sit on top of
      // each other.
      height = Math.max(height, last ? leading : Math.max(leading, piece.style.size));
    }
    return { ascent, height, pieces };
  });
}

/** Total advance of a fragment list, ignoring wrapping. */
export function measureFragments(book: FontBook, fragments: Fragment[]): number {
  return fragments.reduce((sum, f) => sum + book.measure(f.text, f.style), 0);
}

/** One unwrapped line, used for pinned cells (dates, locations). */
export function singleLine(
  book: FontBook,
  fragments: Fragment[],
  x: number,
  leadingRatio: number,
): LineBox | null {
  const tokens = tokenize(book, fragments);
  if (!tokens.length) return null;
  const pieces = assemble(book, tokens, x);
  let ascent = 0;
  let height = 0;
  for (const piece of pieces) {
    ascent = Math.max(ascent, book.ascentOf(piece.style));
    height = Math.max(height, book.lineHeight(piece.style, leadingRatio));
  }
  return { ascent, height, pieces };
}
