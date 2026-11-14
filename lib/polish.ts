/**
 * Revertable polish / motion upgrades.
 * Set `enabled: false` to instantly revert ALL polish features
 * without deleting implementation code.
 */
export const POLISH = {
  /** Master switch */
  enabled: true,

  /** Lenis inertia scroll */
  lenis: true,
  /** Framer Motion layoutId nav capsule */
  navLayoutId: true,
  /** Hero title masked line reveal */
  heroEntrance: true,
  /** Soften + raise BUILT TO SCALE watermark */
  watermarkSofter: true,
  /** Top-edge SHIPPED timer bar + pause on hover */
  shippedTopBar: true,
  /** Core-focus SVG stroke draw */
  heroChartDraw: true,
  /** Architecture diagram data-packet pulses */
  worksPackets: true,
  /** Bento stack glyph mechanical press */
  bentoPress: true,
  /** Hardware lab cursor spotlight */
  labSpotlight: true,

  /* —— Section motion pacing (hero/manifesto untouched) —— */
  /** Works: in-place topology morph + packet spike on project change */
  worksTopologyMorph: true,
  /** Stack: once-true slab dock */
  stackSlabDock: true,
  /** Stack: hover dependency border traces */
  stackDependencyHover: true,
  /** About: print registration + clip-path ink */
  aboutPrintPlate: true,
  /** Tech: DIN-rail then blade snap */
  techDinRail: true,
  /** Experience: timeline tick rail (no pin/scale) */
  experienceTickRail: true,
  /** Lab: full-viewport sticky CNC plotter (desktop) */
  labPlotterStage: true,
  /** Contact: center shutter + focus flash */
  contactShutter: true,

  /* —— Signature interactions —— */
  /** Works: SIMULATE 10K CCU load toggle on architecture stage */
  worksLoadSimulate: true,
  /** Global Swiss grid + scroll progress HUD (G key / footer) */
  gridHud: true,
  /** Opt-in Web Audio relay clicks (default OFF via localStorage) */
  relaySfx: true,

  /* —— Autonomous ambient motion (no toggles) —— */
  /** Hero: caliper tick snap synced to SHIPPED cycle */
  heroCaliperSnap: true,
  /** Statement: accent highlight sweep + pillar laser drop */
  manifestoSweep: true,
  /** Works: node border/LED fire when packets hit */
  worksNodeFire: true,
  /** Stack: idle dependency cluster scanner */
  stackIdleScan: true,
  /** About: orange caliper wipe + top-down mask */
  aboutCaliperWipe: true,
  /** Toolkit: blade LED boot stagger on DIN snap */
  techBladeBoot: true,
  /** Experience: scroll-head node + archive flash */
  experienceScrollHead: true,
  /** Lab: post-draw schematic loops */
  labSchematicLoop: true,
} as const;

export type PolishKey = Exclude<keyof typeof POLISH, "enabled">;

export function polish(key: PolishKey): boolean {
  return POLISH.enabled && POLISH[key];
}
