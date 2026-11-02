import { describe, expect, it } from 'vitest';
import { ALL_DOMAINS, domainFilters, filterByDomain, linkKind, projectLinks } from './projectIndex';

const project = (domain: string, repoLink = '#', liveLink = '#') => ({
  domain,
  repoLink,
  liveLink,
});

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

describe('linkKind', () => {
  it.each([
    ['https://github.com/me/tool/releases/latest', 'download'],
    ['https://github.com/me/tool', 'source'],
    ['https://discord.gg/abc', 'community'],
    ['https://example.com', 'website'],
  ])('reads %s as %s', (url, kind) => {
    expect(linkKind(url)).toBe(kind);
  });
});

describe('projectLinks', () => {
  it('lists the live link before the repository', () => {
    expect(
      projectLinks(project('Finance', 'https://github.com/me/app', 'https://app.dev')),
    ).toEqual([
      { href: 'https://app.dev', kind: 'website' },
      { href: 'https://github.com/me/app', kind: 'source' },
    ]);
  });

  it('drops placeholder and empty links', () => {
    expect(projectLinks(project('Finance', '#', ''))).toEqual([]);
  });
});
