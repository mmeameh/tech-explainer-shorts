# Scene library

Recipes for every kind of scene in the reference shorts. A scene is a component in `src/scenes/` that receives `SceneProps` (its beats and words) and is registered in `src/scenes/index.ts`. The shell provides the background and mode, and you lay out the content zone.

## Scene skeleton

```tsx
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Stage } from "../components/SceneShell";
import { Card } from "../components/Card";
import { enter } from "../lib/anim";
import type { SceneProps } from "../lib/timing";
import { sceneClock } from "../lib/timing";

export const MyScene: React.FC<SceneProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = sceneClock(props, fps); // t.at("word"), t.beat(i), t.end("word")
  return (
    <Stage>
      <Card title="messages" enterAt={t.at("table")}>…</Card>
      <div style={{ ...enter(frame, t.at("zero")) }}>0 lines of backend code</div>
    </Stage>
  );
};
```

Rules:

- Tie every reveal to a spoken word (`t.at`). Use a hard frame offset only for staggers (`t.at("x") + i * 4`).
- Inside a mockup, use `Stage` for centred layouts, or absolute positions in composition pixels when arrows need exact coordinates.
- Use one scene component per idea. Beats that continue the same visual share the scene id, so the scene keeps its state across caption pages.
- Mockup components read dark or light from the shell (`useMode()`), so the same component works in both modes.

## Kit components (`templates/components/`)

| Component | What it draws | Key props |
|---|---|---|
| `Card` | Panel with an optional mono header, icon and right meta | `title`, `icon`, `right`, `enterAt`, `glow`, `width` |
| `Badge` | Status pill such as "● Running" or "Unrestricted" | `color`, `solid`, `dot` |
| `HonestyLabel` | Bottom-left disclaimer | children |
| `DataTable` | Table with typed columns. Rows appear, light up (`hit`) or get blocked (`blocked`, red ✕). | `columns`, `rows[{cells, at, state, stateAt}]` |
| `SchemaCard` | Table name with a field and type list, fields can appear one by one | `fields[{name, type, at}]` |
| `CodeWindow` | Dark editor with tabs, line numbers, colouring and typewriter | `code`, `typeFrom`, `cps`, `highlightLines`, `statusBar`, `right` |
| `PhoneFrame` | iPhone shell at 9:41 | `width`, `screen`, `enterAt` |
| `ChatThread` | Group chat: header, bubbles, typing dots, draft typing | `messages[{from, text, at, mine}]`, `draft`, `typing`, `scale` |
| `Avatar`, `AvatarGroup` | Photo or coloured initials | `name`, `src`, `size` |
| `Cursor` | macOS pointer gliding between keyframes, click ripple | `path[{frame, x, y, click}]` |
| `FlowArrow` | Self-drawing connector, optional travelling packet and label | `from`, `to`, `start`, `curve`, `packetAt`, `packetLabel`, `dashed` |
| `SelectionBox` | The caption keyword box, reusable on any word | `mode`, `startFrame` |

Helpers in `lib/anim.ts`: `progress`, `enter`, `exit`, `windowed`, `typed`, `countUp`, `formatNumber`, `caretOn`.

## Format A recipes

The working examples are in `templates/scenes/examples/`: `Hook.tsx`, `Routes.tsx`, `Chat.tsx`, `Policy.tsx`.

1. **System hero (hook).** The finished stack assembles on the product name, with one stat counting up beneath. See `Hook.tsx`. A fancier version uses isometric layers: `transform: perspective(1200px) rotateX(55deg) rotateZ(-45deg)` on a stack of discs or cards, each lifted with `translateZ` as it's named.
2. **Dashboard form.** A `Card` with label-and-input rows. Values type in with `typed()`, a password shows as dots plus a "This password is strong" bar, the cursor glides to the primary button and clicks, and the button darkens for 4 frames.
3. **Server or hardware.** A dark box with a top vent (`repeating-linear-gradient` stripes), round fans (`conic-gradient` blades plus a `rotate` driven by frame), LEDs (small glowing dots that blink with `Math.floor(frame/10)%2`), a nameplate (logo and region `eu-central-1`) and a white "price tag" card on a thin tether line. Open the lid (scale Y) to reveal a chip such as "PostgreSQL / open source" on a circuit board with green traces.
4. **Schema reveal.** `SchemaCard` with fields `at` successive words ("id… room_id… user_id").
5. **The pain.** `CodeWindow` typing boilerplate quickly (`cps` 60–80), the `right` meta counting lines up (`countUp` to 42), and the presenter crying. See `Routes.tsx`, beat 1.
6. **The automatic replacement.** The ugly thing fades out on the next beat, and the clean mechanism builds in with arrows (`FlowArrow`) to what it serves. See `Routes.tsx`, beat 2.
7. **The app working.** `PhoneFrame` + `ChatThread` with the matching `DataTable` gaining a row as each message sends, plus a "0 lines of backend code" line. See `Chat.tsx`.
8. **DevTools.** A dark `Card` with a tab strip (Elements, Console, Sources, Network, Application) and a request list on the left. On the right go headers: Request URL, `Status Code ● 200 OK`, `apikey sb_publishable_…` in brand colour. For the Sources variant, show minified code with the key line under a `SelectionBox`. Name the window after the example: "DevTools · chatty.app/r/weekend-trip".
9. **Auth.** A phone sign-in form ("Signing in…") with an arrow to an auth service card (`/auth/v1/token`), returning a token card (`eyJhbGciOi…`, `sub 7f3a…c21`) beside the user's avatar.
10. **Policy and RLS.** A request card, a policy bar `policy SELECT using (auth.uid() = any(members))`, and rows blocking or passing in sequence. See `Policy.tsx`. The storage variant uses `storage.objects` with `owner_id = auth.uid()::text`. The owner sees the photo and the stranger gets a blurred card (`filter: blur(12px)`).
11. **Append-only log (WAL).** A paper-coloured card ("Write-ahead log", file name `pg_wal/0000…17` at right, a bookmark ribbon). New entries slide in at the bottom (`LSN 0/1A2B3C8 · INSERT · messages · id 1044` with a body excerpt). Older entries shrink and fade upward, and the newest is boxed in brand colour.
12. **Fan-out.** One source card (for instance "Supabase Realtime + elixir") with packets travelling along `FlowArrow`s to 3 phone thumbnails that update in turn. Stagger the packets 4 frames apart.
13. **Timer and backup.** An SVG ring countdown (`strokeDashoffset` driven by frame, label `2:00`) beside the log card. When it completes, the log card copies into an S3 bucket icon with a ghost duplicate.
14. **Globe with regions.** The cheap way: an SVG circle with a radial-gradient "earth" plus an equirectangular map image clipped to the circle, panned horizontally by frame. The rich way: `@remotion/three` with a sphere and a public-domain earth texture (NASA Blue Marble) in `public/`. Pins are HTML cards positioned at projected coordinates ("Frankfurt eu-central-1", "read replica ap-northeast-1"), with an arc between them and the user avatar near Tokyo.
15. **Function cards.** Stacked rows of name, secret and result: `send-push` with a notification preview, `charge` with a Stripe "$9.00 ✓ Succeeded", `summarize` with an AI summary bubble. A runtime bar sits underneath.
16. **Limits table.** A compute table (Micro → 16XL: vCPUs, memory, max connections) with the cursor sliding down the rows and the last cell highlighted.
17. **Overload.** A grid of connection slots filling fast. A memory bar fills, the counter goes to `500 / 500` in red (`counterDanger`), and a red error pill reads `FATAL: sorry, too many clients already` with a 6-frame horizontal shake (`translate` with a decaying `Math.sin`).
18. **Pooling funnel.** Dozens of client avatars (deterministic `random(seed)` positions) drift into a ring labelled with the pooler name and exit as a few bright lines into numbered connection slots (1…8, "+120 more"). A big client counter on the left (9,890) and a slot counter on the right (128).
19. **Recap stack.** Every layer as a labelled row in one tall panel, bottom (infra) to top (product), with the chat phone overlapping on the right. This is the most detailed frame of the video.
20. **Twist.** A light scene with a familiar consumer UI (a share sheet or DM) exposing the anti-pattern: a `users` table card with a red "RLS Unrestricted" badge and "2,184 rows". The presenter waves.

## Format B recipes

21. **Hand and device.** A phone held in a gloved hand. Use AI-generated stills (`public/scene/glove-hand.png` with a transparent screen area) layered over a live, code-built phone UI, so the screen content can animate. Add snow or rain particles in front.
22. **Magnified cross-section.** Horizontal bands from top to bottom: glass (translucent white gradient with a highlight line), electrodes (small rounded bars), field lines, an RGB pixel row (`repeating-linear-gradient` red, green, blue cells) and a dark backplate. Label layers with uppercase letter-spaced text and 2 px leader lines. Add the `HonestyLabel` "Magnified illustration".
23. **Field lines.** Each electrode emits 3–4 nested SVG arcs (gold, 2 px, 60% opacity). When the finger approaches, interpolate each arc's control point toward the fingertip so the lines bend into it, and brighten the captured ones. A pen tip leaves them untouched.
24. **Ions and particles.** Circles labelled Na⁺ and Cl⁻ inside a finger silhouette, jittering with `random()`-seeded sine offsets (deterministic).
25. **Value grid.** An isometric diamond grid with a mono number at each crossing. The numbers near the contact drop (100 → 88 → 62) with a radial falloff. White circles mark the detected centre, and two clusters show multi-touch. Add "Values illustrative".
26. **Material macro.** Knit fibres or conductive thread as repeated SVG loop paths with a subtle normal-map look (two offset strokes, light and dark).
27. **Meta ending.** Shrink the final scene into a social-app UI frame (side action icons, a "Following" pill, the audio line) with the twist effect overlaid (water drops: blurred circles with a highlight and refraction ring).

## Deterministic randomness

Never use `Math.random()`. Use `random("seed-" + i)` from `remotion`, which returns the same value on every render, for particle positions, avatar scatter and jitter.

## Assets

- **Logos:** use SVGs from the product's press kit, or Simple Icons (`https://cdn.simpleicons.org/<name>/<hex>`). Save them to `public/logos/` and load them with `<Img src={staticFile("logos/postgres.svg")} />`.
- **Person photos for chat avatars:** use only generated or licensed faces, never real private people. Coloured-initials `Avatar` is always fine.
- **Illustrations (Format B):** generate stills with the image tools, remove backgrounds, and animate them with transforms. Keep the light direction consistent (top-left) across assets.
