export type EasingCurve = readonly [number, number, number, number];

export type EasingName = 'smooth' | 'entrance' | 'exit' | 'inout';

export type DurationName = 'instant' | 'quick' | 'base' | 'slow' | 'reveal';

export type PaletteName =
  | 'ink'
  | 'panel'
  | 'rule'
  | 'gading'
  | 'sogan'
  | 'nila'
  | 'jade'
  | 'mute';

export declare const easingCurves: Record<EasingName, EasingCurve>;

export declare const durationsMs: Record<DurationName, number>;

export declare const palette: Record<PaletteName, string>;
