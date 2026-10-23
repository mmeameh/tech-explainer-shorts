// Person avatars for chat UIs and data rows: a photo if you have one
// (public/people/<name>.jpg), otherwise coloured initials.
import React from "react";
import { Img, staticFile } from "remotion";
import { sans } from "../fonts";

const COLORS = ["#f59e0b", "#3b82f6", "#ec4899", "#10b981", "#8b5cf6", "#ef4444", "#14b8a6", "#f97316"];

const colorFor = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return COLORS[h % COLORS.length];
};

export const Avatar: React.FC<{ name: string; size?: number; src?: string; ring?: string }> = ({
  name,
  size = 48,
  src,
  ring = "#ffffff",
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      flexShrink: 0,
      overflow: "hidden",
      border: `${Math.max(2, size / 16)}px solid ${ring}`,
      boxSizing: "border-box",
      background: colorFor(name),
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: sans,
      fontWeight: 700,
      fontSize: size * 0.42,
    }}
  >
    {src ? (
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    ) : (
      name.slice(0, 1).toUpperCase()
    )}
  </div>
);

export const AvatarGroup: React.FC<{ names: string[]; size?: number; ring?: string }> = ({ names, size = 40, ring }) => (
  <div style={{ display: "flex" }}>
    {names.map((n, i) => (
      <div key={n} style={{ marginLeft: i === 0 ? 0 : -size * 0.32 }}>
        <Avatar name={n} size={size} ring={ring} />
      </div>
    ))}
  </div>
);
