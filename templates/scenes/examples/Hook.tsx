// Example hook: the finished system as a stack that assembles on the keyword,
// plus a scale stat that counts up. Pattern: show the destination first.
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Card } from "../../components/Card";
import { Stage } from "../../components/SceneShell";
import { mono } from "../../fonts";
import { countUp, enter, formatNumber } from "../../lib/anim";
import type { SceneProps } from "../../lib/timing";
import { sceneClock } from "../../lib/timing";
import { accent, pal } from "../../theme";

const LAYERS = ["Edge Functions", "Realtime", "Auth + RLS", "PostgREST", "Postgres"];

export const Hook: React.FC<SceneProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = sceneClock(props, fps);
  const p = pal(props.mode);
  const start = t.at("Supabase");
  const stat = t.at("backend");
  return (
    <Stage style={{ gap: 14 }}>
      {LAYERS.map((name, i) => (
        <Card
          key={name}
          width={640}
          enterAt={start + i * 4}
          glow={i === LAYERS.length - 1 ? accent.brand : undefined}
          style={{ padding: "18px 28px", fontFamily: mono, fontSize: 32, fontWeight: 700, display: "flex", justifyContent: "space-between" }}
        >
          <span>{name}</span>
          <span style={{ color: accent.brand }}>●</span>
        </Card>
      ))}
      <div style={{ marginTop: 22, fontFamily: mono, fontSize: 34, color: p.dim, ...enter(frame, stat) }}>
        <span style={{ color: p.text, fontWeight: 700 }}>{formatNumber(countUp(frame, stat, 30, 0, 1000000))}</span> new databases / week
      </div>
    </Stage>
  );
};
