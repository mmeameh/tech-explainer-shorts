// Design tokens measured from the reference videos (scaled to 1080x1920).
// Swap `accent.brand` per topic; keep everything else for the house style.
import type { Mode } from "./lib/timing";

export const VIDEO = { width: 1080, height: 1920, fps: 30 } as const;

export const palette = {
  dark: {
    bg: "#0d0e10",
    grid: "rgba(255,255,255,0.035)",
    text: "#f7f7f7",
    dim: "#7c8087",
    faint: "#3a3d43",
    card: "#16171a",
    cardRaised: "#1e2024",
    border: "rgba(255,255,255,0.09)",
    shadow: "0 30px 70px rgba(0,0,0,0.55)",
    selectFill: "rgba(37,99,235,0.30)",
    handleRing: "#ffffff",
  },
  light: {
    bg: "#f6f6f4",
    grid: "rgba(0,0,0,0.045)",
    text: "#0b0b0c",
    dim: "#9b9ca0",
    faint: "#cfd0d3",
    card: "#ffffff",
    cardRaised: "#ffffff",
    border: "rgba(0,0,0,0.08)",
    shadow: "0 24px 60px rgba(0,0,0,0.12)",
    selectFill: "rgba(59,130,246,0.14)",
    handleRing: "#ffffff",
  },
};

export type Palette = (typeof palette)["dark"];

export const pal = (mode: Mode): Palette => palette[mode];

export const accent = {
  brand: "#3ECF8E", // topic colour (Supabase green in the reference)
  select: "#3b82f6", // selection box and handles
  danger: "#ef4444",
  warn: "#f59e0b",
  gold: "#f5c542", // charge / field lines in Format B
  link: "#2f6fde",
  code: {
    keyword: "#c678dd",
    string: "#98c379",
    number: "#d19a66",
    fn: "#61afef",
    comment: "#7f848e",
    plain: "#e6e6e6",
  },
};

export const zones = {
  side: 60, // keep text inside x 60..1020
  captionTop: 315, // top of first caption line (line centre ~360)
  timelineTop: 560,
  contentTop: 680,
  contentBottom: 1330,
  presenterTop: 1360,
};

export const type = {
  caption: 78,
  headline: 84,
  body: 40,
  ui: 30,
  small: 24,
  mono: 26,
};
