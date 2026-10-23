# Style guide

Measured from the two reference shorts (rendered at 720×1280 and scaled here to 1080×1920). The tokens live in `templates/theme.ts`. Change `accent.brand` per topic and leave the rest alone, so every video in a series looks like a series.

## Canvas and zones

- 1080×1920, 30 fps, H.264. Length is 60–160 s.
- Side safe margin is 60 px. No text sits outside x 60–1020.

| Zone | y (px) | What lives there |
|---|---|---|
| Caption | 315–520 | Kinetic captions. The first line's centre is always at y ≈ 360, and a second line grows downward. |
| Timeline (A) | 560–640 | Logo, chapter stepper, counter |
| Content | 680–1330 | The scene |
| Presenter (A) | 1360–1920 | Avatar, waist-up, about 600 px tall, centred, cut off by the bottom edge |
| Honesty label | x 60, bottom ≈ 440 | Small white text with a shadow |

Format B (cinematic) keeps only the caption zone fixed. Its illustration fills the whole frame, including behind the captions.

## Backgrounds

- **Dark:** `#0d0e10` with a 54 px grid at 3.5% white, plus a vignette that darkens the corners.
- **Light:** `#f6f6f4` with the same grid at 4.5% black and a very soft vignette.
- **Alternation rule:** dark for the system's insides (servers, databases, security, logs, physics close-ups). Light for the developer's or user's side (code you'd have to write, the app working, the punchline). The switch itself resets attention, so change mode at chapter or idea boundaries, never mid-sentence.

## Typography

| Use | Font | Size | Weight |
|---|---|---|---|
| Captions | Google Sans | 78 | 500 for spoken words, 700 for the current word and keywords |
| Scene headline (rare) | Google Sans | 84 | 700 |
| UI text in mockups | Google Sans | 22–40 | 400–700 |
| Data, code, labels, counters, timeline | JetBrains Mono | 15–36 | 500–700 |
| Honesty labels | Google Sans | 24 | 500 |

The minimum anywhere is 22 px, except the timeline labels (15 px uppercase, letter-spaced, as in the reference).

## Captions

- Words appear on their exact start time. Each one fades and rises 14 px over 4 frames.
- **Colours:** spoken words take `dim` (`#7c8087` dark, `#9b9ca0` light). The current word takes `text` (`#f7f7f7` dark, `#0b0b0c` light).
- **Keyword selection box:** a 3 px `#3b82f6` border, with fill `rgba(37,99,235,.30)` on dark and `rgba(59,130,246,.14)` on light. It draws left to right over 5 frames. Then two 22 px handles (blue fill, white ring) pop in at the top-left and bottom-right corners. The box stays until the page changes. Use about one keyword per page, two at most.
- **Pages:** at most 7 words, about 40 characters, and 2 lines. A page always breaks at a beat boundary or at `. , ? ! ; : …`, and never ends on a filler word (a, the, your, to, of, and…). The page stays up until the next one starts, so there are no blank gaps.
- An emoji can lead a word for flavour: "💧 salty", "💦 wet hands". Use it once or twice per video at most.
- There is no background pill and no stroke. Contrast comes from the background scene being calm behind the caption zone.

## Chapter timeline (Format A)

- Layout: logo on the left, the stepper across the middle, and the counter on the right.
- **Nodes:** done nodes are filled brand colour. The current node is bigger and filled, with a 6 px brand halo and glow. Upcoming nodes are hollow `faint` rings. The connecting line fills to the current node over 14 frames.
- **Labels:** uppercase mono, 15 px, letter-spacing .06em, brand when done, `dim` when upcoming. A label may wrap to two lines ("BACKUP + REPLICA").
- **Counter:** a mono 36 px bold number with a small `dim` label underneath ("messages", "connections"). It counts to each new value over 18 frames and turns red (`#ef4444`) when the story hits a limit. It persists through the whole video, so it acts as a running scoreboard of the example app's growth.
- It appears with the first chapter. The hook comes before it, and it can be hidden for the punchline (`hideTimeline`).

## Colour semantics

| Colour | Meaning |
|---|---|
| Brand (`#3ECF8E` in the reference) | Active, done, success, data flowing, "this row passes" |
| Red `#ef4444` | Errors, limits, blocked rows, `FATAL`, an "Unrestricted" badge |
| Blue `#3b82f6` | Only the caption selection box and its handles |
| Link blue `#2f6fde` | Foreign keys and ids in tables, links |
| Gold `#f5c542` | Invisible physical things made visible (charge, field lines), Format B only |
| Grey | Inactive, past, upcoming |

## Cards and UI mockups

- **Radius:** 18–20 for cards and 12 for inner panels. Border is 2 px (`rgba(255,255,255,.09)` on dark, `rgba(0,0,0,.08)` on light). Shadows are deep on dark and soft on light.
- **Headers:** mono bold 30 px with an icon on the left (the table icon for tables), and metadata on the right in `dim` ("0 rows", "42 lines", "Postgres").
- **Data:** real-looking values that stay consistent across scenes, such as ids 1039–1044, room 42, the user `7f3a…c21`, times 18:40–18:42, and keys like `sb_publishable_9xQ…`. Truncate ids with `…`.
- **Phones:** iPhone shape, 9:41, the dynamic island, and the running example's chat (#weekend-trip, 4 members).
- **Editors:** dark even in light scenes, with traffic lights, a path, tabs and a blue status bar.
- **Brand marks:** use the real logo only for the product the video is about and the infrastructure it truly runs on (AWS, Postgres, Elixir, Rust, Go). Never imply an endorsement.

## Motion

- The default easing is `Easing.bezier(0.16, 1, 0.3, 1)` (fast out, soft settle).
- **Enter:** fade with a 24 px rise and scale from .96 to 1 over 10 frames. Stagger siblings by 3–4 frames.
- **Exit:** a quick fade over 6–8 frames, or let the next scene cut over it. Scene changes are hard cuts on the word. The cut is the transition.
- Something small is always moving: a counter ticking, a caret blinking, a packet travelling, the presenter breathing. Nothing big moves unless the narration names it.
- Visual density rises through the video. Each chapter adds a layer, and the recap shows every layer at once.

## Honesty labels

Use small labels at bottom-left whenever the picture isn't literal: `Magnified illustration`, `Values illustrative`, `Charge shown in gold, invisible to the eye`, `The wires are transparent in a real phone`. They build trust and pre-empt "well actually" comments.

## Format B extras (cinematic)

- Full-bleed, near-black backgrounds with subtle bokeh or particles (snow, rain, dust) driven by `random(seed)`.
- **Magnified cross-sections** stack layers (glass, sensor grid, RGB pixel row, backplate), labelled with uppercase letter-spaced white text and thin vertical leader lines (`WIRES`, `GLASS`).
- **Physical phenomena:** gold arcs for fields, white circles for detected points, and per-cell numbers that drop near a touch (100 → 88 → 62).
- Real objects (finger, glove, pen, phone in hand) are rendered illustrations or AI-generated stills, animated with transforms. They should look tactile, with knit textures and fingerprint ridges.
- Close on a meta twist, such as the video itself playing inside a social app UI.
