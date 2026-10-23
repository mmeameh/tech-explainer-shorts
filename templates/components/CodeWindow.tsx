// Dark editor window: traffic lights, path, tabs, line numbers, lightweight
// syntax colouring (JS/TS/SQL), optional typewriter reveal and status bar.
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { mono, sans } from "../fonts";
import { caretOn, enter, typed } from "../lib/anim";
import { accent } from "../theme";

const KEYWORDS =
  "const|let|var|function|return|if|else|try|catch|await|async|import|from|export|new|for|of|in|null|true|false|select|where|using|policy|create|table|insert|into|update|delete|on|to|and|or|values|alter|enable|row|level|security";
const TOKEN = new RegExp(
  `(\\/\\/.*$|--.*$)|("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'|\`[^\`]*\`)|\\b(${KEYWORDS})\\b|\\b(\\d+(?:\\.\\d+)?)\\b|([A-Za-z_$][\\w$]*)(?=\\()`,
  "gim",
);

const colorize = (line: string): React.ReactNode[] => {
  const out: React.ReactNode[] = [];
  let last = 0;
  TOKEN.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TOKEN.exec(line)) !== null) {
    if (m[0].length === 0) {
      TOKEN.lastIndex++;
      continue;
    }
    if (m.index > last) out.push(line.slice(last, m.index));
    const color = m[1]
      ? accent.code.comment
      : m[2]
        ? accent.code.string
        : m[3]
          ? accent.code.keyword
          : m[4]
            ? accent.code.number
            : accent.code.fn;
    out.push(
      <span key={m.index} style={{ color }}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
};

export const CodeWindow: React.FC<{
  code: string;
  path?: string;
  right?: React.ReactNode; // e.g. "42 lines"
  tabs?: string[];
  activeTab?: number;
  typeFrom?: number; // frame to start typing; omit to show all
  cps?: number;
  highlightLines?: number[]; // 1-based
  statusBar?: { branch?: string; language?: string; position?: string };
  enterAt?: number;
  width?: number | string;
  fontSize?: number;
}> = ({ code, path, right, tabs, activeTab = 0, typeFrom, cps = 40, highlightLines = [], statusBar, enterAt, width = "100%", fontSize = 26 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Untyped text is laid out but invisible, so the window keeps its final size.
  const n = typeFrom === undefined ? code.length : typed(code, frame, typeFrom, fps, cps).length;
  const typing = typeFrom !== undefined && frame >= typeFrom && n < code.length;
  const lines = code.split("\n");
  const starts: number[] = [];
  let offset = 0;
  for (const l of lines) {
    starts.push(offset);
    offset += l.length + 1;
  }
  let caretLine = 0;
  for (let i = 0; i < lines.length; i++) if (starts[i] <= n) caretLine = i;
  const caretCol = n - starts[caretLine];
  const e = enterAt === undefined ? {} : enter(frame, enterAt);
  return (
    <div
      style={{
        width,
        boxSizing: "border-box",
        borderRadius: 18,
        overflow: "hidden",
        background: "#1e1f22",
        boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
        border: "2px solid #2b2d31",
        ...e,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", background: "#2b2d31", fontFamily: sans, fontSize: 22, color: "#c9ccd1" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />
        ))}
        <span style={{ marginLeft: 14 }}>{path}</span>
        <span style={{ marginLeft: "auto", fontFamily: mono, fontWeight: 700, fontSize: 24, color: "#e6e6e6" }}>{right}</span>
      </div>
      {tabs ? (
        <div style={{ display: "flex", background: "#232427", fontFamily: sans, fontSize: 20 }}>
          {tabs.map((t, i) => (
            <div
              key={t}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                color: i === activeTab ? "#ffffff" : "#8b8f96",
                background: i === activeTab ? "#1e1f22" : "transparent",
                borderRight: "1px solid #2b2d31",
              }}
            >
              <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, padding: "1px 3px", background: "#e8c547", color: "#1e1f22", borderRadius: 2 }}>
                JS
              </span>
              {t}
              <span style={{ marginLeft: 10, color: "#5c6067" }}>×</span>
            </div>
          ))}
        </div>
      ) : null}
      <div style={{ padding: "16px 0", fontFamily: mono, fontSize, lineHeight: 1.45, color: accent.code.plain }}>
        {lines.map((l, i) => {
          const hl = highlightLines.indexOf(i + 1) >= 0;
          const shownLen = Math.max(0, Math.min(l.length, n - starts[i]));
          const reached = starts[i] <= n;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                whiteSpace: "pre",
                background: hl ? `${accent.brand}22` : "transparent",
                boxShadow: hl ? `inset 4px 0 0 ${accent.brand}` : "none",
              }}
            >
              <span style={{ width: 64, textAlign: "right", paddingRight: 20, color: "#5c6067", flexShrink: 0, opacity: reached ? 1 : 0 }}>
                {i + 1}
              </span>
              <span>
                {colorize(l.slice(0, shownLen))}
                {typing && i === caretLine && caretOn(frame) ? (
                  <span style={{ display: "inline-block", width: 3, height: "1.1em", background: "#ffffff", verticalAlign: "text-bottom" }} />
                ) : null}
                <span style={{ opacity: 0 }}>{l.slice(shownLen)}</span>
              </span>
            </div>
          );
        })}
      </div>
      {statusBar ? (
        <div style={{ display: "flex", gap: 24, padding: "6px 18px", background: "#0e7ad3", color: "#fff", fontFamily: sans, fontSize: 18 }}>
          <span style={{ fontWeight: 700 }}>{statusBar.branch ?? "main"}</span>
          <span style={{ marginLeft: "auto" }}>{statusBar.position ?? `Ln ${caretLine + 1}, Col ${caretCol + 1}`}</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span>{statusBar.language ?? "JavaScript"}</span>
        </div>
      ) : null}
    </div>
  );
};
