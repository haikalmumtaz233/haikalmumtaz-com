type Point = readonly [number, number];
type Stroke = readonly Point[];

export interface GlyphBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface FigureVertex {
  x: number;
  y: number;
  distance: number;
}

export interface Figure {
  strokes: number[][];
  vertices: FigureVertex[];
  length: number;
}

export interface Trace {
  segments: number[];
  head: Point | null;
}

export const GLYPH_STROKES: Readonly<Record<string, readonly Stroke[]>> = {
  A: [
    [
      [0.06, 1],
      [0.43, 0],
      [0.57, 0],
      [0.94, 1],
    ],
    [
      [0.25, 0.68],
      [0.75, 0.68],
    ],
  ],
  H: [
    [
      [0.09, 0],
      [0.09, 1],
    ],
    [
      [0.09, 0.5],
      [0.91, 0.5],
    ],
    [
      [0.91, 0],
      [0.91, 1],
    ],
  ],
  I: [
    [
      [0.5, 0],
      [0.5, 1],
    ],
  ],
  K: [
    [
      [0.1, 0],
      [0.1, 1],
    ],
    [
      [0.9, 0],
      [0.2, 0.52],
    ],
    [
      [0.38, 0.4],
      [0.92, 1],
    ],
  ],
  L: [
    [
      [0.1, 0],
      [0.1, 0.9],
      [0.95, 0.9],
    ],
  ],
  M: [
    [
      [0.08, 1],
      [0.08, 0],
      [0.5, 0.72],
      [0.92, 0],
      [0.92, 1],
    ],
  ],
  T: [
    [
      [0.02, 0.1],
      [0.98, 0.1],
    ],
    [
      [0.5, 0.1],
      [0.5, 1],
    ],
  ],
  U: [
    [
      [0.1, 0],
      [0.1, 0.62],
      [0.2, 0.86],
      [0.5, 0.96],
      [0.8, 0.86],
      [0.9, 0.62],
      [0.9, 0],
    ],
  ],
  Z: [
    [
      [0.04, 0.1],
      [0.96, 0.1],
      [0.04, 0.9],
      [0.96, 0.9],
    ],
  ],
};

const SAME_POINT = 0.5;

export const buildFigure = (char: string, box: GlyphBox): Figure | null => {
  const strokes = GLYPH_STROKES[char.toUpperCase()];
  if (!strokes) return null;

  const width = box.right - box.left;
  const height = box.bottom - box.top;
  const absolute = strokes.map((stroke) =>
    stroke.flatMap(([x, y]) => [box.left + x * width, box.top + y * height]),
  );

  const vertices: FigureVertex[] = [];
  let length = 0;
  for (const stroke of absolute) {
    for (let i = 0; i < stroke.length; i += 2) {
      if (i > 0) length += Math.hypot(stroke[i] - stroke[i - 2], stroke[i + 1] - stroke[i - 1]);
      const x = stroke[i];
      const y = stroke[i + 1];
      const known = vertices.some(
        (vertex) => Math.abs(vertex.x - x) < SAME_POINT && Math.abs(vertex.y - y) < SAME_POINT,
      );
      if (!known) vertices.push({ x, y, distance: length });
    }
  }

  return { strokes: absolute, vertices, length };
};

export const traceFigure = (figure: Figure, progress: number): Trace => {
  const segments: number[] = [];
  let remaining = Math.min(1, Math.max(0, progress)) * figure.length;
  let head: Point | null = null;
  if (remaining <= 0) return { segments, head };

  for (const stroke of figure.strokes) {
    for (let i = 2; i < stroke.length; i += 2) {
      const x1 = stroke[i - 2];
      const y1 = stroke[i - 1];
      const x2 = stroke[i];
      const y2 = stroke[i + 1];
      const span = Math.hypot(x2 - x1, y2 - y1);
      if (remaining >= span) {
        segments.push(x1, y1, x2, y2);
        remaining -= span;
        head = [x2, y2];
        continue;
      }
      const portion = span === 0 ? 1 : remaining / span;
      const hx = x1 + (x2 - x1) * portion;
      const hy = y1 + (y2 - y1) * portion;
      segments.push(x1, y1, hx, hy);
      return { segments, head: [hx, hy] };
    }
  }

  return { segments, head };
};
