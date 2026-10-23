// Database table and schema cards. Rows can appear on cue, light up ("hit")
// or get blocked (dimmed with a red ✕), which is how RLS and filters are shown.
import React from "react";
import { useCurrentFrame } from "remotion";
import { mono } from "../fonts";
import { enter, progress } from "../lib/anim";
import { accent, pal } from "../theme";
import { Card, TableIcon } from "./Card";
import { useMode } from "./SceneShell";

export type Column = { key: string; label?: string; type?: string; width?: string; color?: string };
export type Row = {
  cells: Record<string, React.ReactNode>;
  at?: number; // frame it appears
  state?: "hit" | "blocked";
  stateAt?: number; // frame the state applies from
};

export const DataTable: React.FC<{
  name: string;
  meta?: React.ReactNode;
  columns: Column[];
  rows: Row[];
  enterAt?: number;
  showTypes?: boolean;
  fontSize?: number;
  glow?: string;
}> = ({ name, meta, columns, rows, enterAt, showTypes = false, fontSize = 26, glow }) => {
  const frame = useCurrentFrame();
  const p = pal(useMode());
  const grid = columns.map((c) => c.width ?? "1fr").join(" ");
  return (
    <Card title={name} icon={<TableIcon />} right={meta} enterAt={enterAt} glow={glow}>
      <div style={{ fontFamily: mono, fontSize, padding: "8px 0 12px" }}>
        <div style={{ display: "grid", gridTemplateColumns: grid, gap: 16, padding: "8px 24px 10px 52px", color: p.dim, fontSize: fontSize * 0.72 }}>
          {columns.map((c) => (
            <div key={c.key}>
              {c.label ?? c.key}
              {showTypes && c.type ? <div style={{ color: p.faint, fontSize: fontSize * 0.6 }}>{c.type}</div> : null}
            </div>
          ))}
        </div>
        {rows.map((r, i) => {
          if (r.at !== undefined && frame < r.at) return null;
          const s = r.state && (r.stateAt === undefined || frame >= r.stateAt) ? r.state : undefined;
          const sp = s ? progress(frame, r.stateAt ?? 0, 6) : 0;
          return (
            <div
              key={i}
              style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: grid,
                gap: 16,
                alignItems: "center",
                padding: "10px 24px 10px 52px",
                borderTop: `1.5px solid ${p.border}`,
                background: s === "hit" ? `${accent.brand}${("0" + Math.round(sp * 34).toString(16)).slice(-2)}` : "transparent",
                boxShadow: s === "hit" ? `inset 0 0 0 ${2 * sp}px ${accent.brand}` : "none",
                opacity: s === "blocked" ? 1 - 0.6 * sp : 1,
                ...(r.at !== undefined ? enter(frame, r.at, { dur: 8, rise: 12, from: 1 }) : {}),
              }}
            >
              {s === "blocked" ? (
                <span
                  style={{
                    position: "absolute",
                    left: 12,
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    border: `2px solid ${accent.danger}`,
                    color: accent.danger,
                    fontSize: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    scale: String(sp),
                  }}
                >
                  ✕
                </span>
              ) : null}
              {columns.map((c) => (
                <div key={c.key} style={{ color: c.color ?? p.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {r.cells[c.key]}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// Column list with types, e.g. messages: id int8, room_id int8, user_id uuid.
export const SchemaCard: React.FC<{
  name: string;
  fields: { name: string; type: string; at?: number }[];
  enterAt?: number;
  width?: number | string;
  fontSize?: number;
}> = ({ name, fields, enterAt, width = 520, fontSize = 30 }) => {
  const frame = useCurrentFrame();
  const p = pal(useMode());
  return (
    <Card title={name} icon={<TableIcon />} enterAt={enterAt} width={width}>
      <div style={{ fontFamily: mono, fontSize, padding: "10px 24px 18px" }}>
        {fields.map((f) =>
          f.at !== undefined && frame < f.at ? null : (
            <div
              key={f.name}
              style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", ...(f.at !== undefined ? enter(frame, f.at, { dur: 6, rise: 10, from: 1 }) : {}) }}
            >
              <span>{f.name}</span>
              <span style={{ color: p.dim, fontSize: fontSize * 0.75 }}>{f.type}</span>
            </div>
          ),
        )}
      </div>
    </Card>
  );
};
