import { buildFigure, traceFigure, type Figure } from './constellation';
import { createSkyStars, createStarPainter, twinkleAt } from './skyStars';

export interface WordMeaning {
  word: string;
  script: string;
  meaning: string;
}

interface SceneOptions {
  backdrop: HTMLElement;
  meanings: readonly WordMeaning[];
  onFormed: () => void;
  onDone: () => void;
}

interface WordBox {
  text: string;
  left: number;
  bottom: number;
  size: number;
  lastLetter: number;
}

interface GlyphTargets {
  points: number[];
  figures: Figure[];
  words: WordBox[];
}

interface Label {
  x: number;
  y: number;
  size: number;
  script: string;
  meaning: string;
  at: number;
}

const PIXEL_BUDGET = 1_600_000;
const COLORS = ['#ffffff', '#c4b5fd', '#a5f3fc'];
const FRAME_LINE = 'rgba(196, 181, 253, 1)';
const GLYPH_FONT = '"Monument Extended"';
const ORDINARY_SHARE = 0.7;
const NODE_SIZE = 13;
const LABEL_FONT = '"Plus Jakarta Sans Variable", sans-serif';

const TIMING = {
  igniteSpread: 0.75,
  ignitePop: 0.32,
  gatherAt: 0.85,
  maxWait: 2.2,
  flyStagger: 0.035,
  flyVertex: 0.012,
  flyDuration: 0.7,
  traceFrom: 0.75,
  traceStagger: 0.085,
  traceDuration: 0.42,
  reachFlash: 0.35,
  labelFade: 0.45,
  fill: 1.7,
  sweep: 0.5,
  trail: 0.018,
  jitter: 0.12,
  travel: 1.0,
  frameFade: 0.6,
  formed: 3.3,
  release: 3.52,
  settle: 0.45,
  escapeFade: 1.3,
  skyFrom: 3.3,
  skyTo: 4.6,
};

const END = TIMING.release + TIMING.escapeFade + 0.05;

const easeOutExpo = (k: number) => (k >= 1 ? 1 : 1 - Math.pow(2, -10 * k));
const easeInOutQuart = (k: number) =>
  k < 0.5 ? 8 * k * k * k * k : 1 - Math.pow(-2 * k + 2, 4) / 2;
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const closestOnSegments = (segments: number[], x: number, y: number): readonly [number, number] => {
  let bestX = x;
  let bestY = y;
  let best = Infinity;
  for (let s = 0; s < segments.length; s += 4) {
    const ax = segments[s];
    const ay = segments[s + 1];
    const dx = segments[s + 2] - ax;
    const dy = segments[s + 3] - ay;
    const span = dx * dx + dy * dy;
    const t = span === 0 ? 0 : clamp01(((x - ax) * dx + (y - ay) * dy) / span);
    const px = ax + dx * t;
    const py = ay + dy * t;
    const distance = (px - x) ** 2 + (py - y) ** 2;
    if (distance < best) {
      best = distance;
      bestX = px;
      bestY = py;
    }
  }
  return [bestX, bestY];
};

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const traceStart = (letter: number) => TIMING.traceFrom + letter * TIMING.traceStagger;
const traceEnd = (letter: number) => traceStart(letter) + TIMING.traceDuration;

const sampleGlyphs = (width: number, height: number, maxPoints: number): GlyphTargets | null => {
  const origins = Array.from(document.querySelectorAll<HTMLElement>('[data-glyph-origin]'));
  if (origins.length === 0) return null;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';

  let left = width;
  let top = height;
  let right = 0;
  let bottom = 0;
  const figures: Figure[] = [];
  const words: WordBox[] = [];
  let previous: { right: number; top: number; size: number } | null = null;

  for (const origin of origins) {
    const char = origin.dataset.glyphOrigin ?? '';
    if (!char.trim()) continue;
    const rect = origin.getBoundingClientRect();
    const size = parseFloat(getComputedStyle(origin).fontSize);
    ctx.font = `900 ${size}px ${GLYPH_FONT}`;
    ctx.fillText(char, rect.left, rect.top);

    const metrics = ctx.measureText(char);
    const box = {
      left: rect.left - metrics.actualBoundingBoxLeft,
      right: rect.left + metrics.actualBoundingBoxRight,
      top: rect.top - metrics.actualBoundingBoxAscent,
      bottom: rect.top + metrics.actualBoundingBoxDescent,
    };

    const newWord =
      !previous ||
      Math.abs(box.top - previous.top) > previous.size * 0.5 ||
      box.left - previous.right > previous.size * 0.2;
    if (newWord) words.push({ text: '', left: box.left, bottom: box.bottom, size, lastLetter: 0 });
    const word = words[words.length - 1];
    word.text += char.toUpperCase();
    word.bottom = Math.max(word.bottom, box.bottom);

    const figure = buildFigure(char, box);
    if (figure) {
      figures.push(figure);
      word.lastLetter = figures.length - 1;
    }
    previous = { right: box.right, top: box.top, size };

    left = Math.min(left, rect.left);
    right = Math.max(right, rect.left + size * 1.2);
    top = Math.min(top, rect.top - size);
    bottom = Math.max(bottom, rect.top + size * 0.25);
  }

  const x0 = Math.max(0, Math.floor(left));
  const y0 = Math.max(0, Math.floor(top));
  const boxWidth = Math.min(width, Math.ceil(right)) - x0;
  const boxHeight = Math.min(height, Math.ceil(bottom)) - y0;
  if (boxWidth <= 0 || boxHeight <= 0) return null;

  const { data } = ctx.getImageData(x0, y0, boxWidth, boxHeight);
  let ink = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 128) ink++;
  if (ink < 200) return null;

  const step = Math.max(2, Math.ceil(Math.sqrt(ink / maxPoints)));
  const points: number[] = [];

  for (let y = 0; y < boxHeight; y += step) {
    for (let x = 0; x < boxWidth; x += step) {
      const sx = Math.min(boxWidth - 1, x + Math.floor(Math.random() * step));
      const sy = Math.min(boxHeight - 1, y + Math.floor(Math.random() * step));
      if (data[(sy * boxWidth + sx) * 4 + 3] > 128) points.push(x0 + sx + 0.5, y0 + sy + 0.5);
    }
  }

  return points.length > 100 ? { points, figures, words } : null;
};

const scatterTargets = (width: number, height: number, count: number): GlyphTargets => {
  const points: number[] = [];
  for (let i = 0; i < count; i++) points.push(Math.random() * width, Math.random() * height);
  return { points, figures: [], words: [] };
};

const createLabels = (words: WordBox[], meanings: readonly WordMeaning[]) =>
  words.flatMap((word): Label[] => {
    const meaning = meanings.find((entry) => entry.word.toUpperCase() === word.text);
    if (!meaning) return [];
    const size = Math.min(15, Math.max(10, word.size * 0.11));
    return [
      {
        x: word.left,
        y: word.bottom + Math.max(14, word.size * 0.2) + size,
        size,
        script: meaning.script,
        meaning: meaning.meaning.toUpperCase(),
        at: traceEnd(word.lastLetter),
      },
    ];
  });

export const runIntroScene = (
  canvas: HTMLCanvasElement,
  { backdrop, meanings, onFormed, onDone }: SceneOptions,
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    onFormed();
    onDone();
    return () => undefined;
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(PIXEL_BUDGET / (width * height)));
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const painter = createStarPainter(ctx);
  const stars = createSkyStars(width, height);
  const igniteAt = stars.map(
    (star) => Math.random() * TIMING.igniteSpread * (0.3 + 0.7 * (1 - star.brightness)),
  );
  const departAt = new Float32Array(stars.length).fill(Infinity);
  const maxPoints = width < 768 ? 900 : 1900;

  let cancelled = false;
  let frame = 0;
  let targets: GlyphTargets | null = null;
  let waitOver = false;
  let formedSent = false;
  let origin = performance.now();
  let gatherStart: number | null = null;
  let pace = 1;
  let lastSky = 1;

  let figures: Figure[] = [];
  let vertexStars: number[][] = [];
  let labels: Label[] = [];

  let count = 0;
  let tx = new Float32Array(0);
  let ty = new Float32Array(0);
  let sx = new Float32Array(0);
  let sy = new Float32Array(0);
  let headX = 0;
  let headY = 0;
  let start = new Float32Array(0);
  let swirl = new Float32Array(0);
  let vx = new Float32Array(0);
  let vy = new Float32Array(0);
  let group = new Uint8Array(0);
  const groupCount = COLORS.length * 2;
  const segmentsByGroup: number[][] = Array.from({ length: groupCount }, () => []);
  const frameSegments: number[] = [];

  const borrowStars = () => {
    const ordinary = stars
      .map((star, index) => ({ index, star }))
      .filter(({ star }) => !star.flare)
      .sort((a, b) => a.star.brightness - b.star.brightness)
      .slice(0, Math.max(1, Math.floor(stars.length * ORDINARY_SHARE)))
      .map(({ index }) => index);
    for (let i = ordinary.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ordinary[i], ordinary[j]] = [ordinary[j], ordinary[i]];
    }
    let next = 0;
    vertexStars = figures.map((figure, letter) =>
      figure.vertices.map((_, vertex) => {
        const index = ordinary[next % ordinary.length];
        next++;
        departAt[index] = letter * TIMING.flyStagger + vertex * TIMING.flyVertex;
        return index;
      }),
    );
  };

  const prepare = () => {
    const chosen = targets ?? scatterTargets(width, height, maxPoints);
    const points = chosen.points;
    figures = chosen.figures;
    labels = createLabels(chosen.words, meanings);
    borrowStars();
    pace = targets ? 1 : 1.8;
    count = points.length / 2;
    tx = new Float32Array(count);
    ty = new Float32Array(count);
    sx = new Float32Array(count);
    sy = new Float32Array(count);
    start = new Float32Array(count);
    swirl = new Float32Array(count);
    vx = new Float32Array(count);
    vy = new Float32Array(count);
    group = new Uint8Array(count);

    let nameCenterX = 0;
    let nameCenterY = 0;
    for (let i = 0; i < count; i++) {
      nameCenterX += points[i * 2];
      nameCenterY += points[i * 2 + 1];
    }
    nameCenterX /= count || 1;
    nameCenterY /= count || 1;

    const reach = Math.hypot(width, height);
    const skeleton = figures.flatMap((figure) => traceFigure(figure, 1).segments);
    let nameLeft = Infinity;
    let nameRight = -Infinity;
    for (let i = 0; i < count; i++) {
      nameLeft = Math.min(nameLeft, points[i * 2]);
      nameRight = Math.max(nameRight, points[i * 2]);
    }
    const nameWidth = Math.max(1, nameRight - nameLeft);

    for (let i = 0; i < count; i++) {
      tx[i] = points[i * 2];
      ty[i] = points[i * 2 + 1];

      if (skeleton.length > 0) {
        [sx[i], sy[i]] = closestOnSegments(skeleton, tx[i], ty[i]);
        start[i] =
          TIMING.fill +
          ((tx[i] - nameLeft) / nameWidth) * TIMING.sweep +
          Math.random() * TIMING.jitter;
        swirl[i] = (Math.random() - 0.5) * 24;
      } else {
        const source = stars[Math.floor(Math.random() * stars.length)];
        sx[i] = source.x * width;
        sy[i] = source.y * height;
        const distance = Math.hypot(tx[i] - sx[i], ty[i] - sy[i]);
        start[i] =
          TIMING.fill + (1 - distance / reach) * TIMING.sweep + Math.random() * TIMING.jitter;
        swirl[i] = (Math.random() - 0.5) * 160;
      }

      const dx = tx[i] - nameCenterX;
      const dy = ty[i] - nameCenterY;
      const spread = Math.hypot(dx, dy) || 1;
      const speed = 90 + Math.random() * 260;
      vx[i] = (dx / spread) * speed;
      vy[i] = (dy / spread) * speed - 40 - Math.random() * 80;

      const colorRoll = Math.random();
      const color = colorRoll < 0.1 ? 2 : colorRoll < 0.26 ? 1 : 0;
      const escapes = Math.random() < 0.3 ? 1 : 0;
      group[i] = color * 2 + escapes;
    }
  };

  const drawSky = (elapsed: number, tg: number, fade: number) => {
    const clock = performance.now() / 1000;
    painter.reset();
    for (let i = 0; i < stars.length; i++) {
      if (tg >= departAt[i]) continue;
      const k = clamp01((elapsed - igniteAt[i]) / TIMING.ignitePop);
      if (k <= 0) continue;
      const pop = 1 + 2.4 * (1 - k) * (1 - k);
      const star = stars[i];
      painter.draw(
        star,
        star.x * width,
        star.y * height,
        twinkleAt(star, clock),
        easeOutExpo(k) * fade,
        pop,
      );
    }
    ctx.globalAlpha = 1;
  };

  const drawFrame = (tg: number) => {
    const fade = 1 - clamp01((tg - TIMING.formed) / TIMING.frameFade);
    if (fade <= 0 || figures.length === 0) return;

    frameSegments.length = 0;
    const heads: number[] = [];
    figures.forEach((figure, letter) => {
      const progress = clamp01((tg - traceStart(letter)) / TIMING.traceDuration);
      const trace = traceFigure(figure, easeInOutQuart(progress));
      for (const value of trace.segments) frameSegments.push(value);
      if (trace.head && progress < 1) heads.push(trace.head[0], trace.head[1]);
    });

    if (frameSegments.length > 0) {
      ctx.lineCap = 'round';
      ctx.strokeStyle = FRAME_LINE;
      const shine = Math.max(0, 1 - Math.abs(tg - (TIMING.formed - 0.2)) / 0.45);
      for (const [lineWidth, alpha] of [
        [5, 0.07 + 0.2 * shine],
        [1.2, 0.6 + 0.4 * shine],
      ]) {
        ctx.globalAlpha = alpha * fade;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        for (let s = 0; s < frameSegments.length; s += 4) {
          ctx.moveTo(frameSegments[s], frameSegments[s + 1]);
          ctx.lineTo(frameSegments[s + 2], frameSegments[s + 3]);
        }
        ctx.stroke();
      }
    }

    const clock = performance.now() / 1000;
    painter.reset();
    figures.forEach((figure, letter) => {
      const traced =
        easeInOutQuart(clamp01((tg - traceStart(letter)) / TIMING.traceDuration)) * figure.length;
      figure.vertices.forEach((vertex, index) => {
        const starIndex = vertexStars[letter][index];
        const star = stars[starIndex];
        const flight = clamp01((tg - departAt[starIndex]) / TIMING.flyDuration);
        const eased = easeInOutQuart(flight);
        const x = star.x * width + (vertex.x - star.x * width) * eased;
        const y = star.y * height + (vertex.y - star.y * height) * eased;
        painter.draw(star, x, y, twinkleAt(star, clock), fade * (1 - eased));
        painter.spark(x, y, NODE_SIZE * (0.35 + 0.65 * eased), fade * (0.3 + 0.65 * eased));

        if (traced >= vertex.distance && figure.length > 0) {
          const reachedAt =
            traceStart(letter) + (vertex.distance / figure.length) * TIMING.traceDuration;
          const flash = 1 - clamp01((tg - reachedAt) / TIMING.reachFlash);
          if (flash > 0) painter.spark(vertex.x, vertex.y, 10 + 26 * flash, flash * fade);
        }
      });
    });

    for (let h = 0; h < heads.length; h += 2) painter.spark(heads[h], heads[h + 1], 22, fade);
    ctx.globalAlpha = 1;
  };

  const drawLabels = (tg: number) => {
    const vanish = 1 - clamp01((tg - (TIMING.formed - 0.25)) / 0.5);
    if (vanish <= 0) return;
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';

    for (const label of labels) {
      const appear = easeOutExpo(clamp01((tg - label.at) / TIMING.labelFade));
      const alpha = appear * vanish;
      if (alpha <= 0) continue;
      const y = label.y + (1 - appear) * 6;

      ctx.globalAlpha = alpha * 0.5;
      ctx.fillStyle = FRAME_LINE;
      ctx.fillRect(label.x, y - label.size * 0.36, label.size * 1.6 * appear, 1);

      const scriptX = label.x + label.size * 2.2;
      ctx.globalAlpha = alpha;
      ctx.font = `600 ${label.size * 1.15}px ${LABEL_FONT}`;
      ctx.letterSpacing = '0px';
      ctx.fillStyle = '#f5f3ff';
      ctx.fillText(label.script, scriptX, y);
      const scriptWidth = ctx.measureText(label.script).width;

      ctx.globalAlpha = alpha * 0.82;
      ctx.font = `600 ${label.size}px ${LABEL_FONT}`;
      ctx.letterSpacing = `${label.size * 0.28}px`;
      ctx.fillStyle = FRAME_LINE;
      ctx.fillText(label.meaning, scriptX + scriptWidth + label.size * 0.9, y);
    }
    ctx.letterSpacing = '0px';
    ctx.globalAlpha = 1;
  };

  const locate = (i: number, tg: number) => {
    if (tg >= TIMING.release) {
      const decay = (1 - Math.exp(-2.4 * (tg - TIMING.release))) / 2.4;
      const escapes = group[i] & 1;
      headX = tx[i] + (escapes ? vx[i] * decay : 0);
      headY = ty[i] + (escapes ? vy[i] * decay : 0);
      return;
    }
    const k = clamp01((tg - start[i]) / TIMING.travel);
    const e = easeInOutQuart(k);
    const dx = tx[i] - sx[i];
    const dy = ty[i] - sy[i];
    const length = Math.hypot(dx, dy) || 1;
    const arc = Math.sin(Math.PI * e) * swirl[i] * (1 - k * 0.3);
    headX = sx[i] + dx * e + (-dy / length) * arc;
    headY = sy[i] + dy * e + (dx / length) * arc;
  };

  const drawParticles = (tg: number) => {
    const released = tg >= TIMING.release;
    const releaseTime = tg - TIMING.release;
    const tailTime = released ? Math.max(TIMING.release, tg - TIMING.trail) : tg - TIMING.trail;

    for (let i = 0; i < count; i++) {
      if (tg <= start[i]) continue;
      if (!released && tg >= start[i] + TIMING.travel + TIMING.trail) {
        segmentsByGroup[group[i]].push(tx[i], ty[i], tx[i], ty[i]);
        continue;
      }
      locate(i, Math.max(start[i], tailTime));
      const tailX = headX;
      const tailY = headY;
      locate(i, tg);
      segmentsByGroup[group[i]].push(tailX, tailY, headX, headY);
    }

    ctx.lineCap = 'square';
    for (let g = 0; g < groupCount; g++) {
      const segments = segmentsByGroup[g];
      if (segments.length === 0) continue;
      const escapes = g & 1;
      let alpha = 1;
      if (released) {
        alpha = escapes
          ? 1 - clamp01(releaseTime / TIMING.escapeFade)
          : 1 - clamp01(releaseTime / TIMING.settle);
      }
      if (alpha <= 0) {
        segments.length = 0;
        continue;
      }
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = COLORS[g >> 1];
      ctx.lineWidth = escapes ? 1.5 : 1.8;
      ctx.beginPath();
      for (let s = 0; s < segments.length; s += 4) {
        ctx.moveTo(segments[s], segments[s + 1]);
        ctx.lineTo(segments[s + 2] + 0.01, segments[s + 3]);
      }
      ctx.stroke();
      segments.length = 0;
    }
    ctx.globalAlpha = 1;
  };

  const render = (now: number) => {
    if (cancelled) return;
    const elapsed = (now - origin) / 1000;
    ctx.clearRect(0, 0, width, height);

    if (gatherStart === null) {
      drawSky(elapsed, -Infinity, 1);
      const ready = targets !== null || waitOver || elapsed > TIMING.maxWait;
      if (ready && elapsed >= TIMING.gatherAt) {
        prepare();
        gatherStart = figures.length > 0 ? now : now - (TIMING.fill * 1000) / pace;
      }
      frame = requestAnimationFrame(render);
      return;
    }

    const tg = ((now - gatherStart) / 1000) * pace;
    const sky = 1 - clamp01((tg - TIMING.skyFrom) / (TIMING.skyTo - TIMING.skyFrom));
    if (sky !== lastSky) {
      backdrop.style.opacity = String(sky);
      lastSky = sky;
    }

    drawSky(elapsed, tg, sky);
    drawFrame(tg);
    drawLabels(tg);
    drawParticles(tg);

    if (!formedSent && tg >= TIMING.formed) {
      formedSent = true;
      onFormed();
    }

    if (tg >= END) {
      onDone();
      return;
    }

    frame = requestAnimationFrame(render);
  };

  const skip = () => {
    if (gatherStart === null) {
      waitOver = true;
      const elapsed = (performance.now() - origin) / 1000;
      if (elapsed < TIMING.gatherAt) origin -= (TIMING.gatherAt - elapsed) * 1000;
      return;
    }
    const tg = ((performance.now() - gatherStart) / 1000) * pace;
    const jumpTo = TIMING.formed - 0.12;
    if (tg < jumpTo) gatherStart -= ((jumpTo - tg) * 1000) / pace;
  };

  const skipEvents: (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
  skipEvents.forEach((type) => window.addEventListener(type, skip, { passive: true }));

  const collect = async () => {
    if (window.location.pathname !== '/') {
      waitOver = true;
      return;
    }
    try {
      await document.fonts?.load(`900 100px ${GLYPH_FONT}`);
    } catch {
      waitOver = true;
      return;
    }
    for (let attempt = 0; attempt < 90 && !cancelled && gatherStart === null; attempt++) {
      await nextFrame();
      if (document.querySelector('[data-glyph-origin]') && attempt >= 3) {
        await nextFrame();
        targets = sampleGlyphs(width, height, maxPoints);
        if (targets) return;
      }
    }
    waitOver = true;
  };

  collect();
  frame = requestAnimationFrame(render);

  return () => {
    cancelled = true;
    cancelAnimationFrame(frame);
    skipEvents.forEach((type) => window.removeEventListener(type, skip));
  };
};
