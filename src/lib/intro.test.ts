import { describe, expect, it } from 'vitest';
import { shouldPlayIntro } from './intro';

describe('shouldPlayIntro', () => {
  it('plays on the root path', () => {
    expect(shouldPlayIntro('/', false)).toBe(true);
  });

  it('skips on every other path', () => {
    for (const pathname of ['/projects', '/.env', '/@fs/.env', '/wp-admin', '/projects/', '//']) {
      expect(shouldPlayIntro(pathname, false), pathname).toBe(false);
    }
  });

  it('skips when the visitor prefers reduced motion', () => {
    expect(shouldPlayIntro('/', true)).toBe(false);
  });
});
