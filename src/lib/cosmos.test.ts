import { describe, expect, it } from 'vitest';
import {
  bandAt,
  createRandom,
  fbm,
  pickSpectralTint,
  renderCosmos,
  renderDust,
  renderGalaxy,
  renderSky,
  SKY_MAX_ALPHA,
  SPECTRAL_TINTS,
} from './cosmos';

const alphaAt = (data: Uint8ClampedArray, width: number, x: number, y: number) =>
  data[(y * width + x) * 4 + 3];

describe('createRandom', () => {
  it('repeats the same sequence for the same seed', () => {
    const first = createRandom(42);
    const second = createRandom(42);
    for (let index = 0; index < 20; index++) expect(first()).toBe(second());
  });

  it('stays inside [0, 1)', () => {
    const random = createRandom(7);
    for (let index = 0; index < 1000; index++) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe('fbm', () => {
  it('stays inside [0, 1]', () => {
    for (let index = 0; index < 500; index++) {
      const value = fbm(index * 0.37, index * 0.11, 3, 5);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    }
  });
});

describe('pickSpectralTint', () => {
  it('always returns a valid tint index', () => {
    const random = createRandom(1);
    for (let index = 0; index < 500; index++) {
      const tint = pickSpectralTint(random);
      expect(SPECTRAL_TINTS[tint]).toBeDefined();
    }
  });
});

describe('bandAt', () => {
  it('peaks near the layer centre and fades toward the corners', () => {
    expect(bandAt(0.5, 0.4, 0.8)).toBeGreaterThan(0.8);
    expect(bandAt(0, 0, 0.8)).toBeLessThan(0.05);
  });
});

describe('renderSky', () => {
  it('is deterministic for a seed', () => {
    expect(renderSky(24, 18, 9).data).toEqual(renderSky(24, 18, 9).data);
  });

  it('keeps the nebula translucent so text stays readable', () => {
    const { data } = renderSky(40, 32, 9);
    for (let index = 3; index < data.length; index += 4)
      expect(data[index]).toBeLessThanOrEqual(Math.ceil(SKY_MAX_ALPHA * 255));
  });
});

describe('renderDust', () => {
  it('scatters stars across the layer', () => {
    const { data } = renderDust(120, 90, 9);
    let lit = 0;
    for (let index = 3; index < data.length; index += 4) if (data[index] > 0) lit++;
    expect(lit).toBeGreaterThan(40);
  });
});

describe('renderGalaxy', () => {
  it('glows at the core and fades to nothing at the edges', () => {
    const size = 96;
    const { data } = renderGalaxy(size, 9);
    expect(alphaAt(data, size, size / 2, size / 2)).toBeGreaterThan(200);
    expect(alphaAt(data, size, 0, 0)).toBe(0);
    expect(alphaAt(data, size, size - 1, size / 2)).toBe(0);
  });
});

describe('renderCosmos', () => {
  it('skips the galaxy when no size is requested', () => {
    const layers = renderCosmos({
      seed: 1,
      sky: { width: 8, height: 8 },
      dust: { width: 16, height: 16 },
      galaxySize: null,
    });
    expect(layers.galaxy).toBeNull();
    expect(layers.sky.data).toHaveLength(8 * 8 * 4);
  });
});
