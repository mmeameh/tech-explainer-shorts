// Example problem -> solution swap: hand-written routes type out (pain, crying
// pose), then the auto-generated API replaces them on the next beat.
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Card } from "../../components/Card";
import { CodeWindow } from "../../components/CodeWindow";
import { SchemaCard } from "../../components/DataTable";
import { FlowArrow } from "../../components/FlowArrow";
import { Stage } from "../../components/SceneShell";
import { mono, sans } from "../../fonts";
import { countUp, enter, exit, progress } from "../../lib/anim";
import type { SceneProps } from "../../lib/timing";
import { sceneClock } from "../../lib/timing";
import { accent, pal } from "../../theme";

const CODE = `app.get('/profiles', async (req, res) => {
  const user = await auth(req)
  if (!user) return res.status(401).end()
  const { rows } = await db.query(
    'select * from profiles where id = $1',
    [req.query.id])
  res.json(rows)
})`;

const TABLES = [
  { name: "messages", fields: [{ name: "id", type: "int8" }, { name: "room_id", type: "int8" }, { name: "body", type: "text" }] },
  { name: "rooms", fields: [{ name: "id", type: "int8" }, { name: "name", type: "text" }, { name: "created_by", type: "uuid" }] },
  { name: "profiles", fields: [{ name: "id", type: "uuid" }, { name: "username", type: "text" }, { name: "avatar_url", type: "text" }] },
];
const COLS = [213, 540, 867]; // column centres in composition px

export const Routes: React.FC<SceneProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = sceneClock(props, fps);
  const p = pal(props.mode);
  const typing = t.at("routes");
  const swap = t.beat(1);
  return (
    <>
      {frame < swap + 8 ? (
        <Stage>
          <div style={{ width: "100%", opacity: exit(frame, swap - 2, 8) }}>
            <CodeWindow
              path="chatty-backend / routes"
              right={`${countUp(frame, typing, 45, 1, 42)} lines`}
              tabs={["messages.js", "rooms.js", "profiles.js"]}
              activeTab={2}
              code={CODE}
              typeFrom={typing}
              cps={70}
              statusBar={{ branch: "main", language: "JavaScript" }}
              enterAt={0}
              fontSize={24}
            />
          </div>
        </Stage>
      ) : null}
      {frame >= swap ? (
        <>
          <div style={{ position: "absolute", left: 60, right: 60, top: 690, display: "flex", justifyContent: "space-between" }}>
            {TABLES.map((tb, i) => (
              <div
                key={tb.name}
                style={{ width: 300, textAlign: "center", fontFamily: mono, fontSize: 21, color: p.dim, ...enter(frame, t.at("tables") + i * 4) }}
              >
                /rest/v1/<b style={{ color: p.text }}>{tb.name}</b>
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 60, right: 60, top: 740, ...enter(frame, swap) }}>
            <Card glow={accent.brand} style={{ height: 100, display: "flex", alignItems: "center", gap: 24, padding: "0 28px" }}>
              <span style={{ fontFamily: sans, fontSize: 40, fontWeight: 700 }}>PostgREST</span>
              <div
                style={{
                  flex: 1,
                  background: "#0d0e10",
                  borderRadius: 12,
                  padding: "12px 20px",
                  fontFamily: mono,
                  fontSize: 26,
                  color: accent.brand,
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                {TABLES.map((tb, i) => (
                  <span key={tb.name} style={{ opacity: progress(frame, t.at("tables") + i * 4, 6) }}>
                    {tb.name}
                  </span>
                ))}
              </div>
            </Card>
          </div>
          {COLS.map((x, i) => (
            <FlowArrow key={x} from={[x, 846]} to={[x, 900]} start={swap + 6 + i * 3} dur={8} />
          ))}
          {TABLES.map((tb, i) => (
            <div key={tb.name} style={{ position: "absolute", left: COLS[i] - 150, top: 910, width: 300 }}>
              <SchemaCard name={tb.name} fields={tb.fields} enterAt={swap + 10 + i * 3} width={300} fontSize={22} />
            </div>
          ))}
        </>
      ) : null}
    </>
  );
};
