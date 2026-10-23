// Placeholder for scene ids that have no component yet, so the whole video
// can be previewed with captions and timing before every scene is built.
import React from "react";
import { mono } from "../fonts";
import { pal } from "../theme";
import type { SceneProps } from "../lib/timing";
import { Stage } from "../components/SceneShell";

export const MissingScene: React.FC<SceneProps> = ({ scene, mode, beats }) => {
  const p = pal(mode);
  return (
    <Stage>
      <div
        style={{
          width: "100%",
          padding: 36,
          boxSizing: "border-box",
          border: `3px dashed ${p.faint}`,
          borderRadius: 24,
          fontFamily: mono,
          color: p.dim,
          fontSize: 26,
          lineHeight: 1.5,
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 700, color: p.text, marginBottom: 16 }}>scene: {scene}</div>
        {beats.map((b) => (
          <div key={b.id}>
            {b.id}: {b.text}
          </div>
        ))}
      </div>
    </Stage>
  );
};
