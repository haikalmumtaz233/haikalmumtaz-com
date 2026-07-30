import { useEffect, useRef, useState } from 'react';

const REFERENCE_FONT_SIZE = 100;

export const useFittedTextSize = (text: string, widthRatio = 1) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [fittedSize, setFittedSize] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const fitToWidth = () => {
      const available = container.clientWidth * widthRatio;
      const measured = measure.getBoundingClientRect().width;
      if (available <= 0 || measured <= 0) return;
      setFittedSize((REFERENCE_FONT_SIZE * available) / measured);
    };

    fitToWidth();

    const resizeObserver = new ResizeObserver(fitToWidth);
    resizeObserver.observe(container);

    if (document.fonts) {
      document.fonts.ready.then(fitToWidth).catch(() => undefined);
    }

    return () => resizeObserver.disconnect();
  }, [text, widthRatio]);

  return { containerRef, measureRef, fittedSize, referenceFontSize: REFERENCE_FONT_SIZE };
};
