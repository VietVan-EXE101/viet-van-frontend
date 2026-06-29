// src/config/theme.config.ts

/** Darkness veil levels — stage void depth */
export const DARKNESS = {
    void: 1,
    deep: 0.88,
    twilight: 0.62,
    dusk: 0.38,
    penumbra: 0.18,
    clear: 0,
  } as const;
  
  export type DarknessLevel = keyof typeof DARKNESS;
  
  /** Glow intensity — lantern light, puppet reflection on water */
  export const GLOW = {
    none: 0,
    ember: 0.15,
    lantern: 0.35,
    stage: 0.55,
    ritual: 0.75,
    climax: 0.92,
  } as const;
  
  export type GlowIntensity = keyof typeof GLOW;
  
  /** Spotlight edge softness — 0 = hard edge, 1 = fully diffused */
  export const SPOTLIGHT_SOFTNESS = {
    hard: 0.2,
    stage: 0.45,
    theatrical: 0.65,
    aqueous: 0.82,
    dream: 0.95,
  } as const;
  
  /** Stage contrast — foreground vs background separation */
  export const STAGE_CONTRAST = {
    muted: 0.85,
    natural: 1,
    dramatic: 1.25,
    chiaroscuro: 1.55,
  } as const;
  
  /** Ambient layer opacity — mist, water surface, background texture */
  export const AMBIENT_OPACITY = {
    invisible: 0,
    whisper: 0.08,
    breath: 0.16,
    presence: 0.28,
    atmosphere: 0.42,
    dominant: 0.58,
  } as const;
  
  /** Unified atmosphere palette */
  export const ATMOSPHERE = {
    darkness: DARKNESS,
    glow: GLOW,
    spotlightSoftness: SPOTLIGHT_SOFTNESS,
    stageContrast: STAGE_CONTRAST,
    ambientOpacity: AMBIENT_OPACITY,
  } as const;
  
  /** CSS custom property map — bind to globals or scene containers */
  export const ATMOSPHERE_CSS_VARS = {
    "--atmosphere-darkness": DARKNESS.deep,
    "--atmosphere-glow": GLOW.lantern,
    "--spotlight-softness": SPOTLIGHT_SOFTNESS.theatrical,
    "--stage-contrast": STAGE_CONTRAST.dramatic,
    "--ambient-opacity": AMBIENT_OPACITY.breath,
  } as const;