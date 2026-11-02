export const ALL_DOMAINS = 'All';

export interface DomainFilter<D extends string> {
  value: D | typeof ALL_DOMAINS;
  count: number;
}

export const domainFilters = <D extends string>(
  items: readonly { domain: D }[],
): DomainFilter<D>[] => {
  const counts = new Map<D, number>();
  for (const { domain } of items) counts.set(domain, (counts.get(domain) ?? 0) + 1);

  const domains = [...counts]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));

  return [{ value: ALL_DOMAINS, count: items.length }, ...domains];
};

export const filterByDomain = <T extends { domain: string }>(
  items: readonly T[],
  value: string,
): T[] => (value === ALL_DOMAINS ? [...items] : items.filter((item) => item.domain === value));
