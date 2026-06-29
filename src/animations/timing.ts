// src/animations/timing.ts
//
// Foundational timing language for a Vietnamese theatrical storytelling platform.
// All values in seconds — GSAP-native; Framer Motion uses identical duration values.
//
// Avoid: cartoon snap, arcade speed, hyperactive micro-interactions.

// ─────────────────────────────────────────────────────────────────────────────
// Layer 1 — Duration Tokens
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Core duration scale.
 *
 * instant  → tactile acknowledgment (not mobile-app snap)
 * fast     → restrained hover / focus response
 * medium   → stage interactions, dialogue beats
 * slow     → reveals, entrances, puppet string settle
 * dramatic → full scene transitions, spotlight sweeps
 * ritual   → ceremonial sequences — logo reveal, curtain, procession
 * ambient  → idle loops — water shimmer, mist, suspended atmosphere
 */
export const TIMING = {
  instant: 0.14,
  fast: 0.36,
  medium: 0.74,
  slow: 1.38,
  dramatic: 2.75,
  ritual: 4.2,
  ambient: 8.4,
} as const;

export type TimingToken = keyof typeof TIMING;

/** Ordered scale — useful for intensity interpolation or debug UI */
export const TIMING_SCALE: readonly TimingToken[] = [
  "instant",
  "fast",
  "medium",
  "slow",
  "dramatic",
  "ritual",
  "ambient",
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Layer 2 — Theatrical Rhythm
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Stagger intervals — ensemble choreography.
 * Puppet strings, dialogue lines, lantern clusters.
 */
export const STAGGER = {
  tight: 0.05,
  natural: 0.1,
  ritual: 0.18,
  ceremonial: 0.32,
  procession: 0.48,
} as const;

export type StaggerToken = keyof typeof STAGGER;

/**
 * Suspended silence — the pause between beats on stage.
 * "Breath held before the puppet moves."
 */
export const HOLD = {
  glance: 0.2,
  breath: 0.4,
  beat: 0.8,
  tableau: 1.5,
  procession: 2.4,
  void: 3.6,
} as const;

export type HoldToken = keyof typeof HOLD;

/** Alias — emphasizes performative silence in scene choreography */
export const SUSPENDED_SILENCE = HOLD;

/**
 * Breathing rhythm — cyclic ambient pulse.
 * Water surface, lantern glow, idle stage atmosphere.
 */
export const BREATHING_RHYTHM = {
  inhale: 3.0,
  exhale: 3.6,
  cycle: 6.6,
  pause: 0.7,
  suspended: 1.2,
} as const;

export type BreathingPhase = keyof typeof BREATHING_RHYTHM;

/**
 * Entrance delay offsets — performers wait in darkness before emerging.
 */
export const ENTRANCE_DELAY = {
  immediate: 0,
  afterDarkness: HOLD.breath,
  afterBeat: HOLD.beat,
  afterTableau: HOLD.tableau,
  processional: HOLD.procession,
} as const;

export type EntranceDelayToken = keyof typeof ENTRANCE_DELAY;

// ─────────────────────────────────────────────────────────────────────────────
// Layer 3 — Semantic Timing Presets
// ─────────────────────────────────────────────────────────────────────────────

export type TimingPresetId =
  | "cinematicReveal"
  | "spotlightMovement"
  | "sceneTransition"
  | "stageInteraction"
  | "ambientMotion"
  | "hoverInteraction"
  | "theatricalEntrance"
  | "breathingIdle";

export interface TimingPreset {
  readonly id: TimingPresetId;
  readonly label: string;
  readonly description: string;
  readonly duration: TimingToken;
  readonly delay?: EntranceDelayToken;
  readonly hold?: HoldToken;
  readonly stagger?: StaggerToken;
  readonly repeat?: number;
  readonly yoyo?: boolean;
}

/**
 * Semantic presets — map theatrical intent → concrete token combinations.
 * Feature modules import these instead of raw TIMING values.
 */
export const TIMING_PRESETS: Record<TimingPresetId, TimingPreset> = {
  cinematicReveal: {
    id: "cinematicReveal",
    label: "Cinematic Reveal",
    description: "Subject emerges from darkness — measured, editorial",
    duration: "slow",
    hold: "breath",
    stagger: "ritual",
  },

  spotlightMovement: {
    id: "spotlightMovement",
    label: "Spotlight Movement",
    description: "Light pool traverses the stage — deliberate sweep",
    duration: "dramatic",
    hold: "glance",
  },

  sceneTransition: {
    id: "sceneTransition",
    label: "Scene Transition",
    description: "Full scene change — fade through void, curtain, dissolve",
    duration: "dramatic",
    hold: "beat",
    stagger: "ceremonial",
  },

  stageInteraction: {
    id: "stageInteraction",
    label: "Stage Interaction",
    description: "Puppet selection, prop touch, dialogue choice — performative response",
    duration: "medium",
    stagger: "natural",
  },

  ambientMotion: {
    id: "ambientMotion",
    label: "Ambient Motion",
    description: "Background water shimmer, mist drift, lantern pulse",
    duration: "ambient",
    repeat: -1,
    yoyo: true,
  },

  hoverInteraction: {
    id: "hoverInteraction",
    label: "Hover Interaction",
    description: "Tactile folk-craft response — soft, never snappy",
    duration: "fast",
  },

  theatricalEntrance: {
    id: "theatricalEntrance",
    label: "Theatrical Entrance",
    description: "Performer arrives from off-stage — decisive, not bouncy",
    duration: "slow",
    delay: "afterDarkness",
    stagger: "ritual",
  },

  breathingIdle: {
    id: "breathingIdle",
    label: "Breathing Idle",
    description: "Suspended living atmosphere — inhale/exhale cycle on loop",
    duration: "ambient",
    repeat: -1,
    yoyo: true,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Timing Language — documentation + AI scene context
// ─────────────────────────────────────────────────────────────────────────────

export const TIMING_LANGUAGE = {
  philosophy: [
    "slow stage transitions",
    "breathing rhythm",
    "suspended silence",
    "performative pacing",
    "water-reflection softness",
    "Vietnamese editorial elegance",
  ],
  tone: [
    "dark",
    "theatrical",
    "poetic",
    "folk-inspired",
    "ritualistic",
    "immersive",
    "stage-like",
    "cinematic",
  ],
  avoid: [
    "cartoon motion",
    "aggressive bounce",
    "arcade feeling",
    "startup animation language",
    "hyperactive UI motion",
    "excessive elasticity",
    "mobile-app microinteraction style",
  ],
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Resolvers — GSAP + Framer Motion
// ─────────────────────────────────────────────────────────────────────────────

/** Resolve a duration token to seconds */
export function resolveTiming(token: TimingToken, scale = 1): number {
  return TIMING[token] * scale;
}

/** Resolve stagger token to seconds */
export function resolveStagger(token: StaggerToken, scale = 1): number {
  return STAGGER[token] * scale;
}

/** Resolve hold / silence token to seconds */
export function resolveHold(token: HoldToken, scale = 1): number {
  return HOLD[token] * scale;
}

/** Resolve entrance delay token to seconds */
export function resolveEntranceDelay(token: EntranceDelayToken): number {
  return ENTRANCE_DELAY[token];
}

/** Full preset → resolved seconds bundle */
export function resolveTimingPreset(preset: TimingPreset, scale = 1) {
  return {
    duration: resolveTiming(preset.duration, scale),
    delay: preset.delay ? resolveEntranceDelay(preset.delay) : 0,
    hold: preset.hold ? resolveHold(preset.hold, scale) : 0,
    stagger: preset.stagger ? resolveStagger(preset.stagger, scale) : 0,
    repeat: preset.repeat ?? 0,
    yoyo: preset.yoyo ?? false,
  };
}

/** GSAP tween vars from a semantic preset */
export function toGSAPTiming(presetId: TimingPresetId, scale = 1) {
  const preset = TIMING_PRESETS[presetId];
  const resolved = resolveTimingPreset(preset, scale);

  return {
    duration: resolved.duration,
    delay: resolved.delay,
    stagger: resolved.stagger || undefined,
    repeat: resolved.repeat || undefined,
    yoyo: resolved.yoyo || undefined,
  };
}

/** Framer Motion transition object from a semantic preset */
export function toFramerTiming(presetId: TimingPresetId, scale = 1) {
  const preset = TIMING_PRESETS[presetId];
  const resolved = resolveTimingPreset(preset, scale);

  return {
    duration: resolved.duration,
    delay: resolved.delay,
    ...(resolved.stagger > 0 && { staggerChildren: resolved.stagger }),
    ...(resolved.repeat !== 0 && {
      repeat: resolved.repeat === -1 ? Infinity : resolved.repeat,
      repeatType: resolved.yoyo ? ("reverse" as const) : ("loop" as const),
    }),
  };
}

/** Convenience selector */
export function getTimingPreset(id: TimingPresetId): TimingPreset {
  return TIMING_PRESETS[id];
}