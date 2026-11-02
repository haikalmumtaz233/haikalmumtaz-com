import { describe, expect, it } from 'vitest';
import { ALL_DOMAINS, domainFilters, filterByDomain } from './projectIndex';

const project = (domain: string) => ({ domain });

describe('domainFilters', () => {
  it('puts the full count first, then domains by count and name', () => {
    const items = [
      project('Finance'),
      project('Education'),
      project('Government'),
      project('Education'),
    ];

    expect(domainFilters(items)).toEqual([
      { value: ALL_DOMAINS, count: 4 },
      { value: 'Education', count: 2 },
      { value: 'Finance', count: 1 },
      { value: 'Government', count: 1 },
    ]);
  });
});

describe('filterByDomain', () => {
  const items = [project('Finance'), project('Education'), project('Finance')];

  it('keeps every project for the all filter', () => {
    expect(filterByDomain(items, ALL_DOMAINS)).toEqual(items);
  });

  it('keeps only projects in the chosen domain', () => {
    expect(filterByDomain(items, 'Finance')).toEqual([items[0], items[2]]);
  });
});
