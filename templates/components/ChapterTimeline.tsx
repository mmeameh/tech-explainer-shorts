// Format A chrome: logo, chapter stepper that fills as the story advances,
// and a live counter (messages, connections, rows) on the right.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { mono } from "../fonts";
import { countUp, formatNumber, progress } from "../lib/anim";
import type { Beat } from "../lib/timing";
import { beatIndexAt, msToFrame } from "../lib/timing";
import { accent, pal, zones } from "../theme";

const DefaultLogo: React.FC = () => (
  <div style={{ width: 34, height: 34, rotate: "45deg", borderRadius: 8, background: accent.brand }} />
);

export const ChapterTimeline: React.FC<{
  beats: Beat[];
  chapters: string[];
  counterLabel?: string;
  logo?: React.ReactNode;
}> = ({ beats, chapters, counterLabel = "", logo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const bi = beatIndexAt(beats, ms);
  const beat = beats[bi];
  const p = pal(beat.mode);

  // Chapter progress: latest chapter reached so far.
  let chapter = -1;
  let prevChapter = -1;
  let chapterStart = 0;
  let firstChapterStart = -1;
  // Counter: latest value reached so far.
  let value = 0;
  let prevValue = 0;
  let valueStart = 0;
  let label = counterLabel;
  for (let i = 0; i <= bi; i++) {
    const b = beats[i];
    if (b.chapter) {
      const ci = chapters.indexOf(b.chapter);
      if (ci !== chapter) {
        prevChapter = chapter;
        chapter = ci;
        chapterStart = b.startMs;
        if (firstChapterStart < 0) firstChapterStart = b.startMs;
      }
    }
    if (b.counter !== undefined && b.counter !== value) {
      prevValue = value;
      value = b.counter;
      valueStart = b.startMs;
    }
    if (b.counterLabel) label = b.counterLabel;
  }
  if (chapter < 0 || beat.hideTimeline) return null;

  const show = progress(frame, msToFrame(firstChapterStart, fps), 10);
  const move = progress(frame, msToFrame(chapterStart, fps), 14);
  const fill = Math.max(0, prevChapter + (chapter - prevChapter) * move);
  const shown = countUp(frame, msToFrame(valueStart, fps), 18, prevValue, value);
  const n = Math.max(2, chapters.length);
  const pct = (i: number) => `${(i / (n - 1)) * 100}%`;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: show }}>
      <div
        style={{
          position: "absolute",
          top: zones.timelineTop,
          left: zones.side,
          right: zones.side,
          display: "flex",
          alignItems: "flex-start",
          gap: 26,
          fontFamily: mono,
        }}
      >
        <div style={{ width: 44, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {logo ?? <DefaultLogo />}
        </div>
        <div style={{ position: "relative", flex: 1, height: 84, marginLeft: 20, marginRight: 30 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 13, height: 3, background: p.faint }} />
          <div style={{ position: "absolute", left: 0, width: pct(fill), top: 13, height: 3, background: accent.brand }} />
          {chapters.map((c, i) => {
            const done = fill >= i - 0.001;
            const current = i === chapter;
            return (
              <div key={c} style={{ position: "absolute", left: pct(i), top: 0, width: 0 }}>
                <div
                  style={{
                    position: "absolute",
                    left: -(current ? 11 : 9),
                    top: current ? 3 : 5,
                    width: current ? 22 : 18,
                    height: current ? 22 : 18,
                    borderRadius: 11,
                    boxSizing: "border-box",
                    background: done ? accent.brand : p.bg,
                    border: `3px solid ${done ? accent.brand : p.faint}`,
                    boxShadow: current ? `0 0 0 6px ${accent.brand}33, 0 0 18px ${accent.brand}` : "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 34,
                    left: -60,
                    width: 120,
                    textAlign: "center",
                    fontSize: 15,
                    lineHeight: 1.2,
                    letterSpacing: "0.06em",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: done ? accent.brand : p.dim,
                  }}
                >
                  {c}
                </div>
              </div>
            );
          })}
        </div>
        {label ? (
          <div style={{ width: 150, textAlign: "right", marginTop: -8 }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: beat.counterDanger ? accent.danger : p.text }}>
              {formatNumber(shown)}
            </div>
            <div style={{ fontSize: 17, color: p.dim }}>{label}</div>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
