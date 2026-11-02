import { describe, expect, it } from 'vitest';
import { sectionEyebrow } from './sectionLabel';

const sections = [
  { id: 'projects', label: 'Featured work' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

describe('sectionEyebrow', () => {
  it('numbers a section by its dock position with padded totals', () => {
    expect(sectionEyebrow('experience', sections)).toBe('02 / 03');
  });

  it('numbers the first section as 01', () => {
    expect(sectionEyebrow('projects', sections)).toBe('01 / 03');
  });

  it('returns an empty string for a section outside the dock', () => {
    expect(sectionEyebrow('tools', sections)).toBe('');
  });
});
