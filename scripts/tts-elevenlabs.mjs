#!/usr/bin/env node
// Voiceover plus exact word timings in one call, via ElevenLabs
// /v1/text-to-speech/{voice}/with-timestamps (character-level alignment).
//
// Needs ELEVENLABS_API_KEY in the environment or ./.env.
// Voice: --voice <id>, script.voice.voiceId, or ELEVENLABS_VOICE_ID.
// Usage: node scripts/tts-elevenlabs.mjs [script.json] [--voice id] [--out src/data/timeline.ts]
import fs from "node:fs";
import path from "node:path";
import { buildTimeline, loadScript, parseArgs, readDotEnv, timingsFromAlignment, tokenize, writeTimeline } from "./lib/script.mjs";

const DEFAULT_VOICE = "JBFqnCBsd6RMkjVDRZzb"; // ElevenLabs premade "George"; pick your own

const args = parseArgs(process.argv.slice(2));
const script = loadScript(args._[0] ?? "script.json");
const env = { ...readDotEnv(), ...process.env };
const key = env.ELEVENLABS_API_KEY;
if (!key) {
  console.error("ELEVENLABS_API_KEY is not set. Put it in .env or the environment, or use align-whisper.mjs with your own audio.");
  process.exit(1);
}
const voiceId = args.voice ?? script.voice?.voiceId ?? env.ELEVENLABS_VOICE_ID ?? DEFAULT_VOICE;
const model = script.voice?.model ?? "eleven_multilingual_v2";
const { text, tokens } = tokenize(script);
if (text.length > 9500) {
  console.error(`Narration is ${text.length} characters; keep it under 9,500 for one request (a 160 s short is ~2,300).`);
  process.exit(1);
}

const voiceSettings = { stability: 0.45, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true };
if (script.voice?.speed) voiceSettings.speed = script.voice.speed;

console.log(`Generating ${text.length} characters with voice ${voiceId} (${model})…`);
const res = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`,
  {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({ text, model_id: model, voice_settings: voiceSettings }),
  },
);
if (!res.ok) {
  console.error(`ElevenLabs ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const data = await res.json();
fs.mkdirSync("public", { recursive: true });
fs.writeFileSync(path.join("public", "voiceover.mp3"), Buffer.from(data.audio_base64, "base64"));

const timings = timingsFromAlignment(text, tokens, data.alignment);

writeTimeline(args.out ?? "src/data/timeline.ts", script, buildTimeline(script, tokens, timings), "voiceover.mp3", "tts-elevenlabs.mjs");
console.log("Wrote public/voiceover.mp3");
