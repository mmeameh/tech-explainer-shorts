// Small animation helpers. Every value is a pure function of the frame,
// so renders are deterministic (no CSS transitions, no timers).
import { Easing, interpolate } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

// 0 -> 1 over `dur` frames starting at `start`.
export const progress = (frame: number, start: number, dur = 10, easing = easeOut) =>
  interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing });

// Pop-in used by cards, rows, bubbles: fade + rise + slight scale.
export const enter = (frame: number, start: number, opts: { dur?: number; rise?: number; from?: number } = {}) => {
  const { dur = 10, rise = 24, from = 0.96 } = opts;
  const p = progress(frame, start, dur);
  return {
    opacity: p,
    translate: `0px ${(1 - p) * rise}px`,
    scale: String(from + (1 - from) * p),
  };
};

// Fade out over `dur` frames starting at `start`.
export const exit = (frame: number, start: number, dur = 8) => 1 - progress(frame, start, dur);

// Visible window: fades in at `start`, out at `end`.
export const windowed = (frame: number, start: number, end: number, dur = 8) =>
  Math.min(progress(frame, start, dur), exit(frame, end - dur, dur));

// Typewriter: characters of `text` revealed between `start` and `start + text.length / cps * fps`.
export const typed = (text: string, frame: number, start: number, fps: number, cps = 28) => {
  const n = Math.floor(Math.max(0, frame - start) * (cps / fps));
  return text.slice(0, Math.min(text.length, n));
};

// Count from `from` to `to` between frames.
export const countUp = (frame: number, start: number, dur: number, from: number, to: number) =>
  Math.round(interpolate(frame, [start, start + dur], [from, to], { ...clamp, easing: easeOut }));

export const formatNumber = (n: number) => n.toLocaleString("en-US");

// Blinking caret: on for 15 frames, off for 15.
export const caretOn = (frame: number) => Math.floor(frame / 15) % 2 === 0;
