import { durationsMs, easingCurves, palette } from './src/design/tokens.js';

const toCubicBezier = (curve) => `cubic-bezier(${curve.join(', ')})`;

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
        sans: ['Plus Jakarta Sans Variable', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        monument: ['Monument Extended', 'sans-serif'],
      },
      spacing: {
        rail: '3rem',
        'rail-lg': '4.5rem',
      },
      transitionDuration: Object.fromEntries(
        Object.entries(durationsMs).map(([name, value]) => [name, `${value}ms`])
      ),
      transitionTimingFunction: Object.fromEntries(
        Object.entries(easingCurves).map(([name, curve]) => [name, toCubicBezier(curve)])
      ),
    },
  },
  plugins: [],
}
