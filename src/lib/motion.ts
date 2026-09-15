import { durationsMs, easingCurves } from '../design/tokens';

export const easing = easingCurves;

export const seconds = (name: keyof typeof durationsMs) => durationsMs[name] / 1000;

export const CONDENSED_SCALE = 0.62;

export const revealEase = easingCurves.smooth;

export const animatedProps = <T extends object>(
  shouldReduceMotion: boolean,
  props: T
): Partial<T> => (shouldReduceMotion ? {} : props);
