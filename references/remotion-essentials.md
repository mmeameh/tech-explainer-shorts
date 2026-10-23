# Remotion essentials (v4.0.5xx)

The engine rules this kit relies on, condensed from the official Remotion agent skills (v4.0.528–538). For anything deeper, read https://www.remotion.dev/docs.

## Project

```bash
npx create-video@latest --yes --blank --no-tailwind my-explainer   # scaffold
cd my-explainer && npm i
npx remotion add @remotion/media @remotion/google-fonts @remotion/media-utils
# optional: @remotion/transitions @remotion/three @remotion/install-whisper-cpp
```

Then copy the kit:

```bash
cp -r "<skill-dir>/templates/." src/
cp -r "<skill-dir>/scripts" .
cp src/script.example.json script.json && rm src/script.example.json
```

`src/index.ts` from the scaffold already calls `registerRoot(RemotionRoot)` from `./Root`. Delete the scaffold's `src/Composition.tsx`. Always add packages with `npx remotion add …` so versions match.

## Animation rules

- **Drive everything from `useCurrentFrame()`** with `interpolate()`, `Easing.bezier()` and `Easing.spring()`. CSS transitions and animations, Tailwind animate classes, `setTimeout` and `Math.random()` all break rendering (flicker, nondeterminism).
- **Clamp** with `{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }`.
- **Prefer the individual CSS properties** `scale`, `translate` and `rotate` over `transform` strings. For scale animations, use `output: "perceptual-scale"` in `interpolate` options.
- **Time is relative:** `useCurrentFrame()` inside a `<Sequence from={x}>` starts at 0. The kit's `sceneClock` already converts word times into scene-relative frames.
- **`<Sequence from durationInFrames layout="absolute-fill" | "none">`** delays and trims anything. `<Series>` and `<TransitionSeries>` (from `@remotion/transitions`) lay scenes end to end. The kit uses plain Sequences placed at word times, because scene cuts are hard cuts on the word.
- **Randomness:** `random(seed)` from `remotion` is deterministic.

## Media

- **Files** go in `public/`, referenced with `staticFile("path")`.
- **Images:** `<Img>` (DOM `img` that delays the render until it loads) or `<CanvasImage>`. Animated GIF, APNG or WebP go through `<AnimatedImage>`.
- **Audio and video:** `<Audio>` and `<Video>` from `@remotion/media`. Props include `volume` (number or `(f) => number`), `trimBefore` and `trimAfter` (frames), `playbackRate`, `loop`, `muted`, and `from` to delay.
- **Audio duration:** `mediabunny`'s `Input(...).computeDuration()`. The kit doesn't need it, because word timings define the length.
- **Audio visualisation:** `useWindowedAudioData` + `visualizeAudio` from `@remotion/media-utils`. Pass `frame` down from the parent instead of calling `useCurrentFrame()` in children.

## Fonts

```ts
import { loadFont } from "@remotion/google-fonts/GoogleSans";
const { fontFamily } = loadFont("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });
```

The render waits for fonts automatically. Load fonts at module top level (as `templates/fonts.ts` does).

## 3D

`@remotion/three` gives you `<ThreeCanvas width height>`, which needs explicit lights. All motion must come from `useCurrentFrame()` (`useFrame` is forbidden), and any `<Sequence>` inside the canvas uses `layout="none"`.

## Composition metadata

The kit computes `durationInFrames` from the last word plus a 1.5 s tail in `Root.tsx`. For data-dependent dimensions or props, use `calculateMetadata` on the `<Composition>`.

## Studio

```bash
npx remotion studio            # live preview at http://localhost:3000/Explainer
```

Use the timeline to scrub beat by beat. Scenes appear as named sequences ("3. Routes").

## Rendering

```bash
# QA stills, one per beat, into out/qa/ (half size)
node scripts/qa-stills.mjs

# specific frames
npx remotion render Explainer out/frames --frames=0,90,300 --image-format=jpeg

# final video for TikTok, Reels or Shorts
npx remotion render Explainer out/explainer.mp4 --codec=h264 --crf=18
```

- Output is 1080×1920 at 30 fps, H.264 with AAC. Those defaults are right for TikTok, Instagram Reels and YouTube Shorts. Keep it under 3 minutes for Reels and Shorts.
- Platform UI covers the right edge (about 120 px) and the bottom (about 350 px) during playback. The presenter sits there by design. Keep text and important content out of those areas.
- `--scale=0.5` renders quick, low-resolution previews.

### Windows: "Failed to launch the browser process … ENOENT"

Remotion downloads `chrome-headless-shell` into `node_modules/.remotion/`. If the project path is long, the executable's full path exceeds Windows' 260-character limit and can't be launched. Fix one of these ways:

- Keep projects in a short path (for example `C:\dev\my-explainer`).
- Or use the installed Chrome:
  ```bash
  npx remotion render Explainer out/x.mp4 "--browser-executable=C:\Program Files\Google\Chrome\Application\chrome.exe" --chrome-mode=chrome-for-testing
  node scripts/qa-stills.mjs -- "--browser-executable=C:\Program Files\Google\Chrome\Application\chrome.exe" --chrome-mode=chrome-for-testing
  ```

Also on Windows, npm can fail to start when the working directory path itself is very long ("The directory name is invalid"). Use a short project path.

## Type checking

`npx tsc --noEmit`. The scaffold's `tsconfig.json` uses `lib: ["es2015"]`, so avoid newer built-ins such as `Array.prototype.includes`, `padStart`, `Object.entries` and `findLast` in components. Use `indexOf`, loops or simple helpers instead.
