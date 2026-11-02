import { describe, expect, it } from 'vitest';
import { constellationPath, passedNodes, revealFraction, yearGroups } from './momentsChart';

const years = (...values: string[]) => values.map((year) => ({ year }));

describe('yearGroups', () => {
  it('groups consecutive moments of the same year in order', () => {
    expect(yearGroups(years('2022', '2023', '2023', '2024'))).toEqual([
      { year: '2022', start: 0, count: 1 },
      { year: '2023', start: 1, count: 2 },
      { year: '2024', start: 3, count: 1 },
    ]);
  });

  it('starts a new group when a year comes back after another', () => {
    expect(yearGroups(years('2023', '2024', '2023'))).toEqual([
      { year: '2023', start: 0, count: 1 },
      { year: '2024', start: 1, count: 1 },
      { year: '2023', start: 2, count: 1 },
    ]);
  });

  it('returns no groups for no moments', () => {
    expect(yearGroups([])).toEqual([]);
  });
});

describe('constellationPath', () => {
  it('draws straight segments through every point', () => {
    expect(
      constellationPath([
        { x: 0, y: 0 },
        { x: 10, y: 5 },
        { x: 20, y: 0 },
      ]),
    ).toBe('M0 0 L10 5 L20 0');
  });

  it('rounds coordinates to one decimal', () => {
    expect(
      constellationPath([
        { x: 1.234, y: 5.678 },
        { x: 9.95, y: 0.04 },
      ]),
    ).toBe('M1.2 5.7 L10 0');
  });

  it('starts a path for a single point', () => {
    expect(constellationPath([{ x: 0, y: 0 }])).toBe('M0 0');
  });

  it('returns an empty path for no points', () => {
    expect(constellationPath([])).toBe('');
  });
});

describe('passedNodes', () => {
  const points = [
    { x: 100, y: 0 },
    { x: 400, y: 0 },
    { x: 700, y: 0 },
  ];

  it('returns -1 before the first node reaches the marker', () => {
    expect(passedNodes(points, 0, 50)).toBe(-1);
  });

  it('returns the last node at or left of the marker after the track shift', () => {
    expect(passedNodes(points, -300, 400)).toBe(2);
    expect(passedNodes(points, 0, 400)).toBe(1);
  });
});

describe('revealFraction', () => {
  const points = [
    { x: 100, y: 0 },
    { x: 500, y: 0 },
  ];

  it('is 0 before the first node and 1 after the last', () => {
    expect(revealFraction(points, 0, 50)).toBe(0);
    expect(revealFraction(points, -1000, 50)).toBe(1);
  });

  it('follows the marker between the first and last node', () => {
    expect(revealFraction(points, 0, 300)).toBeCloseTo(0.5);
  });

  it('is 0 when there are fewer than two nodes', () => {
    expect(revealFraction([{ x: 10, y: 0 }], 0, 500)).toBe(0);
  });
});
