// Scene registry: every `scene` id used in script.json maps to a component.
// Unknown ids render <MissingScene>, which shows the beat text as a placeholder.
import type React from "react";
import type { SceneProps } from "../lib/timing";
import { Chat } from "./examples/Chat";
import { Hook } from "./examples/Hook";
import { Policy } from "./examples/Policy";
import { Routes } from "./examples/Routes";

export { MissingScene } from "./MissingScene";

export const SCENES: Record<string, React.FC<SceneProps>> = {
  Hook,
  Routes,
  Chat,
  Policy,
};
