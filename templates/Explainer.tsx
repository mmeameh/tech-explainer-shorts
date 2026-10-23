// The whole short: scenes laid out on the narration timeline, with captions,
// timeline and presenter as persistent overlays.
import React from "react";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { ChapterTimeline } from "./components/ChapterTimeline";
import { KineticCaptions } from "./components/KineticCaptions";
import { Presenter } from "./components/Presenter";
import { SceneShell } from "./components/SceneShell";
import { beats, words } from "./data/timeline";
import { groupSegments, msToFrame } from "./lib/timing";
import { MissingScene, SCENES } from "./scenes";

export const TAIL_MS = 1500; // hold after the last word

export type ExplainerProps = {
  format: "A" | "B";
  chapters: string[];
  counterLabel: string;
  voiceover: string | null; // file in public/, null while using fake timings
  avatarDir: string; // public/<avatarDir>/<pose>.png
  talkFrames: boolean; // public/<avatarDir>/<pose>-talk.png exist
};

export const explainerDurationInFrames = (fps: number) => msToFrame(beats[beats.length - 1].endMs + TAIL_MS, fps);

export const Explainer: React.FC<ExplainerProps> = ({ format, chapters, counterLabel, voiceover, avatarDir, talkFrames }) => {
  const { fps } = useVideoConfig();
  const segments = React.useMemo(() => groupSegments(beats, words, TAIL_MS), []);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {segments.map((seg, i) => {
        const Scene = SCENES[seg.scene] ?? MissingScene;
        const from = msToFrame(seg.startMs, fps);
        const durationInFrames = Math.max(1, msToFrame(seg.endMs, fps) - from);
        return (
          <Sequence key={`${seg.scene}-${i}`} name={`${i + 1}. ${seg.scene}`} from={from} durationInFrames={durationInFrames}>
            <SceneShell mode={seg.mode}>
              <Scene {...seg} />
            </SceneShell>
          </Sequence>
        );
      })}
      {format === "A" ? <ChapterTimeline beats={beats} chapters={chapters} counterLabel={counterLabel} /> : null}
      {format === "A" ? <Presenter beats={beats} words={words} dir={avatarDir} talkFrames={talkFrames} /> : null}
      <KineticCaptions words={words} beats={beats} />
      {voiceover ? <Audio src={staticFile(voiceover)} /> : null}
    </AbsoluteFill>
  );
};
