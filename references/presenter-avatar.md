# Presenter avatar (Format A)

The reference uses a 2D vector cartoon presenter, waist-up at the bottom of the frame. He reacts to every line: pointing at what's introduced, a stop-hand for security, tears for painful boilerplate, a fist pump for wins, a shrug for the recap and a wave at the end. Those reactions are a large part of the charm, and they're cheap. It's one PNG per pose, swapped per beat.

**Make the user's own character.** That character is the reference creator's brand mascot, so don't copy it. A good default is a friendly caricature of the user, or of a mascot they choose, in the same flat vector style: clean outlines, soft cel shading, one signature accessory (glasses, a cap, a hoodie colour) and a solid-colour top that contrasts with both dark and light scenes.

## Pose set

Use the same canvas size, the same scale, and the head in the same position in every file. Only the arms, hands and face change.

| File (`public/avatar/`) | Use it for |
|---|---|
| `idle.png` | Neutral, slight smile (default before any `pose`) |
| `point-up.png` | Introducing a topic, "Let's…", "First," |
| `point-side.png` | Pointing up and to the side at the content zone |
| `present.png` | Palm-up "here it is", for revealing a solution |
| `thumbs-up.png` | Approval, "that's good" |
| `fist.png` | Win, payoff, "zero backend" |
| `stop.png` | Security, blocking, "no" |
| `think.png` | Hand on chin, for questions ("What stops…?") |
| `cry.png` | Pain, boilerplate, failure |
| `shocked.png` | Hitting a limit, an error |
| `open-arms.png` | Scale, "thousands of users" |
| `shrug.png` | Recap, irony |
| `peace.png` | Two of something, "every two minutes" |
| `typing.png` | Hands on an unseen keyboard, while typing |
| `wave.png` | Ending, goodbye, punchline |

Optional lip flap: `<pose>-talk.png`, the same image with the mouth open. With `talkFrames: true` the presenter alternates mouth open and closed every 3 frames while a word is being spoken, driven by word timings with no audio analysis.

## Making the poses with image generation

1. **Master image first.** Generate the character facing the camera in the neutral pose until the user likes it. Prompt skeleton:
   > Flat 2D vector cartoon of a friendly [description of the user or mascot], waist-up, facing camera, [signature accessory], solid [colour] crew-neck t-shirt, clean dark outlines, soft cel shading, centred, plain white background, no text.
2. **Every other pose from the master as a reference image,** using an image-edit model (Gemini or FLUX Kontext through the `generate-image` skill, Higgsfield, Adobe Firefly). Prompt it like this:
   > Same character, same outfit, same framing and scale, now [pointing up and to the right with the right index finger]. Keep the face, hair and colours identical. Plain white background.
3. **Remove backgrounds.** Use any background-removal tool (Adobe `image_remove_background`, Higgsfield `remove_background`, or `rembg`) and export transparent PNGs.
4. **Normalise the framing** so poses don't jump when swapped. Same canvas (for example 1000×1200), the character bottom-aligned, and the head at the same height. Check by flipping between files. ImageMagick does it in one line per file:
   ```bash
   magick in.png -trim +repage -resize x1150 -background none -gravity south -extent 1000x1200 public/avatar/<pose>.png
   ```
5. **Talk variants (optional):** edit each pose with "mouth open mid-word, nothing else changed".

## In the composition

`Presenter.tsx` reads `pose` from the beats. The last pose set stays until another beat sets one, and `"none"` hides the presenter. On each change it pops (rising 18 px and scaling from .97 to 1 over 8 frames), and it breathes continuously (±5 px at 0.35 Hz). Props on the `Explainer` composition:

- `avatarDir` (default `"avatar"`)
- `talkFrames` (default `false`)

Height is 600 px by default. Keep the content zone above y 1330 so the presenter never covers the scene.

## Without image generation

- Use Format B: no presenter, full-bleed visuals. It works well for physics and hardware topics.
- Or use a simple logo mascot, such as the product icon with two eyes, bouncing on beats. That's acceptable for a first video.
- Placeholders for layout work: coloured rectangles named after each pose (as in the test project) let you build and review everything before the art exists.
