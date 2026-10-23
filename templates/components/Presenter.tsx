// Format A presenter: one transparent PNG per pose in public/<dir>/<pose>.png,
// switched per beat with a small pop, idle breathing, and an optional mouth
// flap (<pose>-talk.png) driven by word timings, so no audio analysis is needed.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { progress } from "../lib/anim";
import type { Beat, Word } from "../lib/timing";
import { beatIndexAt, msToFrame } from "../lib/timing";

export const Presenter: React.FC<{
  beats: Beat[];
  words: Word[];
  dir?: string;
  talkFrames?: boolean;
  height?: number;
}> = ({ beats, words, dir = "avatar", talkFrames = false, height = 600 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const bi = beatIndexAt(beats, ms);

  let pose = "idle";
  let poseStart = 0;
  for (let i = 0; i <= bi; i++) {
    const b = beats[i];
    if (b.pose && b.pose !== pose) {
      pose = b.pose;
      poseStart = b.startMs;
    }
  }
  if (pose === "none") return null;

  const pop = progress(frame, msToFrame(poseStart, fps), 8);
  const bob = Math.sin((frame / fps) * Math.PI * 2 * 0.35) * 5;
  const speaking = words.some((w) => w.startMs <= ms && ms < w.endMs - 30);
  const mouthOpen = talkFrames && speaking && Math.floor(frame / 3) % 2 === 0;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          transformOrigin: "50% 100%",
          translate: `0px ${bob + (1 - pop) * 18}px`,
          scale: String(0.97 + 0.03 * pop),
        }}
      >
        <div style={{ position: "relative", height }}>
          <Img src={staticFile(`${dir}/${pose}.png`)} style={{ height, width: "auto", display: "block" }} />
          {talkFrames ? (
            <Img
              src={staticFile(`${dir}/${pose}-talk.png`)}
              style={{ position: "absolute", left: 0, top: 0, height, width: "auto", opacity: mouthOpen ? 1 : 0 }}
            />
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
