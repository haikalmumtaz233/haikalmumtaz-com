import { useCallback, useEffect, useRef, type RefObject } from 'react';

type ApplyFocus = (card: HTMLElement, offset: number) => void;

export const useRailFocus = (railRef: RefObject<HTMLElement>, apply: ApplyFocus, enabled = true) => {
  const frameRef = useRef(0);
  const applyRef = useRef(apply);

  useEffect(() => {
    applyRef.current = apply;
  }, [apply]);

  const update = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;

    const railCenter = rail.scrollLeft + rail.clientWidth / 2;
    const cards = rail.querySelectorAll<HTMLElement>('[data-rail-card]');

    cards.forEach((card) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const offset = (cardCenter - railCenter) / (card.offsetWidth || 1);
      applyRef.current(card, Math.max(-1.5, Math.min(1.5, offset)));
    });
  }, [railRef]);

  const onScroll = useCallback(() => {
    if (!enabled) return;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(update);
  }, [enabled, update]);

  useEffect(() => {
    if (!enabled) return;
    update();

    const rail = railRef.current;
    if (!rail) return;
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(rail);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, [enabled, update, railRef]);

  return onScroll;
};
