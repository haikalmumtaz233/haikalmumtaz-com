import { describe, expect, it } from 'vitest';
import { activeIndexAt, segmentTarget } from './featuredScroll';

describe('activeIndexAt', () => {
  it('starts on the first project', () => {
    expect(activeIndexAt(0, 5)).toBe(0);
  });

  it('moves to the next project at each equal slice of progress', () => {
    expect(activeIndexAt(0.2, 5)).toBe(1);
    expect(activeIndexAt(0.59, 5)).toBe(2);
  });

  it('keeps the last project active at the very end', () => {
    expect(activeIndexAt(1, 5)).toBe(4);
  });

  it('clamps progress outside 0..1', () => {
    expect(activeIndexAt(-0.1, 5)).toBe(0);
    expect(activeIndexAt(1.4, 5)).toBe(4);
  });

  it('returns 0 when there are no projects', () => {
    expect(activeIndexAt(0.5, 0)).toBe(0);
  });
});

describe('segmentTarget', () => {
  it('scrolls to the middle of a project slice', () => {
    expect(segmentTarget(0, 5, 1000, 4000)).toBe(1400);
    expect(segmentTarget(4, 5, 1000, 4000)).toBe(4600);
  });

  it('clamps an index outside the list', () => {
    expect(segmentTarget(9, 5, 1000, 4000)).toBe(4600);
    expect(segmentTarget(-2, 5, 1000, 4000)).toBe(1400);
  });

  it('lands on the start when there are no projects', () => {
    expect(segmentTarget(0, 0, 1000, 4000)).toBe(1000);
  });
});
