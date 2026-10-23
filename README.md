# tech-explainer-shorts

A Claude Code skill for making animated vertical (9:16) tech-explainer shorts for TikTok, Reels and YouTube Shorts. It covers word-by-word kinetic captions with a selection box on keywords, a chapter timeline with a live counter, a gesturing presenter avatar, code-built UI mockups (phones, editors, DevTools, database tables), and a narrated "build it up layer by layer" story.

The style is reverse-engineered from the speedy_devv explainer shorts. The skill bundles the whole pipeline: script and beat sheet, TTS voiceover with word timings, captions, presenter poses, Remotion scenes, sound, and QA renders.

## Install

```bash
git clone https://github.com/mmeameh/tech-explainer-shorts ~/.claude/skills/tech-explainer-shorts
```

Claude Code picks it up automatically. Ask for something like "make an explainer short about how DNS works", or run `/tech-explainer-shorts`.

## What's inside

| Path | Contents |
|---|---|
| `SKILL.md` | Entry point: pipeline, style rules, layout, QA checklist |
| `references/` | Style guide, storytelling, voice and captions, presenter avatar, scene recipes, Remotion essentials |
| `templates/` | A Remotion kit (React/TypeScript) to copy into a project's `src/`: composition, captions, timeline, presenter, mockup components, example scenes, sample script |
| `scripts/` | Node scripts that turn `script.json` into word timings: ElevenLabs TTS, Whisper alignment for any audio, estimated timings, and per-beat QA stills |

## Requirements

- Node.js 20+ and a Remotion 4 project (`npx create-video@latest`)
- ffmpeg (needed for Whisper alignment)
- Optional: an ElevenLabs API key for voiceover with exact word timings
- Optional: an image-generation tool for the presenter's pose set
