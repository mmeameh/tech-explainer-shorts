// Google Sans for captions and UI, JetBrains Mono for labels, numbers and code.
import { loadFont as loadSans } from "@remotion/google-fonts/GoogleSans";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

export const { fontFamily: sans } = loadSans("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});

export const { fontFamily: mono } = loadMono("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});
