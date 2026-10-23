#!/usr/bin/env node
// Renders one JPEG per beat (60% of the way through it) into out/qa/ so every
// caption page and its visual can be reviewed without watching the video.
//
// Usage: node scripts/qa-stills.mjs [--comp Explainer] [--fps 30] [--scale 0.5] [-- <extra remotion flags>]
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "./lib/script.mjs";

const argv = process.argv.slice(2);
const split = argv.indexOf("--");
const passthrough = split >= 0 ? argv.slice(split + 1) : [];
const args = parseArgs(split >= 0 ? argv.slice(0, split) : argv);
const comp = args.comp ?? "Explainer";
const fps = Number(args.fps ?? 30);
const { beats } = await import(pathToFileURL(path.resolve("src/data/timeline.ts")).href);
const frames = beats.map((b) => Math.round(((b.startMs + (b.endMs - b.startMs) * 0.6) / 1000) * fps));
console.log(beats.map((b, i) => `${String(frames[i]).padStart(5)}  ${b.id}: ${b.text}`).join("\n"));
const r = spawnSync(
  "npx",
  [
    "remotion",
    "render",
    comp,
    "out/qa",
    `--frames=${frames.join(",")}`,
    "--image-format=jpeg",
    "--jpeg-quality=85",
    `--scale=${args.scale ?? 0.5}`,
    ...passthrough.map((a) => (/\s/.test(a) ? `"${a}"` : a)),
  ],
  { stdio: "inherit", shell: true },
);
process.exit(r.status ?? 1);
