// Example security beat: a request with a public key arrives, then Postgres
// evaluates the policy row by row; other rooms' rows are blocked.
import React from "react";
import { useVideoConfig } from "remotion";
import { AvatarGroup } from "../../components/Avatar";
import { Card } from "../../components/Card";
import { Cursor } from "../../components/Cursor";
import { DataTable } from "../../components/DataTable";
import { Stage } from "../../components/SceneShell";
import { mono } from "../../fonts";
import type { SceneProps } from "../../lib/timing";
import { sceneClock } from "../../lib/timing";
import { accent, pal } from "../../theme";

const ROWS = [
  { id: 1039, room: 77, members: ["Ava", "Leo", "Kim"], body: "deadline moved to friday" },
  { id: 1040, room: 77, members: ["Ava", "Leo", "Kim"], body: "sending the deck now" },
  { id: 1041, room: 42, members: ["Mei", "Lucas", "Sofia", "Daniel"], body: "who has the car keys?" },
  { id: 1042, room: 42, members: ["Mei", "Lucas", "Sofia", "Daniel"], body: "lets meet at 10" },
  { id: 1043, room: 42, members: ["Mei", "Lucas", "Sofia", "Daniel"], body: "who's bringing the speaker?" },
];

export const Policy: React.FC<SceneProps> = (props) => {
  const { fps } = useVideoConfig();
  const t = sceneClock(props, fps);
  const p = pal(props.mode);
  const check = t.at("row");
  return (
    <>
      <Stage style={{ justifyContent: "flex-start", gap: 22 }}>
        <Card enterAt={t.at("key")} style={{ padding: "16px 24px", fontFamily: mono, fontSize: 26, lineHeight: 1.5 }}>
          <span style={{ color: accent.brand, fontWeight: 700 }}>GET</span> /rest/v1/messages?select=*
          <div style={{ color: p.dim }}>
            apikey: <span style={{ color: accent.brand }}>sb_publishable_9xQ…</span>
          </div>
        </Card>
        <Card enterAt={t.at("policy")} glow={accent.brand} style={{ padding: "16px 24px", fontFamily: mono, fontSize: 26 }}>
          policy <b>SELECT</b> using (<span style={{ color: accent.brand }}>auth.uid() = any(members)</span>)
        </Card>
        <DataTable
          name="messages"
          meta="5 rows"
          enterAt={0}
          fontSize={22}
          columns={[
            { key: "id", width: "70px" },
            { key: "room_id", width: "90px" },
            { key: "members", width: "130px" },
            { key: "body" },
          ]}
          rows={ROWS.map((r, i) => ({
            cells: { id: r.id, room_id: r.room, members: <AvatarGroup names={r.members} size={28} ring={p.card} />, body: r.body },
            state: r.room === 77 ? "blocked" : "hit",
            stateAt: check + i * 3,
          }))}
        />
      </Stage>
      <Cursor
        path={[
          { frame: t.at("key"), x: 940, y: 1250 },
          { frame: t.at("key") + 14, x: 620, y: 735, click: true },
        ]}
      />
    </>
  );
};
