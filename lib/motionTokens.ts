/** Shared Animate UI / Motion timing — keep overlays feeling like one system. */

export const MOTION_EASE_OUT = [0.215, 0.61, 0.355, 1] as const;
export const MOTION_EASE_EXIT = [0.33, 0.17, 0.67, 0.5] as const;

/** Backdrop fade + progressive blur (in and out). */
export const OVERLAY_BACKDROP_TRANSITION = {
  duration: 0.4,
  ease: MOTION_EASE_OUT,
};

/** Dialog tip-in spring; opacity rides the soft ease-out. */
export const OVERLAY_DIALOG_TRANSITION = {
  type: "spring" as const,
  stiffness: 150,
  damping: 25,
  opacity: {
    duration: 0.4,
    ease: MOTION_EASE_OUT,
  },
};

/** Sheet / dialog dismiss — quicker than enter. */
export const OVERLAY_EXIT_TRANSITION = {
  duration: 0.2,
  ease: MOTION_EASE_EXIT,
};

/** Sheet slide-in (data-side on Dialog.Popup). */
export const OVERLAY_SHEET_TRANSITION = {
  duration: 0.4,
  ease: MOTION_EASE_OUT,
};

/** Section FadeIn / Stagger — same soft ease, slightly snappier. */
export const SECTION_FADE_EASE = [0.22, 1, 0.36, 1] as const;
export const SECTION_FADE_DURATION = 0.32;
