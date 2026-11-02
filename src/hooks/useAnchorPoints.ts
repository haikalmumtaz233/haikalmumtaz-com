import { useEffect, useState, type RefObject } from 'react';
import type { ChartPoint } from '../lib/momentsChart';

const offsetWithin = (element: HTMLElement, container: HTMLElement) => {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = element;
  while (node && node !== container) {
    x += node.offsetLeft;
    y += node.offsetTop;
    const parent: Element | null = node.offsetParent;
    node = parent instanceof HTMLElement ? parent : null;
  }
  return { x, y };
};

export const useAnchorPoints = (
  containerRef: RefObject<HTMLElement | null>,
  selector: string,
  lift: number,
  enabled: boolean,
) => {
  const [points, setPoints] = useState<ChartPoint[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    const measure = () => {
      const anchors = [...container.querySelectorAll(selector)].filter(
        (anchor) => anchor instanceof HTMLElement,
      );
      setPoints(
        anchors.map((anchor) => {
          const { x, y } = offsetWithin(anchor, container);
          return { x: x + anchor.offsetWidth / 2, y: y - lift };
        }),
      );
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);
    window.addEventListener('resize', measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [containerRef, selector, lift, enabled]);

  return points;
};
