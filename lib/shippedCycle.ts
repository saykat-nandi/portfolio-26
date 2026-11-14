/** Broadcast when hero SHIPPED card advances — gyro caliper snaps in sync. */
export const SHIPPED_CYCLE_EVENT = "portfolio:shipped-cycle";

export function emitShippedCycle() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SHIPPED_CYCLE_EVENT));
}
