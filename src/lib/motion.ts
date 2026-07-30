import type { Variants } from 'framer-motion';
import { durationsMs, easingCurves } from '../design/tokens';

export const easing = easingCurves;

export const seconds = (name: keyof typeof durationsMs) => durationsMs[name] / 1000;

export const revealEase = easingCurves.smooth;

const noMotion: Variants = { hidden: {}, visible: {} };

export const staggerContainerVariants = (
  shouldReduceMotion: boolean,
  staggerChildren = 0.1,
  delayChildren = 0.1
): Variants =>
  shouldReduceMotion
    ? noMotion
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren, delayChildren },
        },
      };

export const maskedWordVariants = (shouldReduceMotion: boolean, duration = 0.8): Variants =>
  shouldReduceMotion
    ? noMotion
    : {
        hidden: { y: '100%' },
        visible: {
          y: '0%',
          transition: { duration, ease: revealEase },
        },
      };

export const fadeUpVariants = (
  shouldReduceMotion: boolean,
  distance = 30,
  duration = 0.5
): Variants =>
  shouldReduceMotion
    ? noMotion
    : {
        hidden: { opacity: 0, y: distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration, ease: revealEase },
        },
      };

export const staggeredFadeUpVariants = (
  shouldReduceMotion: boolean,
  distance = 30,
  duration = 0.5,
  staggerChildren = 0.04,
  delayChildren = 0.1
): Variants =>
  shouldReduceMotion
    ? noMotion
    : {
        hidden: { opacity: 0, y: distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration, ease: revealEase, staggerChildren, delayChildren },
        },
      };

export const animatedProps = <T extends object>(
  shouldReduceMotion: boolean,
  props: T
): Partial<T> => (shouldReduceMotion ? {} : props);
