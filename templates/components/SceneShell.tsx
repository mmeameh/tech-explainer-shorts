// Scene background (dark/light + faint grid + vignette), the mode context that
// mockup components read, and <Stage> for the content zone.
import React from "react";
import { AbsoluteFill } from "remotion";
import { sans } from "../fonts";
import type { Mode } from "../lib/timing";
import { pal, zones } from "../theme";

const ModeContext = React.createContext<Mode>("dark");
export const useMode = () => React.useContext(ModeContext);

export const SceneShell: React.FC<{ mode: Mode; grid?: boolean; children?: React.ReactNode }> = ({
  mode,
  grid = true,
  children,
}) => {
  const p = pal(mode);
  return (
    <ModeContext.Provider value={mode}>
      <AbsoluteFill style={{ backgroundColor: p.bg, fontFamily: sans, color: p.text }}>
        {grid ? (
          <AbsoluteFill
            style={{
              backgroundImage: `linear-gradient(${p.grid} 2px, transparent 2px), linear-gradient(90deg, ${p.grid} 2px, transparent 2px)`,
              backgroundSize: "54px 54px",
            }}
          />
        ) : null}
        <AbsoluteFill
          style={{
            background:
              mode === "dark"
                ? "radial-gradient(ellipse at 50% 42%, transparent 35%, rgba(0,0,0,0.6) 100%)"
                : "radial-gradient(ellipse at 50% 42%, transparent 50%, rgba(0,0,0,0.05) 100%)",
          }}
        />
        {children}
      </AbsoluteFill>
    </ModeContext.Provider>
  );
};

// The content zone between timeline and presenter. Children are centred.
export const Stage: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties; top?: number; bottom?: number }> = ({
  children,
  style,
  top = zones.contentTop,
  bottom = zones.contentBottom,
}) => (
  <div
    style={{
      position: "absolute",
      top,
      height: bottom - top,
      left: zones.side,
      right: zones.side,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 28,
      ...style,
    }}
  >
    {children}
  </div>
);
