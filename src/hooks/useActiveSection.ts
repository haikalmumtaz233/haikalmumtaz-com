import { useEffect, useState } from 'react';

export const useActiveSection = (sectionIds: string[], enabled = true) => {
  const [observedId, setObservedId] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const visibility = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let bestId: string | null = null;
        let bestRatio = 0;

        for (const [id, ratio] of visibility) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        setObservedId(bestId);
      },
      { threshold: [0, 0.15, 0.35, 0.6, 0.9], rootMargin: '-10% 0px -10% 0px' }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [sectionIds, enabled]);

  return enabled ? observedId : null;
};
