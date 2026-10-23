# Voiceover, word timings and sound

Captions, scene cuts, the presenter's mouth and every `t.at("word")` cue all come from one file, `src/data/timeline.ts`. It holds the narration's words with start and end times in milliseconds. Four ways to produce it:

| Situation | Command | Timing quality |
|---|---|---|
| ElevenLabs key available (recommended) | `node scripts/tts-elevenlabs.mjs script.json` | Exact, from character alignment |
| Your own recording, or any other TTS | `node scripts/align-whisper.mjs script.json audio.mp3` | Very good, from local whisper.cpp |
| No audio yet | `node scripts/fake-timings.mjs script.json` | Estimated (about 2.7 words/s), for building scenes |
| Changed script text | Re-run the same command | Regenerates everything |

Every script reads `script.json`, keeps your `[keywords]` and beat boundaries, and writes `src/data/timeline.ts`. That file exports `meta`, `beats` and `words`, and you never edit it by hand.

## ElevenLabs (exact timings)

- Put `ELEVENLABS_API_KEY=...` in `.env`, or export it. Ask the user for their key, and never print it.
- The script calls `POST /v1/text-to-speech/{voice_id}/with-timestamps?output_format=mp3_44100_128`. The response holds `audio_base64` plus `alignment.characters`, `character_start_times_seconds` and `character_end_times_seconds`. Each word's start is its first character's start, and its end is its last character's end.
- The whole narration goes in one request (keep it under 9,500 characters; 160 s is about 2,300), so intonation flows across beats.
- **Voice:** pick an energetic, conversational, slightly fast voice. Set `script.voice.voiceId`, and optionally `"speed": 1.05`. The default `JBFqnCBsd6RMkjVDRZzb` is a premade voice, a placeholder until the user picks theirs.
- **Settings used:** stability .45, similarity_boost .8, style .3, and speaker boost on. Lower stability means more expressive delivery and more variance between takes.

## Any audio + whisper.cpp

- One-time setup: `npx remotion add @remotion/install-whisper-cpp`, with ffmpeg on PATH. The first run downloads whisper.cpp 1.5.5 and the `medium.en` model (about 1.5 GB) into `./whisper.cpp/`. Use `--model base.en` for a faster, rougher pass.
- The script transcribes with token-level timestamps and then aligns the heard words to the script's words. It joins split pieces ("Post" + "grest"), tolerates a few dropped or extra words, and interpolates anything unmatched. It prints any unmatched `[keywords]`, so check those in Studio.
- This is also how to use other TTS providers (OpenAI `gpt-4o-mini-tts`, Google, Azure, Edge): generate the MP3 with them, then align.
- The user's own voice usually makes the best video. Have them read the `say` lines (with the spoken halves of any `{shown|spoken}` pairs) in one take.

## Pronunciation: `{shown|spoken}`

TTS mangles product names and acronyms. Write `[{PostgREST|Post-grest}]`, `{RLS|R L S}`, `{SQL|sequel}`, `{1,000,000|a million}`, `{WAL|wall}`. The caption shows the left side, the voice says the right side, and the timings map back to the caption word.

## Captions in Remotion

`templates/components/KineticCaptions.tsx` renders from `words`.

- It groups words into pages: a break at punctuation, at beat changes, or at 7 words / 40 characters, never stranding a filler word.
- It shows each word at its `startMs`, keeps the last spoken word bright, and greys out earlier ones.
- It draws `<SelectionBox>` around words that had `[brackets]`.
- It takes its colours from the mode of the beat playing at that moment.

To use the box on non-caption text (say, highlighting a word inside a code line), import `SelectionBox` and put it inside a `position: relative` inline-block span.

## Scene cues from words

Inside a scene:

```tsx
const t = sceneClock(props, fps);
t.at("tables");      // frame (scene-relative) when "tables" starts
t.at("row", 2);      // the second "row" in this scene
t.end("policy");     // when "policy" ends
t.beat(1);           // start of the scene's 2nd beat
```

`at()` throws a clear error listing the scene's words if a cue word isn't spoken there. Typos surface immediately in Studio instead of silently mistiming.

## Sound design

Keep it subtle. The reference shorts are voice-first.

| Layer | Volume | Notes |
|---|---|---|
| Voiceover | 1.0 | `<Audio src={staticFile("voiceover.mp3")} />`, already wired in `Explainer.tsx` |
| Music bed | 0.06–0.10 | Light, rhythmic, no vocals. Duck to ~0.04 while words are spoken (see below). Fade in 0.5 s and out 1 s. |
| UI ticks | 0.25–0.35 | Card or row lands: `switch.wav` or `mouse-click.wav` |
| Transitions | 0.2–0.3 | Mode or scene change: `whoosh.wav` |
| Success | 0.3 | Payoff moment: `ding.wav` |
| Failure | 0.3 | Limit or error: a short buzz |

Remotion hosts free SFX at `https://remotion.media/{whoosh,whip,switch,mouse-click,ding,page-turn,shutter-modern}.wav`. More are at https://github.com/kapishdima/soundcn. For final renders, download what you use into `public/sfx/` so a render never depends on the network.

```tsx
import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";

// one SFX at a cue frame
<Sequence from={t.at("row")} durationInFrames={30} layout="none">
  <Audio src={staticFile("sfx/switch.wav")} volume={0.3} />
</Sequence>

// music bed ducked under speech (frame -> ms -> is a word playing?)
<Audio
  src={staticFile("music.mp3")}
  loop
  volume={(f) => (words.some((w) => w.startMs <= (f / fps) * 1000 && (f / fps) * 1000 < w.endMs) ? 0.04 : 0.08)}
/>
```

Use only music you have the rights to: royalty-free libraries, or music generated for the user.
