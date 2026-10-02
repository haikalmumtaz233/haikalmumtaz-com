export const accents = {
  purple: '#a855f7',
  cyan: '#06b6d4',
  fuchsia: '#d946ef',
  blue: '#3b82f6',
  amber: '#f59e0b',
} as const;

export const DEFAULT_ACCENT = accents.purple;

export const DEFAULT_GRADIENT = 'from-purple-900/20 via-transparent to-purple-900/10';

export const categoryAccent: Record<string, string> = {
  'Fullstack Web Development': accents.purple,
  'Frontend Development': accents.cyan,
  'Game Development': accents.fuchsia,
  'Mobile Development': accents.blue,
  'Open Source Library': accents.amber,
};

export const categoryGradient: Record<string, string> = {
  'Fullstack Web Development': 'from-purple-900/25 via-transparent to-purple-900/10',
  'Frontend Development': 'from-cyan-900/25 via-transparent to-cyan-900/10',
  'Game Development': 'from-fuchsia-900/25 via-transparent to-fuchsia-900/10',
  'Mobile Development': 'from-blue-900/25 via-transparent to-blue-900/10',
  'Open Source Library': 'from-amber-900/25 via-transparent to-amber-900/10',
};

export const accentForCategory = (category: string) => categoryAccent[category] ?? DEFAULT_ACCENT;

export const gradientForCategory = (category: string) =>
  categoryGradient[category] ?? DEFAULT_GRADIENT;
