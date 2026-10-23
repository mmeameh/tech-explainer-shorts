// Example payoff: the running example (a group chat) working, with the
// database table updating beside it as each message is sent.
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { ChatMessage } from "../../components/ChatThread";
import { ChatThread } from "../../components/ChatThread";
import { DataTable } from "../../components/DataTable";
import { PhoneFrame } from "../../components/PhoneFrame";
import { Stage } from "../../components/SceneShell";
import { mono } from "../../fonts";
import { enter } from "../../lib/anim";
import type { SceneProps } from "../../lib/timing";
import { sceneClock } from "../../lib/timing";
import { accent } from "../../theme";

export const Chat: React.FC<SceneProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = sceneClock(props, fps);
  const messages: ChatMessage[] = [
    { from: "Daniel", text: "count me in", at: 4, time: "18:40" },
    { from: "Mei", text: "lets meet at 10", at: t.at("talks"), time: "18:40" },
    { from: "You", text: "who's bringing the speaker?", at: t.at("database"), mine: true, time: "18:41" },
  ];
  return (
    <Stage style={{ flexDirection: "row", gap: 36 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 26 }}>
        <DataTable
          name="messages"
          meta="Postgres"
          enterAt={0}
          fontSize={22}
          columns={[
            { key: "id", width: "70px" },
            { key: "room_id", width: "90px", color: accent.link },
            { key: "body" },
          ]}
          rows={[
            { cells: { id: 1041, room_id: 42, body: "count me in" } },
            { cells: { id: 1042, room_id: 42, body: "lets meet at 10" }, at: t.at("talks") },
            { cells: { id: 1043, room_id: 42, body: "who's bringing…" }, at: t.at("database"), state: "hit", stateAt: t.at("database") },
          ]}
        />
        <div style={{ fontFamily: mono, fontSize: 30, ...enter(frame, t.at("zero")) }}>
          <span style={{ color: accent.brand, fontWeight: 700 }}>0 lines</span> of backend code
        </div>
      </div>
      <PhoneFrame width={310} enterAt={0}>
        <ChatThread
          title="#weekend-trip"
          subtitle="4 members"
          members={["Daniel", "Mei", "Sofia", "Lucas"]}
          messages={messages}
          scale={0.7}
        />
      </PhoneFrame>
    </Stage>
  );
};
