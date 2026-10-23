// Connector that draws itself from A to B, optionally carrying a "packet"
// (a dot plus a label pill) along the path, e.g. a request or a WAL entry.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { mono } from "../fonts";
import { progress } from "../lib/anim";
import { accent } from "../theme";

type Pt = [number, number];

const quad = (a: Pt, c: Pt, b: Pt, t: number): Pt => [
  (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0],
  (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1],
];

export const FlowArrow: React.FC<{
  from: Pt;
  to: Pt;
  start: number; // frame the line starts drawing
  dur?: number;
  curve?: number; // perpendicular bend in px, 0 = straight
  color?: string;
  width?: number;
  dashed?: boolean;
  packetAt?: number; // frame the packet departs
  packetDur?: number;
  packetLabel?: React.ReactNode;
}> = ({ from, to, start, dur = 12, curve = 0, color = accent.brand, width = 4, dashed = false, packetAt, packetDur = 18, packetLabel }) => {
  const frame = useCurrentFrame();
  const mid: Pt = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy) || 1;
  const ctrl: Pt = [mid[0] - (dy / len) * curve, mid[1] + (dx / len) * curve];
  let length = 0;
  let prev = from;
  for (let i = 1; i <= 24; i++) {
    const pt = quad(from, ctrl, to, i / 24);
    length += Math.hypot(pt[0] - prev[0], pt[1] - prev[1]);
    prev = pt;
  }
  const draw = progress(frame, start, dur);
  if (draw <= 0) return null;
  const d = `M ${from[0]} ${from[1]} Q ${ctrl[0]} ${ctrl[1]} ${to[0]} ${to[1]}`;
  const tail = quad(from, ctrl, to, 0.97);
  const ang = Math.atan2(to[1] - tail[1], to[0] - tail[0]);
  const head = 16;
  const headPts = [
    to,
    [to[0] - head * Math.cos(ang - 0.45), to[1] - head * Math.sin(ang - 0.45)],
    [to[0] - head * Math.cos(ang + 0.45), to[1] - head * Math.sin(ang + 0.45)],
  ]
    .map((q) => q.join(","))
    .join(" ");
  const pk = packetAt === undefined ? -1 : progress(frame, packetAt, packetDur);
  const pkPos = pk > 0 && pk < 1 ? quad(from, ctrl, to, pk) : null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeDasharray={dashed ? "10 12" : `${length} ${length}`}
          strokeDashoffset={dashed ? 0 : length * (1 - draw)}
          opacity={dashed ? draw : 1}
        />
        {draw > 0.95 ? <polygon points={headPts} fill={color} /> : null}
        {pkPos ? <circle cx={pkPos[0]} cy={pkPos[1]} r={11} fill={color} stroke="#fff" strokeWidth={3} /> : null}
      </svg>
      {pkPos && packetLabel ? (
        <div
          style={{
            position: "absolute",
            left: pkPos[0] + 18,
            top: pkPos[1] - 20,
            padding: "4px 12px",
            borderRadius: 10,
            background: "#111214",
            color: "#fff",
            border: `2px solid ${color}`,
            fontFamily: mono,
            fontSize: 20,
            whiteSpace: "nowrap",
          }}
        >
          {packetLabel}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
