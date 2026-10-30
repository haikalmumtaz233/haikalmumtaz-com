import { describe, expect, it } from 'vitest';
import { buildFigure, GLYPH_STROKES, traceFigure } from './constellation';

const box = { left: 100, top: 50, right: 200, bottom: 150 };

describe('GLYPH_STROKES', () => {
  it('covers every letter of the nameplate', () => {
    for (const char of 'HAIKALMUMTAZ') expect(GLYPH_STROKES[char], char).toBeDefined();
  });

  it('keeps every point inside the glyph box', () => {
    for (const [char, strokes] of Object.entries(GLYPH_STROKES)) {
      for (const stroke of strokes) {
        expect(stroke.length, char).toBeGreaterThanOrEqual(2);
        for (const [x, y] of stroke) {
          expect(x, char).toBeGreaterThanOrEqual(0);
          expect(x, char).toBeLessThanOrEqual(1);
          expect(y, char).toBeGreaterThanOrEqual(0);
          expect(y, char).toBeLessThanOrEqual(1);
        }
      }
    }
  });
});

describe('buildFigure', () => {
  it('maps strokes into the glyph box', () => {
    const figure = buildFigure('I', box);
    expect(figure?.strokes).toEqual([[150, 50, 150, 150]]);
    expect(figure?.length).toBe(100);
  });

  it('shares stars where strokes meet', () => {
    const figure = buildFigure('H', box);
    expect(figure?.vertices).toHaveLength(6);
  });

  it('orders stars by when the pen reaches them', () => {
    const distances = buildFigure('L', box)?.vertices.map((vertex) => vertex.distance);
    expect(distances).toEqual([0, 90, 175]);
  });

  it('accepts lower case and skips unknown glyphs', () => {
    expect(buildFigure('z', box)).not.toBeNull();
    expect(buildFigure('?', box)).toBeNull();
  });
});

describe('traceFigure', () => {
  const figure = buildFigure('I', box);
  if (!figure) throw new Error('missing figure');

  it('draws nothing before the pen starts', () => {
    expect(traceFigure(figure, 0)).toEqual({ segments: [], head: null });
  });

  it('stops the pen partway along a stroke', () => {
    expect(traceFigure(figure, 0.5)).toEqual({ segments: [150, 50, 150, 100], head: [150, 100] });
  });

  it('draws every stroke once complete', () => {
    const trace = traceFigure(figure, 1);
    expect(trace.segments).toEqual([150, 50, 150, 150]);
    expect(trace.head).toEqual([150, 150]);
  });
});
