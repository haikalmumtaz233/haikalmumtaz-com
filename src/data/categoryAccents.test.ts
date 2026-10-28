import { describe, expect, it } from 'vitest';
import {
  DEFAULT_ACCENT,
  DEFAULT_GRADIENT,
  accentForCategory,
  categoryAccent,
  categoryGradient,
  gradientForCategory,
} from './categoryAccents';
import { projects } from './projects';

describe('category accents', () => {
  it('gives every known category both an accent and a gradient', () => {
    expect(Object.keys(categoryGradient).sort()).toEqual(Object.keys(categoryAccent).sort());
  });

  it('covers every category used by a project', () => {
    for (const project of projects) {
      expect(categoryAccent, project.name).toHaveProperty([project.category]);
    }
  });

  it('falls back to the defaults for an unknown category', () => {
    expect(accentForCategory('Unknown')).toBe(DEFAULT_ACCENT);
    expect(gradientForCategory('Unknown')).toBe(DEFAULT_GRADIENT);
  });
});
