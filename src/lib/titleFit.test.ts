import { describe, expect, it } from 'vitest';
import { fittedTitleSize, longestWordLength } from './titleFit';

describe('longestWordLength', () => {
  it('counts the longest word, not the whole title', () => {
    expect(longestWordLength('SMP Muhdela Yogyakarta Website')).toBe(10);
    expect(longestWordLength('NusaIndex')).toBe(9);
  });

  it('ignores repeated and edge whitespace', () => {
    expect(longestWordLength('  Street   Beats ')).toBe(6);
  });

  it('never returns zero for an empty title', () => {
    expect(longestWordLength('')).toBe(1);
  });
});

describe('fittedTitleSize', () => {
  it('caps the size and scales down to fit the longest word', () => {
    expect(fittedTitleSize('Plimsoll', '2.25rem', '2.5rem')).toBe(
      'min(2.25rem, calc((100cqi - 2.5rem) / 7.6))',
    );
  });
});
