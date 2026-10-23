// Generic panel, status badge, table icon and the small honesty label.
import React from "react";
import { useCurrentFrame } from "remotion";
import { mono, sans } from "../fonts";
import { enter } from "../lib/anim";
import { pal, zones } from "../theme";
import { useMode } from "./SceneShell";

export const Card: React.FC<{
  title?: React.ReactNode;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  enterAt?: number;
  width?: number | string;
  glow?: string; // accent border + glow, e.g. accent.brand
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ title, icon, right, enterAt, width = "100%", glow, children, style }) => {
  const frame = useCurrentFrame();
  const p = pal(useMode());
  const e = enterAt === undefined ? {} : enter(frame, enterAt);
  return (
    <div
      style={{
        width,
        boxSizing: "border-box",
        background: p.card,
        border: `2px solid ${glow ?? p.border}`,
        borderRadius: 20,
        boxShadow: glow ? `${p.shadow}, 0 0 34px ${glow}55` : p.shadow,
        overflow: "hidden",
        ...e,
        ...style,
      }}
    >
      {title !== undefined ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "18px 24px",
            borderBottom: `2px solid ${p.border}`,
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 30,
          }}
        >
          {icon}
          <span>{title}</span>
          <span style={{ marginLeft: "auto", fontWeight: 500, fontSize: 24, color: p.dim }}>{right}</span>
        </div>
      ) : null}
      {children}
    </div>
  );
};

export const Badge: React.FC<{ color: string; children: React.ReactNode; dot?: boolean; solid?: boolean }> = ({
  color,
  children,
  dot = true,
  solid = false,
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "4px 14px",
      borderRadius: 999,
      fontFamily: sans,
      fontWeight: 700,
      fontSize: 24,
      color: solid ? "#fff" : color,
      background: solid ? color : `${color}1f`,
      border: `2px solid ${color}55`,
    }}
  >
    {dot ? <span style={{ width: 10, height: 10, borderRadius: 5, background: solid ? "#fff" : color }} /> : null}
    {children}
  </span>
);

export const TableIcon: React.FC<{ size?: number; color?: string }> = ({ size = 28, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 9h18M9 9v11" />
  </svg>
);

// "Magnified illustration", "Values illustrative" ... bottom-left, small.
export const HonestyLabel: React.FC<{ children: React.ReactNode; bottom?: number }> = ({ children, bottom = 440 }) => (
  <div
    style={{
      position: "absolute",
      left: zones.side,
      bottom,
      fontFamily: sans,
      fontSize: 24,
      fontWeight: 500,
      color: "rgba(255,255,255,0.86)",
      textShadow: "0 1px 6px rgba(0,0,0,0.8)",
    }}
  >
    {children}
  </div>
);
