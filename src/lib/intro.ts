export const INTRO_TIMING = {
  line: 0.55,
  open: 0.9,
  handoff: 0.5,
};

let startedAt: number | null = null;

export const markIntroStart = () => {
  startedAt ??= performance.now();
};

export const introOffset = () => {
  if (startedAt === null) return 0;
  const elapsed = (performance.now() - startedAt) / 1000;
  return Math.max(0, INTRO_TIMING.handoff - elapsed);
};
