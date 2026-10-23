// Word-by-word captions: spoken words go grey, the current word is bold and
// bright, [keywords] get a Figma-style selection box with corner handles.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { sans } from "../fonts";
import { progress } from "../lib/anim";
import type { Beat, Mode, Word } from "../lib/timing";
import { beatIndexAt, msToFrame } from "../lib/timing";
import { accent, pal, type as T, zones } from "../theme";

type Page = { first: number; last: number; startMs: number; endMs: number };

const MAX_WORDS = 7;
const MAX_CHARS = 40; // ~2 lines at 78px inside 960px
// Words that read badly when stranded at the end of a page ("…reads your").
const WEAK = /^(a|an|the|your|my|our|their|its|to|of|and|or|but|for|with|in|on|at|by|is|are|so|that|this|each|every|no)$/i;

// A page ends at a beat change, an explicit break (punctuation), or when full.
export const buildPages = (words: Word[], tailMs = 1500): Page[] => {
  const pages: Page[] = [];
  let first = 0;
  let chars = 0;
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    chars += w.text.length + 1;
    const next = words[i + 1];
    const hardBreak = !next || w.pageBreakAfter || next.beat !== w.beat;
    const full = !hardBreak && (i - first + 1 >= MAX_WORDS || chars + next.text.length > MAX_CHARS);
    if (hardBreak || full) {
      let last = i;
      if (full && last > first && WEAK.test(words[last].text)) last--;
      pages.push({ first, last, startMs: words[first].startMs, endMs: 0 });
      first = last + 1;
      chars = 0;
      for (let k = first; k <= i; k++) chars += words[k].text.length + 1;
    }
  }
  pages.forEach((p, i) => {
    const next = pages[i + 1];
    p.endMs = next ? next.startMs : words[p.last].endMs + tailMs;
  });
  return pages;
};

export const SelectionBox: React.FC<{ mode: Mode; startFrame: number }> = ({ mode, startFrame }) => {
  const frame = useCurrentFrame();
  const p = pal(mode);
  const draw = progress(frame, startFrame, 5);
  const pop = progress(frame, startFrame + 3, 6);
  const handle = (pos: React.CSSProperties) => (
    <div
      style={{
        position: "absolute",
        width: 22,
        height: 22,
        borderRadius: 11,
        boxSizing: "border-box",
        background: accent.select,
        border: `3px solid ${p.handleRing}`,
        scale: String(pop),
        ...pos,
      }}
    />
  );
  return (
    <div style={{ position: "absolute", left: -12, right: -12, top: 8, bottom: 2 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `3px solid ${accent.select}`,
          background: p.selectFill,
          transformOrigin: "left center",
          scale: `${draw} 1`,
        }}
      />
      {handle({ left: -11, top: -11 })}
      {handle({ right: -11, bottom: -11 })}
    </div>
  );
};

export const KineticCaptions: React.FC<{ words: Word[]; beats: Beat[] }> = ({ words, beats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pages = React.useMemo(() => buildPages(words), [words]);
  const ms = (frame / fps) * 1000;
  const page = pages.find((pg) => pg.startMs <= ms && ms < pg.endMs);
  if (!page) return null;

  const mode = beats[beatIndexAt(beats, ms)].mode;
  const p = pal(mode);
  const visible: number[] = [];
  for (let i = page.first; i <= page.last; i++) if (words[i].startMs <= ms) visible.push(i);
  const current = visible[visible.length - 1];

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: zones.captionTop,
          left: zones.side,
          right: zones.side,
          textAlign: "center",
          fontFamily: sans,
          fontSize: T.caption,
          lineHeight: 1.16,
          letterSpacing: "-0.01em",
        }}
      >
        {visible.map((i, k) => {
          const w = words[i];
          const start = msToFrame(w.startMs, fps);
          const bright = i === current || w.emphasis;
          const appear = progress(frame, start, 4);
          return (
            <React.Fragment key={i}>
              {k > 0 ? " " : null}
              <span
                style={{
                  display: "inline-block",
                  position: "relative",
                  color: bright ? p.text : p.dim,
                  fontWeight: bright ? 700 : 500,
                  opacity: appear,
                  translate: `0px ${(1 - appear) * 14}px`,
                }}
              >
                {w.emphasis ? <SelectionBox mode={mode} startFrame={start} /> : null}
                <span style={{ position: "relative" }}>{w.text}</span>
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
