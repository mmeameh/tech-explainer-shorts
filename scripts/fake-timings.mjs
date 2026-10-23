#!/usr/bin/env node
// Estimated word timings with no audio, so every scene can be built and
// reviewed before the voiceover exists. Replace with tts-elevenlabs.mjs or
// align-whisper.mjs once you have audio.
//
// Usage: node scripts/fake-timings.mjs [script.json] [--wps 2.7] [--out src/data/timeline.ts]
import { buildTimeline, loadScript, parseArgs, tokenize, writeTimeline } from "./lib/script.mjs";

const args = parseArgs(process.argv.slice(2));
const script = loadScript(args._[0] ?? "script.json");
const { tokens } = tokenize(script);
const wps = Number(args.wps ?? 2.7); // the reference narration runs ~160 wpm

let t = 300;
const timings = tokens.map((tok, i) => {
  const letters = tok.spoken.replace(/[^\p{L}\p{N}]/gu, "").length;
  const dur = (1000 / wps) * Math.min(1.8, Math.max(0.6, letters / 5));
  const timing = { startMs: t, endMs: t + dur * 0.9 };
  t += dur;
  if (/[.!?…]$/.test(tok.text)) t += 380;
  else if (/[,;:—]$/.test(tok.text)) t += 180;
  const next = tokens[i + 1];
  if (next && next.beat !== tok.beat) t += 120;
  return timing;
});

writeTimeline(args.out ?? "src/data/timeline.ts", script, buildTimeline(script, tokens, timings), null, "fake-timings.mjs");
console.log("Timings are estimates. Voiceover is null, so the video renders silent.");
