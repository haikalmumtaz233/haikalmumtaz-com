import { describe, expect, it } from 'vitest';
import {
  bandAt,
  createRandom,
  fbm,
  pickSpectralTint,
  planetLayout,
  planetPixel,
  renderCosmos,
  renderDust,
  renderPlanet,
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

describe('planetPixel', () => {
  const brightness = ([color, alpha]: ReturnType<typeof planetPixel>) => Math.max(...color) * alpha;

  it('keeps the night side dark and opaque so it hides the stars behind it', () => {
    const [, alpha] = planetPixel(0, 0, 9);
    expect(alpha).toBe(1);
    expect(brightness(planetPixel(0, 0, 9))).toBeLessThan(0.05);
  });

  it('lights a crescent on the limb that faces the light', () => {
    expect(brightness(planetPixel(0.3, -0.93, 9))).toBeGreaterThan(0.25);
    expect(brightness(planetPixel(-0.3, 0.93, 9))).toBeLessThan(0.05);
  });

  it('glows just outside the lit limb and fades into space', () => {
    expect(brightness(planetPixel(0.3, -0.96, 9))).toBeGreaterThan(
      brightness(planetPixel(-0.3, 0.96, 9)),
    );
    expect(planetPixel(0, -2, 9)[1]).toBeLessThan(0.01);
  });
});

describe('planetLayout', () => {
  it('keeps the horizon wide on desktop and phones', () => {
    expect(planetLayout(1440, 900).radius).toBe(1080);
    expect(planetLayout(390, 844).radius).toBeCloseTo(464.2);
  });
});

describe('renderPlanet', () => {
  it('draws an opaque disc below a translucent glow', () => {
    const width = 80;
    const { data } = renderPlanet({ width, height: 40, radius: 50, top: 8 }, 9);
    expect(alphaAt(data, width, 40, 30)).toBe(255);
    expect(alphaAt(data, width, 40, 0)).toBeLessThan(255);
  });
});

describe('renderCosmos', () => {
  it('returns every layer at the requested size', () => {
    const layers = renderCosmos({
      seed: 1,
      sky: { width: 8, height: 8 },
      dust: { width: 16, height: 16 },
      planet: { width: 12, height: 6, radius: 10, top: 2 },
    });
    expect(layers.sky.data).toHaveLength(8 * 8 * 4);
    expect(layers.dust.data).toHaveLength(16 * 16 * 4);
    expect(layers.planet.data).toHaveLength(12 * 6 * 4);
  });
});
