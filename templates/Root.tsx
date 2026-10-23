import React from "react";
import { Composition } from "remotion";
import { Explainer, explainerDurationInFrames, type ExplainerProps } from "./Explainer";
import { meta } from "./data/timeline";
import { VIDEO } from "./theme";

const defaultProps: ExplainerProps = {
  format: meta.format,
  chapters: meta.chapters,
  counterLabel: meta.counterLabel,
  voiceover: meta.voiceover,
  avatarDir: "avatar",
  talkFrames: false,
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Explainer"
    component={Explainer}
    width={VIDEO.width}
    height={VIDEO.height}
    fps={VIDEO.fps}
    durationInFrames={explainerDurationInFrames(VIDEO.fps)}
    defaultProps={defaultProps}
  />
);
