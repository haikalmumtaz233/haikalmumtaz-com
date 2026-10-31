const GLYPH_WIDTH = 0.95;

export const longestWordLength = (text: string) =>
  Math.max(1, ...text.split(/\s+/).map((word) => word.length));

export const fittedTitleSize = (text: string, maxSize: string, inset: string) =>
  `min(${maxSize}, calc((100cqi - ${inset}) / ${longestWordLength(text) * GLYPH_WIDTH}))`;
