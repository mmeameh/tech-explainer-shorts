#!/usr/bin/env node
// Word timings for audio you already have (your own recording, or any TTS)
// using local whisper.cpp, aligned back onto the words in script.json so the
// [emphasis] marks and beat boundaries survive. No API key needed.
//
// One-time: npx remotion add @remotion/install-whisper-cpp   (and ffmpeg on PATH)
// Usage: node scripts/align-whisper.mjs script.json path/to/audio.mp3 [--model medium.en] [--out src/data/timeline.ts]
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { alignToHeard, buildTimeline, fillGaps, loadScript, parseArgs, tokenize, writeTimeline } from "./lib/script.mjs";

const WHISPER_VERSION = "1.5.5";

const args = parseArgs(process.argv.slice(2));
const [scriptFile = "script.json", audio] = args._;
if (!audio || !fs.existsSync(audio)) {
  console.error("Usage: node scripts/align-whisper.mjs script.json path/to/audio.mp3");
  process.exit(1);
}
const mod = await import("@remotion/install-whisper-cpp").catch(() => null);
if (!mod) {
  console.error("Missing package. Run: npx remotion add @remotion/install-whisper-cpp");
  process.exit(1);
}
const { downloadWhisperModel, installWhisperCpp, toCaptions, transcribe } = mod;
const model = args.model ?? "medium.en";
const script = loadScript(scriptFile);
const { tokens } = tokenize(script);

const whisperPath = path.join(process.cwd(), "whisper.cpp");
await installWhisperCpp({ to: whisperPath, version: WHISPER_VERSION });
await downloadWhisperModel({ model, folder: whisperPath });

const wav = path.join(os.tmpdir(), `voiceover-${Date.now()}.wav`);
execFileSync("ffmpeg", ["-y", "-i", audio, "-ar", "16000", "-ac", "1", wav], { stdio: "ignore" });
const whisperCppOutput = await transcribe({
  model,
  whisperPath,
  whisperCppVersion: WHISPER_VERSION,
  inputPath: wav,
  tokenLevelTimestamps: true,
});
fs.rmSync(wav, { force: true });
const { captions } = toCaptions({ whisperCppOutput });
const timings = alignToHeard(tokens, captions);
const missed = tokens.filter((_, i) => !timings[i]);
fillGaps(timings);

const ext = path.extname(audio).toLowerCase() || ".mp3";
const voiceName = `voiceover${ext}`;
fs.mkdirSync("public", { recursive: true });
fs.copyFileSync(audio, path.join("public", voiceName));
writeTimeline(args.out ?? "src/data/timeline.ts", script, buildTimeline(script, tokens, timings), voiceName, "align-whisper.mjs");
console.log(`Matched ${tokens.length - missed.length}/${tokens.length} words; the rest were interpolated.`);
const missedKeywords = missed.filter((t) => t.emphasis).map((t) => t.text);
if (missed.length) console.log(`Unmatched: ${missed.map((t) => t.text).join(" ")}`);
if (missedKeywords.length) console.log(`Check these [keywords] in Studio: ${missedKeywords.join(", ")}`);
