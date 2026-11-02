import { describe, expect, it } from 'vitest';
import { PARALLAX_RANGE, pacedProgress } from './parallax';

describe('pacedProgress', () => {
  it('follows the page progress when the page is longer than the parallax range', () => {
    const maxScroll = PARALLAX_RANGE * 1.2;
    const scrollY = maxScroll / 2;

    expect(pacedProgress(scrollY / maxScroll, scrollY)).toBeCloseTo(0.5);
  });

  it('paces a short page against the parallax range instead of its own length', () => {
    const maxScroll = 200;

    expect(pacedProgress(1, maxScroll)).toBeCloseTo(maxScroll / PARALLAX_RANGE);
  });

  it('moves a short page at the same rate as a long one', () => {
    const scrollY = 300;
    const shortPage = pacedProgress(scrollY / 400, scrollY);
    const longPage = pacedProgress(scrollY / PARALLAX_RANGE, scrollY);

    expect(shortPage).toBeCloseTo(longPage);
  });

  it('never goes below zero on overscroll', () => {
    expect(pacedProgress(0, -40)).toBe(0);
  });
});
