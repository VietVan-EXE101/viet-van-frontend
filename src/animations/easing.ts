// src/animations/easing.ts

/** GSAP ease string */
export type GSAPEase = string;

/** Framer Motion cubic-bezier */
export type FramerEase = readonly [number, number, number, number];

export interface DualEase {
  readonly gsap: GSAPEase;
  readonly framer: FramerEase;
  readonly description: string;
}

/** Shared easing primitives — editorial, restrained, theatrical */
const EASE_PRIMITIVES = {
  /** Gentle hover lift — folk craft, tactile */
  hoverLift: {
    gsap: "sine.out",
    framer: [0.37, 0, 0.63, 1] as const,
    description: "Soft lift on interaction — no snap",
  },
  /** Slow emergence from darkness */
  reveal: {
    gsap: "power2.inOut",
    framer: [0.45, 0.05, 0.55, 0.95] as const,
    description: "Cinematic reveal — measured, not flashy",
  },
  /** Spotlight sweep across stage */
  sweep: {
    gsap: "power3.inOut",
    framer: [0.65, 0, 0.35, 1] as const,
    description: "Deliberate spotlight traversal",
  },
  /** Full scene change — ritualistic */
  sceneShift: {
    gsap: "power1.inOut",
    framer: [0.42, 0, 0.58, 1] as const,
    description: "Scene transition — processional pace",
  },
  /** Water-puppet floating drift */
  float: {
    gsap: "sine.inOut",
    framer: [0.45, 0.05, 0.55, 0.95] as const,
    description: "Suspended, aqueous motion",
  },
  /** Background atmosphere — barely perceptible */
  ambient: {
    gsap: "none",
    framer: [0.5, 0, 0.5, 1] as const,
    description: "Linear ambient drift",
  },
  /** Dramatic entrance from off-stage */
  entrance: {
    gsap: "power3.out",
    framer: [0.22, 1, 0.36, 1] as const,
    description: "Theatrical arrival — decisive, not bouncy",
  },
  /** Exit into darkness */
  exit: {
    gsap: "power2.in",
    framer: [0.55, 0, 1, 0.45] as const,
    description: "Withdrawal into shadow",
  },
  /** Curtain drop / rise */
  curtain: {
    gsap: "power4.inOut",
    framer: [0.76, 0, 0.24, 1] as const,
    description: "Heavy fabric weight — stagecraft",
  },
} as const satisfies Record<string, DualEase>;

/** Semantic easing categories — the cinematic language */
export const EASING = {
  hover: EASE_PRIMITIVES.hoverLift,
  cinematicReveal: EASE_PRIMITIVES.reveal,
  spotlightSweep: EASE_PRIMITIVES.sweep,
  sceneTransition: EASE_PRIMITIVES.sceneShift,
  floatingMotion: EASE_PRIMITIVES.float,
  ambientMotion: EASE_PRIMITIVES.ambient,
  dramaticEntrance: EASE_PRIMITIVES.entrance,
  dramaticExit: EASE_PRIMITIVES.exit,
  curtain: EASE_PRIMITIVES.curtain,
} as const;

export type EasingCategory = keyof typeof EASING;

/** Pick ease by semantic category */
export function getEase(category: EasingCategory): DualEase {
  return EASING[category];
}