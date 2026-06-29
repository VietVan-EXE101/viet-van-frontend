// src/animations/cinematic.ts

import { TIMING, BREATHING_RHYTHM, STAGGER } from "./timing";
import { EASING } from "./easing";

export type SpotlightBehaviorId =
  | "singlePool"
  | "sweepLeftToRight"
  | "ritualCenterReveal"
  | "waterPuppetRipple"
  | "selectionHalo"
  | "processionalFollow";

export interface SpotlightBehavior {
  readonly id: SpotlightBehaviorId;
  readonly label: string;
  readonly duration: number;
  readonly ease: keyof typeof EASING;
  readonly properties: Readonly<Record<string, number | string>>;
  readonly followCursor?: boolean;
  readonly pulse?: boolean;
}

export const SPOTLIGHT_BEHAVIORS: Record<SpotlightBehaviorId, SpotlightBehavior> = {
  singlePool: {
    id: "singlePool",
    label: "Single Pool",
    duration: TIMING.slow,
    ease: "cinematicReveal",
    properties: {
      "--spotlight-opacity": 0.9,
      "--spotlight-radius": 280,
      "--spotlight-softness": 0.72,
    },
  },

  sweepLeftToRight: {
    id: "sweepLeftToRight",
    label: "Sweep Left to Right",
    duration: TIMING.dramatic,
    ease: "spotlightSweep",
    properties: {
      "--spotlight-x": "100%",
      "--spotlight-opacity": 0.85,
    },
    followCursor: false,
  },

  ritualCenterReveal: {
    id: "ritualCenterReveal",
    label: "Ritual Center Reveal",
    duration: TIMING.dramatic,
    ease: "dramaticEntrance",
    properties: {
      "--spotlight-scale": 0,
      "--spotlight-opacity": 1,
      "--spotlight-radius": 0,
    },
  },

  waterPuppetRipple: {
    id: "waterPuppetRipple",
    label: "Water Puppet Ripple",
    duration: BREATHING_RHYTHM.cycle,
    ease: "floatingMotion",
    properties: {
      "--ripple-amplitude": 6,
      "--ripple-frequency": 0.4,
      "--spotlight-softness": 0.88,
    },
    pulse: true,
  },

  selectionHalo: {
    id: "selectionHalo",
    label: "Selection Halo",
    duration: TIMING.medium,
    ease: "hover",
    properties: {
      "--spotlight-opacity": 0.65,
      "--spotlight-radius": 120,
      "--spotlight-softness": 0.95,
    },
    followCursor: true,
  },

  processionalFollow: {
    id: "processionalFollow",
    label: "Processional Follow",
    duration: TIMING.slow,
    ease: "sceneTransition",
    properties: {
      "--spotlight-opacity": 0.75,
      "--spotlight-trail": 0.3,
    },
    followCursor: true,
  },
} as const;

/** Scene entrance choreography — for logo reveal, dialogue scenes */
export const SCENE_ENTRANCE = {
  logoReveal: {
    stagger: STAGGER.ritual,
    duration: TIMING.dramatic,
    ease: "dramaticEntrance" as const,
    from: { opacity: 0, y: 24, filter: "blur(6px)" },
    to: { opacity: 1, y: 0, filter: "blur(0px)" },
  },

  dialogueBeat: {
    stagger: STAGGER.natural,
    duration: TIMING.medium,
    ease: "cinematicReveal" as const,
    from: { opacity: 0, x: -16 },
    to: { opacity: 1, x: 0 },
  },

  stringPuppet: {
    stagger: STAGGER.ceremonial,
    duration: TIMING.slow,
    ease: "floatingMotion" as const,
    from: { opacity: 0, rotation: -3, transformOrigin: "top center" },
    to: { opacity: 1, rotation: 0 },
  },
} as const;

export type SceneEntranceId = keyof typeof SCENE_ENTRANCE;