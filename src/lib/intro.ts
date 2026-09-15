import { useState, useSyncExternalStore } from 'react';

export type IntroPhase = 'idle' | 'playing' | 'formed' | 'done';

export const INTRO_FORMED_ESTIMATE = 2.4;

let phase: IntroPhase = 'idle';
let startedAt: number | null = null;
const listeners = new Set<() => void>();

export const getIntroPhase = () => phase;

export const setIntroPhase = (next: IntroPhase) => {
  if (phase === next) return;
  if (next === 'playing') startedAt ??= performance.now();
  phase = next;
  listeners.forEach((listener) => listener());
};

const subscribeIntro = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const introOffset = () => {
  if (phase !== 'playing' || startedAt === null) return 0;
  const elapsed = (performance.now() - startedAt) / 1000;
  return Math.max(0, INTRO_FORMED_ESTIMATE - elapsed);
};

export const useIntroGate = () => {
  const [gated] = useState(() => getIntroPhase() === 'playing');
  const current = useSyncExternalStore(subscribeIntro, getIntroPhase, getIntroPhase);
  return { gated, ready: !gated || current === 'formed' || current === 'done' };
};
