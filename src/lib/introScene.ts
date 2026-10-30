import { createSkyStars, createStarPainter, twinkleAt } from './skyStars';

interface SceneCallbacks {
  backdrop: HTMLElement;
  onFormed: () => void;
  onDone: () => void;
}

interface GlyphTargets {
  points: number[];
  lines: number[];
}

const PIXEL_BUDGET = 1_600_000;
const COLORS = ['#ffffff', '#c4b5fd', '#a5f3fc'];
const CONSTELLATION = 'rgba(196, 181, 253, 1)';
const GLYPH_FONT = '"Monument Extended"';

const TIMING = {
  igniteSpread: 0.95,
  ignitePop: 0.32,
  gatherAt: 1.05,
  maxWait: 2.2,
  sweep: 0.5,
  trail: 0.018,
  jitter: 0.12,
  travel: 1.0,
  linesFrom: 0.1,
  linesTo: 0.95,
  linesAlpha: 0.45,
  linesFade: 0.5,
  formed: 1.6,
  release: 1.82,
  settle: 0.45,
  escapeFade: 1.3,
  skyFrom: 1.6,
  skyTo: 2.9,
};

const END = TIMING.release + TIMING.escapeFade + 0.05;

const easeOutExpo = (k: number) => (k >= 1 ? 1 : 1 - Math.pow(2, -10 * k));
const easeInOutQuart = (k: number) =>
  k < 0.5 ? 8 * k * k * k * k : 1 - Math.pow(-2 * k + 2, 4) / 2;
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const anchorLift = (index: number) => {
  const wave = Math.sin(index * 12.9898) * 43758.5453;
  return 0.12 + 0.6 * (wave - Math.floor(wave));
};

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

interface GlyphAnchor {
  x: number;
  y: number;
  left: number;
  right: number;
  size: number;
}

const constellationLines = (anchors: GlyphAnchor[]) => {
  const lines: number[] = [];
  for (let i = 1; i < anchors.length; i++) {
    const previous = anchors[i - 1];
    const current = anchors[i];
    const sameLine = Math.abs(current.y - previous.y) < previous.size;
    const sameWord = current.left - previous.right < previous.size * 0.4;
    if (sameLine && sameWord) lines.push(previous.x, previous.y, current.x, current.y);
  }
  return lines;
};

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
  const anchors: GlyphAnchor[] = [];

  for (const origin of origins) {
    const char = origin.dataset.glyphOrigin ?? '';
    if (!char.trim()) continue;
    const rect = origin.getBoundingClientRect();
    const size = parseFloat(getComputedStyle(origin).fontSize);
    ctx.font = `900 ${size}px ${GLYPH_FONT}`;
    ctx.fillText(char, rect.left, rect.top);
    const glyphWidth = ctx.measureText(char).width;
    anchors.push({
      x: rect.left + glyphWidth / 2,
      y: rect.top - size * anchorLift(anchors.length),
      left: rect.left,
      right: rect.left + glyphWidth,
      size,
    });
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

  return points.length > 100 ? { points, lines: constellationLines(anchors) } : null;
};

const scatterTargets = (width: number, height: number, count: number): GlyphTargets => {
  const points: number[] = [];
  for (let i = 0; i < count; i++) points.push(Math.random() * width, Math.random() * height);
  return { points, lines: [] };
};

export const runIntroScene = (
  canvas: HTMLCanvasElement,
  { backdrop, onFormed, onDone }: SceneCallbacks,
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

  let count = 0;
  let lines: number[] = [];
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

  const prepare = () => {
    const chosen = targets ?? scatterTargets(width, height, maxPoints);
    const points = chosen.points;
    lines = chosen.lines;
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

    for (let i = 0; i < count; i++) {
      tx[i] = points[i * 2];
      ty[i] = points[i * 2 + 1];

      const source = stars[Math.floor(Math.random() * stars.length)];
      sx[i] = source.x * width;
      sy[i] = source.y * height;

      const distance = Math.hypot(tx[i] - sx[i], ty[i] - sy[i]);
      start[i] = (1 - distance / reach) * TIMING.sweep + Math.random() * TIMING.jitter;
      swirl[i] = (Math.random() - 0.5) * 160;

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

  const drawSky = (elapsed: number, fade: number) => {
    const clock = performance.now() / 1000;
    painter.reset();
    for (let i = 0; i < stars.length; i++) {
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

  const drawConstellation = (tg: number) => {
    if (lines.length === 0) return;
    const grow = clamp01((tg - TIMING.linesFrom) / (TIMING.linesTo - TIMING.linesFrom));
    const fade = 1 - clamp01((tg - TIMING.formed) / TIMING.linesFade);
    if (grow <= 0 || fade <= 0) return;

    const segments = lines.length / 4;
    const drawn = grow * segments;
    ctx.globalAlpha = TIMING.linesAlpha * fade;
    ctx.strokeStyle = CONSTELLATION;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let s = 0; s < segments && s < drawn; s++) {
      const portion = Math.min(1, drawn - s);
      const x1 = lines[s * 4];
      const y1 = lines[s * 4 + 1];
      const x2 = lines[s * 4 + 2];
      const y2 = lines[s * 4 + 3];
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 + (x2 - x1) * portion, y1 + (y2 - y1) * portion);
    }
    ctx.stroke();

    for (let s = 0; s < segments && s < drawn; s++) {
      painter.spark(lines[s * 4], lines[s * 4 + 1], 14, fade * 0.9);
      if (drawn - s >= 1) painter.spark(lines[s * 4 + 2], lines[s * 4 + 3], 14, fade * 0.9);
    }
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
      drawSky(elapsed, 1);
      const ready = targets !== null || waitOver || elapsed > TIMING.maxWait;
      if (ready && elapsed >= TIMING.gatherAt) {
        prepare();
        gatherStart = now;
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

    drawSky(elapsed, sky);
    drawConstellation(tg);
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
