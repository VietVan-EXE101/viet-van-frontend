import { TIMING, HOLD } from "@/animations/timing";
import { EASING } from "@/animations/easing";
import { DARKNESS, GLOW } from "@/config/theme.config";
 
export const INTRO_TIMING = {
   darknessHold: HOLD.breath,
   sideWaterIn: TIMING.dramatic,
   logoReveal: TIMING.ritual,
   logoSettle: HOLD.tableau,
   introExit: TIMING.slow,
   reducedHold: TIMING.medium,
   reducedExit: TIMING.fast,
 } as const;
 
 export const INTRO_EASING = {
   waterFlow: EASING.floatingMotion,
   logoReveal: EASING.cinematicReveal,
   sideStream: EASING.spotlightSweep,
   exit: EASING.dramaticExit,
   ambient: EASING.ambientMotion,
 } as const;
 
 export const INTRO_ATMOSPHERE = {
   waterDeep: "#0a1f2e",
   waterMid: "#134e5e",
   waterSurface: "#1a6b7a",
   waterGlow: `rgba(26, 107, 122, ${GLOW.lantern})`,
   darkness: DARKNESS.void,
   rippleOpacity: 0.18,
 } as const;
 
 export const INTRO_STORAGE_KEY = "vietvan-intro-seen";
 export const INTRO_TOTAL_REDUCED = INTRO_TIMING.reducedHold + INTRO_TIMING.reducedExit;


 export const INTRO_ROPE = {
    pullThreshold: 100,
    dropOffset: 18,
    snapBackDuration: 0.65,
    successTugDuration: 0.28,
  } as const;
  
  /** Tổng thời gian reveal rồng — khớp keyframe video gốc */
  export const INTRO_REVEAL_DURATION = 3.5;