// macOS pointer that glides between keyframes and shows a click ripple.
// Coordinates are in composition pixels (1080x1920).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { progress } from "../lib/anim";

export type CursorKey = { frame: number; x: number; y: number; click?: boolean };

export const Cursor: React.FC<{ path: CursorKey[]; size?: number }> = ({ path, size = 44 }) => {
  const frame = useCurrentFrame();
  if (path.length === 0 || frame < path[0].frame) return null;
  const frames = path.map((k) => k.frame);
  const opts = {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.2, 1),
  } as const;
  const x = path.length > 1 ? interpolate(frame, frames, path.map((k) => k.x), opts) : path[0].x;
  const y = path.length > 1 ? interpolate(frame, frames, path.map((k) => k.y), opts) : path[0].y;
  const clicks = path.filter((k) => k.click && frame >= k.frame && frame < k.frame + 14);
  const press = clicks.length ? 1 - 0.15 * Math.sin(progress(frame, clicks[0].frame, 6) * Math.PI) : 1;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {clicks.map((k) => {
        const r = progress(frame, k.frame, 14);
        return (
          <div
            key={k.frame}
            style={{
              position: "absolute",
              left: k.x - 40,
              top: k.y - 40,
              width: 80,
              height: 80,
              borderRadius: 40,
              border: "4px solid rgba(255,255,255,0.9)",
              boxShadow: "0 0 12px rgba(0,0,0,0.35)",
              scale: String(0.3 + r),
              opacity: 1 - r,
            }}
          />
        );
      })}
      <svg
        width={size}
        height={size * 1.4}
        viewBox="0 0 20 28"
        style={{ position: "absolute", left: x, top: y, scale: String(press), transformOrigin: "0 0", filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.4))" }}
      >
        <path d="M1 1 L1 22 L6.5 16.5 L10 25 L13.5 23.5 L10 15.5 L17.5 15.5 Z" fill="#000" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
    </AbsoluteFill>
  );
};
