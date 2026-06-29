// src/config/cinematic.config.ts

import { TIMING, STAGGER, HOLD, BREATHING_RHYTHM } from "@/animations/timing";
import { EASING } from "@/animations/easing";
import { TRANSITIONS, type TransitionId } from "@/animations/transitions";
import {
  SPOTLIGHT_BEHAVIORS,
  SCENE_ENTRANCE,
  type SpotlightBehaviorId,
  type SceneEntranceId,
} from "@/animations/cinematic";
import {
  MOTION_HIERARCHY,
  MOTION_INTENSITY,
  resolveMotionDuration,
  getGSAPDefaults,
  getFramerDefaults,
  type MotionHierarchyLevel,
  type MotionIntensityLevel,
} from "./motion.config";
import { ATMOSPHERE, ATMOSPHERE_CSS_VARS } from "./theme.config";

/** Motion language descriptors — documentation + AI prompt context */
export const MOTION_LANGUAGE = {
  tone: [
    "dark",
    "ritualistic",
    "performative",
    "stage-like",
    "theatrical",
    "cinematic",
    "folk",
    "poetic",
    "traditional-material",
    "stagecraft",
    "water-puppet atmosphere",
    "Vietnamese editorial elegance",
  ],
  rhythm: "breathing",
  avoid: [
    "cartoon motion",
    "aggressive bounce",
    "flashy startup animation",
    "cyberpunk aesthetics",
    "SaaS dashboard feeling",
    "excessive glassmorphism",
  ],
} as const;

/** Master cinematic configuration */
export const CINEMATIC_CONFIG = {
  timing: TIMING,
  stagger: STAGGER,
  hold: HOLD,
  breathingRhythm: BREATHING_RHYTHM,
  easing: EASING,
  transitions: TRANSITIONS,
  spotlight: SPOTLIGHT_BEHAVIORS,
  sceneEntrance: SCENE_ENTRANCE,
  hierarchy: MOTION_HIERARCHY,
  intensity: MOTION_INTENSITY,
  atmosphere: ATMOSPHERE,
  language: MOTION_LANGUAGE,
} as const;

export type CinematicConfig = typeof CINEMATIC_CONFIG;

/** Convenience selectors */
export function getTransition(id: TransitionId) {
  return TRANSITIONS[id];
}

export function getSpotlightBehavior(id: SpotlightBehaviorId) {
  return SPOTLIGHT_BEHAVIORS[id];
}

export function getSceneEntrance(id: SceneEntranceId) {
  return SCENE_ENTRANCE[id];
}

/** Apply atmosphere CSS vars to a DOM element or React ref target */
export function applyAtmosphereVars(
  element: HTMLElement,
  overrides?: Partial<typeof ATMOSPHERE_CSS_VARS>,
): void {
  const vars = { ...ATMOSPHERE_CSS_VARS, ...overrides };
  for (const [key, value] of Object.entries(vars)) {
    element.style.setProperty(key, String(value));
  }
}

export {
  resolveMotionDuration,
  getGSAPDefaults,
  getFramerDefaults,
  ATMOSPHERE_CSS_VARS,
  type MotionHierarchyLevel,
  type MotionIntensityLevel,
};