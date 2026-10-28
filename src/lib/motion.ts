export const easing = {
  smooth: [0.33, 1, 0.68, 1],
  exit: [0.64, 0, 0.78, 0],
  inout: [0.65, 0, 0.35, 1],
  expo: [0.16, 1, 0.3, 1],
  wipe: [0.76, 0, 0.24, 1],
} as const;

export const animatedProps = <T extends object>(
  shouldReduceMotion: boolean,
  props: T
): Partial<T> => (shouldReduceMotion ? {} : props);
