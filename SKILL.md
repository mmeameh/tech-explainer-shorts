---
name: tech-explainer-shorts
description: Produce animated vertical (9:16) tech-explainer shorts for TikTok, Reels and YouTube Shorts in the style of the speedy_devv explainers. That means word-by-word kinetic captions with a Figma-style selection box on keywords, a cartoon presenter who gestures on cue, a chapter progress timeline with a live counter, code-built UI mockups (phones, code editors, DevTools, database tables, server racks) and magnified cross-section illustrations, all driven by a narrated "build it up layer by layer" story. One skill covers the whole pipeline: research, script and beat sheet, TTS voiceover with word timings, captions, the avatar pose set, Remotion scenes, sound and rendering. Use when the user asks for an explainer short, a "how X works" or "let's design X" video, a Reel or TikTok about a product, system or piece of tech, or "a video like speedy_devv".
---

# Tech explainer shorts

Makes 60–160 second vertical explainer videos in which every sentence of narration lands on screen at the same moment as a precise, real-looking visual. The look and the pipeline come from studying two reference shorts:

- **"Let's design Supabase"** (154 s). This is **Format A: architecture build-up**, with a presenter avatar, a chapter timeline (SERVER → API → SECURITY → STORAGE → LIVE → BACKUP + REPLICA → FUNCTIONS → VIRAL), a running counter and code-built UI mockups.
- **"How touchscreens work"** (85 s). This is **Format B: cinematic how-it-works**, with no presenter or timeline. It uses full-bleed magnified illustrations (finger, glass, wire grid, field lines, ions) and honesty labels ("Magnified illustration", "Values illustrative").

Both formats share the same caption system, typography, pacing and story shape.

## Skills bundled here

| Technique seen in the videos | Where it lives |
|---|---|
| Story shape: hook, running example, chapter build-up, recap, twist ending | [references/storytelling.md](references/storytelling.md) |
| Visual spec: layout zones, colours, type, caption behaviour, motion timings | [references/style-guide.md](references/style-guide.md) |
| TTS voiceover with word-level timings (ElevenLabs, any TTS + Whisper, or a self-recording) | [references/voice-and-captions.md](references/voice-and-captions.md), `scripts/` |
| Kinetic captions with the selection box | `templates/components/KineticCaptions.tsx` |
| Chapter timeline with a live counter | `templates/components/ChapterTimeline.tsx` |
| Cartoon presenter with gesture poses and mouth flap | [references/presenter-avatar.md](references/presenter-avatar.md), `templates/components/Presenter.tsx` |
| UI mockups: cards, tables, schema, code editor, phone chat, cursor, flow arrows | [references/scene-library.md](references/scene-library.md), `templates/components/` |
| Magnified illustrations, globe, particles, field lines, value grids | [references/scene-library.md](references/scene-library.md#format-b-recipes) |
| Remotion engine rules (v4.0.5xx): animation, media, fonts, 3D, rendering, Windows fixes | [references/remotion-essentials.md](references/remotion-essentials.md) |
| Sound: voiceover, UI ticks, whooshes, ducked music bed | [references/voice-and-captions.md](references/voice-and-captions.md#sound-design) |

## Pipeline

Work through these in order. Each step leaves a file behind, so a later session can resume.

1. **Brief.** Settle the topic, format (A or B), target length, the one running example (for instance "a group chat app called *chatty*", or "answering a call in winter gloves") and the brand accent colour. Ask only for what you can't infer. Default to Format A for software and systems and Format B for physics and hardware.
2. **Research.** Get every on-screen fact right: real endpoint paths, real SQL, real limits, real component names. Anything simplified gets an on-screen label (`Values illustrative`). Accuracy is the brand.
3. **Script and beat sheet → `script.json`.** See [storytelling.md](references/storytelling.md). One beat is one caption page (2–7 words) plus one visual change. Mark keywords with `[brackets]`, and fix pronunciation with `{shown|spoken}`. Each beat names its `scene`, `mode` (dark/light), presenter `pose` and, for Format A, `chapter` and `counter`.
4. **Project.** Scaffold Remotion in a **short path** (long Windows paths break rendering) and copy the kit:
   ```bash
   npx create-video@latest --yes --blank --no-tailwind my-explainer && cd my-explainer && npm i
   npx remotion add @remotion/media @remotion/google-fonts @remotion/media-utils
   rm src/Composition.tsx
   cp -r "<skill-dir>/templates/." src/ && cp -r "<skill-dir>/scripts" .
   mv src/script.example.json script.json        # then rewrite it for the topic
   ```
   `<skill-dir>` is the directory containing this SKILL.md. The kit compiles and renders as-is, using the sample script.
5. **Timings → `src/data/timeline.ts`** (plus `public/voiceover.*` when there is audio):
   - Draft with no audio: `node scripts/fake-timings.mjs script.json`
   - With an ElevenLabs key: `node scripts/tts-elevenlabs.mjs script.json`
   - With the user's recording or any other TTS: `node scripts/align-whisper.mjs script.json audio.mp3`
6. **Presenter poses (Format A) → `public/avatar/<pose>.png`.** Make one consistent character (the user's own, not the reference creator's) in about 12 poses with transparent backgrounds. See [presenter-avatar.md](references/presenter-avatar.md). For Format B, set `"format": "B"` in `script.json`.
7. **Scenes.** Write one component per `scene` id in `src/scenes/` and register it in `src/scenes/index.ts`. Unregistered ids show a placeholder, so the whole video previews from day one. Time every reveal to the word that names it with `sceneClock(props, fps).at("word")`. Start from `src/scenes/examples/` (Hook, Routes, Chat, Policy) and the recipes in [scene-library.md](references/scene-library.md).
8. **Sound.** The voiceover is wired in. Add UI ticks, scene whooshes, and an optional music bed ducked under speech ([voice-and-captions.md](references/voice-and-captions.md#sound-design)).
9. **QA, then render.**
   - Run `node scripts/qa-stills.mjs`. It writes one still per beat into `out/qa/`. Read every still against the checklist below and fix what fails.
   - Preview in `npx remotion studio`.
   - Render the final video with `npx remotion render Explainer out/explainer.mp4 --crf=18`.

## Non-negotiables of the style

- **Captions drive everything.** Words appear one at a time as they are spoken. Spoken words turn grey, and the current word is bold white (dark scenes) or near-black (light scenes). A `[keyword]` gets the blue selection box with corner handles and keeps it until the page changes. Captions are centred in the same spot all video, with no background pill.
- **The visual changes on the word, not near it.** Cue reveals with `t.at("word")`. Scene changes are hard cuts on the first word of the beat.
- **One running example** carries the whole video (chatty / #weekend-trip / Mei, Lucas, Sofia, Daniel), with consistent ids, names and times across scenes.
- **Real-looking UI, built in code**: dashboard forms, DevTools panels, editors, tables with column types, phones at 9:41. Use real brand marks only for the product being explained and what it truly runs on.
- **Dark and light scenes alternate.** Dark is for the system's insides and light is for the user's or developer's side. Both get a faint grid.
- **The timeline and counter persist** in Format A. The counter keeps counting and turns red at a limit.
- **The presenter reacts** in Format A: points at what's introduced, a stop-hand for security, cries at pain, a fist pump at wins, a shrug at the recap, a wave at the end.
- **Honesty labels** go small at bottom-left whenever a picture isn't literal.
- **End on a twist** that reframes the hook.

## Layout at 1080×1920, 30 fps

| Zone | y range | Contents |
|---|---|---|
| Caption | 315–520 | Kinetic captions, centred, 2 lines max, 78 px |
| Timeline (A) | 560–640 | Logo, chapter nodes and labels, counter at right |
| Content | 680–1330 | The scene (`<Stage>` fills this zone) |
| Presenter (A) | 1360–1920 | Avatar waist-up, cropped by the bottom edge |

Format B drops the timeline and presenter. Its illustration fills the frame and only the caption zone stays fixed.

## Kit layout (after copying into a project)

```
script.json                    # beat sheet: the source of truth for narration
scripts/                       # fake-timings, tts-elevenlabs, align-whisper, qa-stills
public/voiceover.mp3           # written by the TTS or align script
public/avatar/<pose>.png       # Format A presenter
src/
  Root.tsx  Explainer.tsx      # composition: scenes on the narration timeline + overlays
  theme.ts  fonts.ts           # tokens (swap accent.brand per topic), Google Sans + JetBrains Mono
  lib/timing.ts  lib/anim.ts   # word/beat clocks, animation helpers
  components/                  # captions, timeline, presenter, cards, tables, editor, phone, chat, cursor, arrows
  scenes/index.ts              # scene registry; scenes/examples/ for patterns
  data/timeline.ts             # generated: meta, beats, words (never edit by hand)
```

## QA checklist (check every still)

- [ ] The caption is readable, 2 lines max, centred, and clear of the timeline. The keyword box hugs its word with handles at the corners.
- [ ] What the current word names is on screen at that moment.
- [ ] Nothing important sits outside x 60–1020, and no text is under 22 px (timeline labels excepted).
- [ ] The timeline node and counter value are right for this moment.
- [ ] The presenter pose fits the line and doesn't cover content.
- [ ] Data is plausible and consistent across scenes.
- [ ] Simplified or magnified visuals carry a label.
- [ ] The final beat lands the twist and holds about 1.5 s.

## Recovering from common problems

- **Captions drift from the audio.** Regenerate `timeline.ts` from the final audio. Never shift timings by hand.
- **The keyword box is missing or on the wrong word.** Check the brackets in `script.json`. `align-whisper` prints unmatched keywords.
- **`sceneClock: "x" not spoken in scene`.** The cue word isn't in that scene's beats. The error lists the words that are.
- **Flicker in the render.** Something animates without `useCurrentFrame()`: a CSS transition, `Math.random()`, or a three.js `useFrame`.
- **Windows: browser launch fails with ENOENT, or npm says "The directory name is invalid".** The project path is too long. Move it somewhere short, or pass the installed Chrome as described in the Windows section of [remotion-essentials.md](references/remotion-essentials.md).
- **No TTS key.** Ask for an ElevenLabs key, or have the user record the script and use `align-whisper.mjs`. Meanwhile, build everything on `fake-timings.mjs`.
