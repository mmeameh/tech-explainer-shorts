# Storytelling and the beat sheet

The visuals only work if the script is written for them. Every sentence names something that can appear on screen at that instant.

## The shape both reference videos share

1. **Hook (0–5 s).** Promise the whole thing in one line, and show the destination right away.
   - Format A opens with "Let's design *X*." over the finished system and one striking stat.
   - Format B opens with a relatable scene ("Imagine it's winter…") and a small failure: the phone ignores a gloved finger.
2. **Running example.** A tiny, concrete world reused all video: a chat app called *chatty*, the channel #weekend-trip, and people named Mei, Lucas, Sofia and Daniel. Every abstract idea is shown through it, such as "Mei's token" or "Lucas's message".
3. **Build up layer by layer (chapters).** Each chapter is one component of the system, in the order the system needs it. The reference runs SERVER → API → SECURITY → STORAGE → LIVE → BACKUP + REPLICA → FUNCTIONS → VIRAL. Within a chapter:
   - **Need or pain:** what breaks without this layer. Show the ugly version: 42 lines of hand-written routes, a crying presenter.
   - **Mechanism:** what the layer actually does, shown literally with real names (PostgREST turns a URL into a SQL query, Realtime reads the write-ahead log).
   - **Payoff:** the running example works better, and the counter ticks up.
4. **Escalation.** The last chapter stress-tests everything ("goes viral"), so the counter hits a hard limit, flashes red with a real error message, and the clever fix appears (connection pooling).
5. **Recap.** One frame shows every layer stacked with the app running beside it, plus one summarising line.
6. **Twist ending.** A last line reframes the hook with a wink: the vibe-coded app with RLS off, or "wet hands". It's short and funny, and it invites comments and rewatches.

Format B uses the same skeleton but its "chapters" are layers of physics: glass, then the wire grid, then charge, then your finger's salt water, then measuring, then multi-touch, then why gloves fail, then the fix.

## Writing rules

- **One beat is one caption page plus one visual change,** 2–7 words, about 1–2.5 s.
- **Use short declarative sentences** that keep momentum ("Then, files." / "Every two minutes,"). Splitting a sentence across beats is good: the scene changes mid-sentence and pulls the viewer forward.
- **Mark one `[keyword]` per beat:** the noun or verb the visual depicts. That word gets the selection box and is the moment the visual appears.
- **Use exact, checkable specifics:** real endpoint paths, a real policy `using (auth.uid() = any(members))`, real limits ("16XL: 500 max connections"). Vague words like "fast" or "secure" don't animate.
- **Speak to "you", in the present tense,** and keep it conversational, slightly playful and confident.
- **Each chapter needs a pain-to-payoff pair.** The presenter's pose flips between them (cry, then fist pump).
- **Use callbacks:** reuse earlier objects (the same rows, the same token) in later chapters, so the system feels like one machine.
- **Pace:** about 160 wpm, with a visual change at least every 2.5 s. Most scripts land at 250–420 words for 100–160 s.
- **Write numbers as they should appear on screen** ("1,000,000 new databases / week"). If TTS reads them badly, use `{display|spoken}`.

## Hooks that work

- "Let's design *X*." (an architecture you think you know)
- "Imagine *everyday situation*." (a mystery from daily life)
- "*X* handles *huge number* every *unit*. Here's how." (scale)
- "Why does *familiar thing* *odd behaviour*?" (curiosity)

## script.json

```json
{
  "title": "Let's design Supabase",
  "format": "A",
  "voice": { "voiceId": "<elevenlabs voice id>", "model": "eleven_multilingual_v2", "speed": 1.05 },
  "chapters": ["SERVER", "API", "SECURITY", "STORAGE", "LIVE", "BACKUP + REPLICA", "FUNCTIONS", "VIRAL"],
  "counterLabel": "messages",
  "beats": [
    { "id": "hook", "say": "Let's design [Supabase].", "scene": "Hook", "mode": "dark", "pose": "point-up" },
    { "id": "server-1", "say": "First, a computer at [Amazon].", "scene": "Server", "mode": "dark", "pose": "point-side", "chapter": "SERVER", "counter": 0 },
    { "id": "api-1", "say": "Supabase runs [{PostgREST|Post-grest}],", "scene": "Rest", "mode": "light", "pose": "point-up", "chapter": "API", "counter": 1042 },
    { "id": "viral-3", "say": "and Postgres says [no.]", "scene": "Limit", "mode": "dark", "pose": "cry", "counter": 500, "counterLabel": "connections", "counterDanger": true },
    { "id": "twist", "say": "…whose vibe-coded app has no [{RLS|R L S}.]", "scene": "Twist", "mode": "light", "pose": "wave", "hideTimeline": true }
  ]
}
```

| Field | Meaning |
|---|---|
| `say` | Narration. `[...]` marks keywords and can span words. `{shown\|spoken}` shows one thing and says another. |
| `scene` | Component id in `src/scenes/index.ts`. Consecutive beats with the same scene and mode share one continuous `<Sequence>`. |
| `mode` | `dark` or `light` background for this beat |
| `pose` | Presenter pose file name (`public/avatar/<pose>.png`). `none` hides the presenter. Omit it to keep the previous pose. |
| `chapter` | Lights up that timeline node from this beat on (Format A) |
| `counter`, `counterLabel`, `counterDanger` | The counter's target value from this beat on, a label change, and red state |
| `hideTimeline` | Hides the timeline during this beat (the punchline) |

## Worked outline: "Let's design Supabase" (Format A, about 154 s)

| Chapter | Beats (paraphrased) | Visuals | Pose |
|---|---|---|---|
| Hook | Design Supabase, build a whole backend without writing one, using Supabase's managed pieces. | Isometric stack of all components, "1,000,000 new databases / week", an EC2 rack carrying table, auth and API cards | point-up, point |
| SERVER | Create a project, which is really a computer at Amazon running the open-source database Postgres. Next, a `messages` table. | Dashboard form with a cursor clicking "Create", a server rack with a price tag, the Postgres chip inside, a schema card | point, thumbs-up |
| API | Normally you'd write routes for every table (42 lines, crying). Instead, a server reads your tables and turns each URL into a SQL query automatically, so it works with zero backend code. | Editor typing, the PostgREST box with arrows to three tables, a phone chat working, "0 lines of backend code" | cry, point, fist |
| SECURITY | Every request carries a key, and anyone can read it from the bundle. What stops a stranger? A small token from Auth, then RLS: Postgres checks the policy on each row. | DevTools Network and Sources, a stranger's GET, sign-in, a JWT card, the policy bar, rows struck out | point, think, stop |
| STORAGE | Then files. Photos go to S3, with the same kind of rule on `storage.objects`. | Phone upload, policy card, the owner sees it and the stranger sees a blur | present, stop |
| LIVE | Then live. Every insert and update is written to Postgres's journal (the WAL), and Realtime reads that journal and pushes the change to every phone. | Typing, WAL entries with LSNs, the Realtime (Elixir) box fanning out to phones | point |
| BACKUP + REPLICA | Every two minutes the journal ships to S3. The journal also feeds a second copy near Tokyo for Mei. | 2:00 ring timer, WAL card, globe with Frankfurt and Tokyo pins | peace, think, point |
| FUNCTIONS | Some jobs can't run in the browser because the keys would leak. Those are Edge Functions (push, Stripe charge, AI summary) on Supabase's own Rust runtime. | Bundle with a key, three function cards, runtime bar | present |
| VIRAL | Even the biggest instance caps connections, so thousands of users fail. Supabase built Supavisor, which pools many clients into a few connections. | Pricing table, a 50×10 grid filling, `FATAL: sorry, too many clients already` with the counter red, the pooling funnel 9,890 → 128 | shocked, open-arms |
| Recap | All so you never write a backend. | Full stack plus the chat phone | shrug |
| Twist | …unless your vibe-coded app has no RLS. | A share sheet with the `users` table marked "Unrestricted, 2,184 rows" | wave, thumbs-up |

## Worked outline: "How touchscreens work" (Format B, about 85 s)

| Part | Beats (paraphrased) | Visuals |
|---|---|---|
| Hook | It's winter, a call comes in, and your gloved finger can't slide to answer. | Knitted glove holding a phone in snow, call screen |
| Hidden layer | Under the glass there's a grid of wires you can't see, everywhere. | Phone turns to a diamond wire grid. Label: the wires are transparent in a real phone. |
| Charge | Each crossing holds a tiny charge. | Macro of the grid with a gold charge arc. Label: charge shown in gold. |
| Finger vs pen | It reacts to a finger and ignores a pen, because it's measuring charge. | Cross-section with GLASS and WIRES labels and field lines; the pen does nothing |
| Why fingers work | Your finger is salty water (Na⁺, Cl⁻) and conducts. | Finger cross-section full of ions |
| Measuring | A bare fingertip steals some field and every crossing's value drops, so the phone finds the centre. | Numbers grid: 100s drop to 88, then 62 at the touch point. Values illustrative. |
| Multi-touch | Which is how it tracks two fingers. | Two circled clusters |
| Gloves | Pressing on the glass with wool insulates and nothing changes. Rain causes phantom touches. | Knit fibres at macro scale, raindrops on a map app |
| Fix | Conductive thread in the glove fingertip lets your screen feel it. | The call connects |
| Twist | …and it fails with wet hands. | The video playing in a Reels UI with water drops |
