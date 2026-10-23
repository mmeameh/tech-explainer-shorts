// Group chat UI for the running example: header, bubbles that pop in on cue,
// a typing indicator, and a draft that types into the input bar.
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { sans } from "../fonts";
import { enter, typed } from "../lib/anim";
import { accent } from "../theme";
import { Avatar, AvatarGroup } from "./Avatar";

export type ChatMessage = {
  from: string;
  text: React.ReactNode;
  at: number; // frame it appears (scene-relative)
  mine?: boolean;
  time?: string;
  status?: string; // "Delivered", "Sent" under your own bubble
};

export const ChatThread: React.FC<{
  title: string;
  subtitle?: string;
  members?: string[];
  messages: ChatMessage[];
  draft?: { text: string; at: number };
  typing?: { from: string; at: number; until: number };
  dark?: boolean;
  scale?: number; // 1 = sized for a 440px phone
}> = ({ title, subtitle, members = [], messages, draft, typing, dark = false, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (n: number) => n * scale;
  const fg = dark ? "#f5f5f5" : "#0b0b0c";
  const dim = dark ? "#8b8f96" : "#8e8e93";
  const bubble = dark ? "#26282c" : "#eef0f3";
  const line = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const draftText = draft ? typed(draft.text, frame, draft.at, fps, 18) : "";
  const showTyping = typing && frame >= typing.at && frame < typing.until;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: sans, color: fg }}>
      <div style={{ display: "flex", alignItems: "center", gap: s(12), padding: `${s(6)}px ${s(18)}px ${s(14)}px`, borderBottom: `1px solid ${line}` }}>
        <span style={{ fontSize: s(34), color: accent.link, marginTop: s(-4) }}>‹</span>
        <AvatarGroup names={members.slice(0, 4)} size={s(30)} ring={dark ? "#111214" : "#ffffff"} />
        <div>
          <div style={{ fontWeight: 700, fontSize: s(20) }}>{title}</div>
          {subtitle ? <div style={{ fontSize: s(14), color: dim }}>{subtitle}</div> : null}
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: s(10), padding: `${s(12)}px ${s(14)}px`, overflow: "hidden" }}>
        <div style={{ textAlign: "center", fontSize: s(13), color: dim, marginBottom: s(4) }}>Today</div>
        {messages
          .filter((m) => frame >= m.at)
          .map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: m.mine ? "flex-end" : "flex-start",
                ...enter(frame, m.at, { dur: 8, rise: 16, from: 0.9 }),
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-end", gap: s(8), maxWidth: "82%" }}>
                {m.mine ? null : <Avatar name={m.from} size={s(28)} ring="transparent" />}
                <div
                  style={{
                    padding: `${s(8)}px ${s(14)}px`,
                    borderRadius: s(18),
                    background: m.mine ? accent.brand : bubble,
                    color: m.mine ? "#06281a" : fg,
                    fontSize: s(17),
                    lineHeight: 1.3,
                  }}
                >
                  {m.mine ? null : <div style={{ fontSize: s(12), fontWeight: 700, color: dim }}>{m.from}</div>}
                  {m.text}
                  {m.time ? <div style={{ fontSize: s(11), textAlign: "right", opacity: 0.6 }}>{m.time}</div> : null}
                </div>
              </div>
              {m.status ? <div style={{ fontSize: s(11), color: dim, marginTop: s(2) }}>{m.status}</div> : null}
            </div>
          ))}
        {showTyping && typing ? (
          <div style={{ display: "flex", alignItems: "flex-end", gap: s(8) }}>
            <Avatar name={typing.from} size={s(28)} ring="transparent" />
            <div style={{ display: "flex", gap: s(5), padding: `${s(12)}px ${s(14)}px`, borderRadius: s(18), background: bubble }}>
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  style={{
                    width: s(8),
                    height: s(8),
                    borderRadius: s(4),
                    background: dim,
                    opacity: 0.35 + 0.65 * Math.max(0, Math.sin(((frame - typing.at) / 6) - d)),
                  }}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: s(10), padding: `${s(10)}px ${s(14)}px ${s(30)}px`, borderTop: `1px solid ${line}` }}>
        <span style={{ fontSize: s(26), color: dim }}>+</span>
        <div style={{ flex: 1, padding: `${s(8)}px ${s(14)}px`, borderRadius: 999, border: `1px solid ${line}`, fontSize: s(16), color: draftText ? fg : dim }}>
          {draftText || "Message"}
        </div>
        <div
          style={{
            width: s(32),
            height: s(32),
            borderRadius: s(16),
            background: draftText ? accent.brand : dark ? "#3a3d43" : "#d1d5db",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: s(18),
            fontWeight: 700,
          }}
        >
          ↑
        </div>
      </div>
    </div>
  );
};
