// src/config/motion.config.ts

import { TIMING, STAGGER, BREATHING_RHYTHM } from "@/animations/timing";
import { EASING } from "@/animations/easing";

/** Motion hierarchy — what moves, and how much attention it demands */
export const MOTION_HIERARCHY = {
  primary: {
    id: "primary",
    label: "Primary Motion",
    description: "Scene-level choreography — transitions, reveals, scene changes",
    durationScale: 1,
    stagger: STAGGER.ritual,
    defaultEase: "sceneTransition" as const,
    priority: 3,
    reducedMotionScale: 0.5,
  },

  secondary: {
    id: "secondary",
    label: "Secondary Motion",
    description: "Supporting elements — dialogue blocks, puppet strings, props",
    durationScale: 0.85,
    stagger: STAGGER.natural,
    defaultEase: "cinematicReveal" as const,
    priority: 2,
    reducedMotionScale: 0.4,
  },

  ambient: {
    id: "ambient",
    label: "Ambient Motion",
    description: "Background breathing — water shimmer, mist, idle glow",
    durationScale: 1.4,
    stagger: STAGGER.ceremonial,
    defaultEase: "ambientMotion" as const,
    priority: 0,
    reducedMotionScale: 0.15,
    cycleDuration: BREATHING_RHYTHM.cycle,
  },

  micro: {
    id: "micro",
    label: "Micro Interaction",
    description: "Hover, focus, selection — tactile folk-craft response",
    durationScale: 0.55,
    stagger: STAGGER.tight,
    defaultEase: "hover" as const,
    priority: 1,
    reducedMotionScale: 0.25,
  },
} as const;

export type MotionHierarchyLevel = keyof typeof MOTION_HIERARCHY;

/** Intensity presets — ceremonial scale without changing the language */
export const MOTION_INTENSITY = {
  subdued: { durationScale: 1.35, staggerScale: 1.2, opacityScale: 0.7 },
  restrained: { durationScale: 1.15, staggerScale: 1.05, opacityScale: 0.85 },
  standard: { durationScale: 1, staggerScale: 1, opacityScale: 1 },
  heightened: { durationScale: 0.88, staggerScale: 0.9, opacityScale: 1.1 },
  ceremonial: { durationScale: 0.75, staggerScale: 0.8, opacityScale: 1.2 },
} as const;

export type MotionIntensityLevel = keyof typeof MOTION_INTENSITY;

/** Resolve effective duration for a hierarchy level + intensity */
export function resolveMotionDuration(
  hierarchy: MotionHierarchyLevel,
  baseToken: keyof typeof TIMING,
  intensity: MotionIntensityLevel = "standard",
): number {
  const h = MOTION_HIERARCHY[hierarchy];
  const i = MOTION_INTENSITY[intensity];
  return TIMING[baseToken] * h.durationScale * i.durationScale;
}

/** GSAP defaults derived from hierarchy */
export function getGSAPDefaults(hierarchy: MotionHierarchyLevel) {
  const h = MOTION_HIERARCHY[hierarchy];
  return {
    ease: EASING[h.defaultEase].gsap,
    stagger: h.stagger,
  };
}

/** Framer Motion transition defaults derived from hierarchy */
export function getFramerDefaults(hierarchy: MotionHierarchyLevel) {
  const h = MOTION_HIERARCHY[hierarchy];
  return {
    ease: EASING[h.defaultEase].framer,
    staggerChildren: h.stagger,
  };
}