export const PARALLAX_RANGE = 8000;

export const pacedProgress = (progress: number, scrollY: number, range = PARALLAX_RANGE) =>
  Math.max(0, Math.min(progress, scrollY / range));
