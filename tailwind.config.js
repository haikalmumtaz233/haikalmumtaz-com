import plugin from 'tailwindcss/plugin';
import { durationsMs, easingCurves, palette } from './src/design/tokens.js';

const toCubicBezier = (curve) => `cubic-bezier(${curve.join(', ')})`;

const displayStack = "'Archivo Variable', 'Archivo', system-ui, sans-serif";
const sansStack = "'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', 'Inter', sans-serif";
const monoStack = "'IBM Plex Mono', ui-monospace, 'SFMono-Regular', monospace";

const typeScale = {
  '.text-display-xl': {
    fontFamily: displayStack,
    fontSize: 'clamp(3rem, 12vw, 11rem)',
    fontWeight: '800',
    fontVariationSettings: "'wdth' 125, 'wght' 800",
    letterSpacing: '-0.03em',
    lineHeight: '0.88',
  },
  '.text-display-l': {
    fontFamily: displayStack,
    fontSize: 'clamp(2rem, 6vw, 4.5rem)',
    fontWeight: '800',
    fontVariationSettings: "'wdth' 110, 'wght' 800",
    letterSpacing: '-0.02em',
    lineHeight: '0.95',
  },
  '.text-title': {
    fontFamily: displayStack,
    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
    fontWeight: '700',
    fontVariationSettings: "'wdth' 100, 'wght' 700",
    letterSpacing: '-0.01em',
    lineHeight: '1.1',
  },
  '.text-body-l': {
    fontFamily: sansStack,
    fontSize: '1.125rem',
    fontWeight: '400',
    lineHeight: '1.7',
  },
  '.text-body': {
    fontFamily: sansStack,
    fontSize: '0.9375rem',
    fontWeight: '400',
    lineHeight: '1.65',
  },
  '.text-label': {
    fontFamily: monoStack,
    fontSize: '0.6875rem',
    fontWeight: '500',
    letterSpacing: '0.18em',
    lineHeight: '1.4',
    textTransform: 'uppercase',
  },
  '.text-data': {
    fontFamily: monoStack,
    fontSize: '0.8125rem',
    fontWeight: '400',
    lineHeight: '1.5',
    fontVariantNumeric: 'tabular-nums',
  },
};

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: palette.ink,
        panel: palette.panel,
        rule: palette.rule,
        gading: palette.gading,
        sogan: palette.sogan,
        nila: palette.nila,
        jade: palette.jade,
        mute: palette.mute,
      },
      fontFamily: {
        display: ['Archivo Variable', 'Archivo', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans Variable', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        monument: ['Monument Extended', 'sans-serif'],
      },
      spacing: {
        rail: '3rem',
        'rail-lg': '4.5rem',
      },
      borderRadius: {
        panel: '0.75rem',
      },
      transitionDuration: Object.fromEntries(
        Object.entries(durationsMs).map(([name, value]) => [name, `${value}ms`])
      ),
      transitionTimingFunction: Object.fromEntries(
        Object.entries(easingCurves).map(([name, curve]) => [name, toCubicBezier(curve)])
      ),
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities(typeScale);
    }),
  ],
}
