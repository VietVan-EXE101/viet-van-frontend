// src/animations/transitions.ts

import { TIMING, HOLD, type TimingToken } from "./timing";
import { EASING, type EasingCategory } from "./easing";

export type TransitionId =
  | "fadeThroughDarkness"
  | "spotlightReveal"
  | "curtainTransition"
  | "stageFade"
  | "cinematicDissolve";

export interface TransitionPhase {
  readonly id: string;
  readonly duration: number;
  readonly ease: EasingCategory;
  readonly properties: Readonly<Record<string, number | string>>;
  readonly delay?: number;
}

export interface TransitionPreset {
  readonly id: TransitionId;
  readonly label: string;
  readonly description: string;
  readonly durationToken: TimingToken;
  readonly defaultEase: EasingCategory;
  readonly phases: readonly TransitionPhase[];
}

/** Darkness veil opacity targets — referenced, never magic numbers */
const VEIL = {
  full: 1,
  half: 0.55,
  whisper: 0.22,
  clear: 0,
} as const;

const SPOTLIGHT = {
  hidden: 0,
  dim: 0.35,
  focused: 0.85,
  peak: 1,
} as const;

export const TRANSITIONS: Record<TransitionId, TransitionPreset> = {
  fadeThroughDarkness: {
    id: "fadeThroughDarkness",
    label: "Fade Through Darkness",
    description: "Scene exits into void; new scene emerges from black",
    durationToken: "dramatic",
    defaultEase: "sceneTransition",
    phases: [
      {
        id: "descend",
        duration: TIMING.slow,
        ease: "dramaticExit",
        properties: { opacity: VEIL.full, filter: "brightness(0.3)" },
      },
      {
        id: "hold-dark",
        duration: HOLD.beat,
        ease: "ambientMotion",
        properties: { opacity: VEIL.full },
        delay: 0,
      },
      {
        id: "emerge",
        duration: TIMING.slow,
        ease: "cinematicReveal",
        properties: { opacity: VEIL.clear, filter: "brightness(1)" },
      },
    ],
  },

  spotlightReveal: {
    id: "spotlightReveal",
    label: "Spotlight Reveal",
    description: "Dark stage; single pool of light expands to reveal subject",
    durationToken: "dramatic",
    defaultEase: "spotlightSweep",
    phases: [
      {
        id: "veil",
        duration: TIMING.medium,
        ease: "dramaticExit",
        properties: { opacity: VEIL.half },
      },
      {
        id: "sweep",
        duration: TIMING.slow,
        ease: "spotlightSweep",
        properties: {
          "--spotlight-opacity": SPOTLIGHT.focused,
          "--spotlight-scale": 1,
        },
      },
      {
        id: "resolve",
        duration: TIMING.fast,
        ease: "cinematicReveal",
        properties: { opacity: VEIL.clear },
      },
    ],
  },

  curtainTransition: {
    id: "curtainTransition",
    label: "Curtain Transition",
    description: "Heavy drape closes; scene changes behind; drape opens",
    durationToken: "dramatic",
    defaultEase: "curtain",
    phases: [
      {
        id: "close",
        duration: TIMING.slow,
        ease: "curtain",
        properties: { scaleY: 1, transformOrigin: "top center" },
      },
      {
        id: "swap",
        duration: HOLD.breath,
        ease: "ambientMotion",
        properties: { opacity: VEIL.full },
      },
      {
        id: "open",
        duration: TIMING.slow,
        ease: "curtain",
        properties: { scaleY: 0, transformOrigin: "top center" },
      },
    ],
  },

  stageFade: {
    id: "stageFade",
    label: "Stage Fade",
    description: "Gentle crossfade — performers exit, new tableau enters",
    durationToken: "medium",
    defaultEase: "sceneTransition",
    phases: [
      {
        id: "exit",
        duration: TIMING.medium,
        ease: "dramaticExit",
        properties: { opacity: VEIL.whisper, y: -12 },
      },
      {
        id: "enter",
        duration: TIMING.medium,
        ease: "dramaticEntrance",
        properties: { opacity: VEIL.clear, y: 0 },
        delay: HOLD.breath,
      },
    ],
  },

  cinematicDissolve: {
    id: "cinematicDissolve",
    label: "Cinematic Dissolve",
    description: "Poetic overlap dissolve — memory-like, editorial",
    durationToken: "slow",
    defaultEase: "cinematicReveal",
    phases: [
      {
        id: "dissolve-out",
        duration: TIMING.slow,
        ease: "cinematicReveal",
        properties: { opacity: VEIL.whisper, filter: "blur(4px)" },
      },
      {
        id: "dissolve-in",
        duration: TIMING.slow,
        ease: "cinematicReveal",
        properties: { opacity: VEIL.clear, filter: "blur(0px)" },
        delay: TIMING.fast,
      },
    ],
  },
} as const;

/** Framer Motion variant builder from a transition preset */
export function toFramerVariants(preset: TransitionPreset) {
  const initial: Record<string, unknown> = {};
  const animate: Record<string, unknown> = {};
  const exit: Record<string, unknown> = {};

  const first = preset.phases[0];
  const last = preset.phases[preset.phases.length - 1];

  Object.assign(exit, first.properties);
  Object.assign(animate, last.properties);

  return {
    initial,
    animate,
    exit,
    transition: {
      duration: TIMING[preset.durationToken],
      ease: EASING[preset.defaultEase].framer,
    },
  };
}

/** GSAP timeline vars from a single phase */
export function toGSAPPhaseVars(phase: TransitionPhase) {
  return {
    ...phase.properties,
    duration: phase.duration,
    ease: EASING[phase.ease].gsap,
    delay: phase.delay ?? 0,
  };
}