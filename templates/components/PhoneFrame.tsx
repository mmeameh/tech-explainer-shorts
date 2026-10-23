// iPhone-style frame: dynamic island, 9:41 status bar, home indicator.
import React from "react";
import { useCurrentFrame } from "remotion";
import { sans } from "../fonts";
import { enter } from "../lib/anim";

export const PhoneFrame: React.FC<{
  width?: number;
  screen?: "light" | "dark";
  time?: string;
  enterAt?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ width = 440, screen = "light", time = "9:41", enterAt, children, style }) => {
  const frame = useCurrentFrame();
  const height = Math.round(width * 2.05);
  const e = enterAt === undefined ? {} : enter(frame, enterAt, { rise: 40 });
  const fg = screen === "light" ? "#0b0b0c" : "#f5f5f5";
  return (
    <div
      style={{
        width,
        height,
        boxSizing: "border-box",
        padding: width * 0.028,
        borderRadius: width * 0.16,
        background: "#0b0b0c",
        boxShadow: "0 40px 80px rgba(0,0,0,0.35), inset 0 0 0 2px #2a2a2e",
        position: "relative",
        flexShrink: 0,
        ...e,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: width * 0.135,
          overflow: "hidden",
          background: screen === "light" ? "#ffffff" : "#111214",
          color: fg,
          fontFamily: sans,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: width * 0.13,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `0 ${width * 0.085}px`,
            fontWeight: 700,
            fontSize: width * 0.045,
          }}
        >
          <span>{time}</span>
          <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ width: width * 0.05, height: width * 0.028, borderRadius: 2, background: fg, opacity: 0.85 }} />
            <span style={{ width: width * 0.065, height: width * 0.03, borderRadius: 4, border: `2px solid ${fg}`, boxSizing: "border-box" }} />
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            top: width * 0.03,
            left: "50%",
            width: width * 0.3,
            height: width * 0.078,
            marginLeft: -width * 0.15,
            borderRadius: 999,
            background: "#000",
          }}
        />
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>{children}</div>
        <div
          style={{
            position: "absolute",
            bottom: width * 0.022,
            left: "50%",
            width: width * 0.33,
            marginLeft: -width * 0.165,
            height: 5,
            borderRadius: 3,
            background: fg,
            opacity: 0.85,
          }}
        />
      </div>
    </div>
  );
};
