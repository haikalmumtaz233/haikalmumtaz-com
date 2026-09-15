interface SceneCallbacks {
  backdrop: HTMLElement;
  onFormed: () => void;
  onDone: () => void;
}

const PIXEL_BUDGET = 1_600_000;
const CURSOR = 'rgba(192, 132, 252, 0.9)';
const COLORS = ['#ffffff', '#c4b5fd', '#a5f3fc'];
const GLYPH_FONT = '"Monument Extended"';

const TIMING = {
  minCursor: 0.85,
  maxWait: 2,
  squash: 0.24,
  burst: 0.6,
  convergeBase: 0.28,
  convergeSweep: 0.45,
  convergeJitter: 0.12,
  convergeDuration: 1.05,
  formed: 1.6,
  release: 1.82,
  settle: 0.45,
  escapeFade: 1.3,
  skyFrom: 0.12,
  skyTo: 1.4,
};

const END = TIMING.release + TIMING.escapeFade + 0.05;

const easeOutExpo = (k: number) => (k >= 1 ? 1 : 1 - Math.pow(2, -10 * k));
const easeInOutQuart = (k: number) => (k < 0.5 ? 8 * k * k * k * k : 1 - Math.pow(-2 * k + 2, 4) / 2);
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const sampleGlyphs = (width: number, height: number, maxPoints: number) => {
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

  for (const origin of origins) {
    const char = origin.dataset.glyphOrigin ?? '';
    if (!char.trim()) continue;
    const rect = origin.getBoundingClientRect();
    const size = parseFloat(getComputedStyle(origin).fontSize);
    ctx.font = `900 ${size}px ${GLYPH_FONT}`;
    ctx.fillText(char, rect.left, rect.top);
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

  return points.length > 100 ? points : null;
};

const scatterTargets = (width: number, height: number, count: number) => {
  const points: number[] = [];
  for (let i = 0; i < count; i++) points.push(Math.random() * width, Math.random() * height);
  return points;
};

export const runIntroScene = (canvas: HTMLCanvasElement, { backdrop, onFormed, onDone }: SceneCallbacks) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    onFormed();
    onDone();
    return () => undefined;
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(PIXEL_BUDGET / (width * height)));
  let lastSky = 1;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const maxPoints = width < 768 ? 900 : 1900;
  const centerX = width / 2;
  const centerY = height / 2;
  const cursorWidth = Math.max(18, Math.min(30, width * 0.02));
  const cursorHeight = cursorWidth * 2;

  let cancelled = false;
  let frame = 0;
  let targets: number[] | null = null;
  let waitOver = false;
  let formedSent = false;
  const mountedAt = performance.now();
  let squashStart: number | null = null;
  let bangStart: number | null = null;
  let pace = 1;

  let count = 0;
  let tx = new Float32Array(0);
  let ty = new Float32Array(0);
  let ex = new Float32Array(0);
  let ey = new Float32Array(0);
  let px = new Float32Array(0);
  let py = new Float32Array(0);
  let start = new Float32Array(0);
  let swirl = new Float32Array(0);
  let vx = new Float32Array(0);
  let vy = new Float32Array(0);
  let group = new Uint8Array(0);
  const groupCount = COLORS.length * 2;
  const segmentsByGroup: number[][] = Array.from({ length: groupCount }, () => []);

  const prepare = () => {
    const points = targets ?? scatterTargets(width, height, maxPoints);
    pace = targets ? 1 : 1.8;
    count = points.length / 2;
    tx = new Float32Array(count);
    ty = new Float32Array(count);
    ex = new Float32Array(count);
    ey = new Float32Array(count);
    px = new Float32Array(count).fill(centerX);
    py = new Float32Array(count).fill(centerY);
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

    const burstRadius = Math.hypot(width, height) * 0.34;

    for (let i = 0; i < count; i++) {
      tx[i] = points[i * 2];
      ty[i] = points[i * 2 + 1];

      const angle = Math.random() * Math.PI * 2;
      const radius = (0.12 + 0.88 * Math.pow(Math.random(), 0.6)) * burstRadius;
      ex[i] = Math.cos(angle) * radius;
      ey[i] = Math.sin(angle) * radius;

      start[i] =
        TIMING.convergeBase + (tx[i] / width) * TIMING.convergeSweep + Math.random() * TIMING.convergeJitter;
      swirl[i] = (Math.random() - 0.5) * 140;

      const dx = tx[i] - nameCenterX;
      const dy = ty[i] - nameCenterY;
      const distance = Math.hypot(dx, dy) || 1;
      const speed = 90 + Math.random() * 260;
      vx[i] = (dx / distance) * speed;
      vy[i] = (dy / distance) * speed - 40 - Math.random() * 80;

      const colorRoll = Math.random();
      const color = colorRoll < 0.1 ? 2 : colorRoll < 0.26 ? 1 : 0;
      const escapes = Math.random() < 0.3 ? 1 : 0;
      group[i] = color * 2 + escapes;
    }
  };

  const drawCursor = (elapsed: number) => {
    ctx.fillStyle = CURSOR;
    if (squashStart === null) {
      if (elapsed % 0.5 < 0.3) {
        ctx.fillRect(centerX - cursorWidth / 2, centerY - cursorHeight / 2, cursorWidth, cursorHeight);
      }
      return;
    }
    const k = easeInOutQuart(clamp01((elapsed - squashStart) / TIMING.squash));
    const w = cursorWidth + (cursorWidth * 3.5 - cursorWidth) * k;
    const h = cursorHeight + (2 - cursorHeight) * k;
    ctx.globalAlpha = 1;
    ctx.fillStyle = k > 0.6 ? '#ffffff' : CURSOR;
    ctx.fillRect(centerX - w / 2, centerY - h / 2, w, h);
  };

  const drawParticles = (tb: number) => {
    const burstK = easeOutExpo(clamp01(tb / TIMING.burst));
    const released = tb >= TIMING.release;
    const releaseTime = tb - TIMING.release;
    const decay = released ? (1 - Math.exp(-2.4 * releaseTime)) / 2.4 : 0;

    for (let i = 0; i < count; i++) {
      let x: number;
      let y: number;

      if (released) {
        const escapes = group[i] & 1;
        x = tx[i] + (escapes ? vx[i] * decay : 0);
        y = ty[i] + (escapes ? vy[i] * decay : 0);
      } else {
        const bx = centerX + ex[i] * burstK;
        const by = centerY + ey[i] * burstK;
        const k = clamp01((tb - start[i]) / TIMING.convergeDuration);
        if (k <= 0) {
          x = bx;
          y = by;
        } else {
          const e = easeInOutQuart(k);
          const dx = tx[i] - bx;
          const dy = ty[i] - by;
          const length = Math.hypot(dx, dy) || 1;
          const arc = Math.sin(Math.PI * e) * swirl[i] * (1 - k * 0.3);
          x = bx + dx * e + (-dy / length) * arc;
          y = by + dy * e + (dx / length) * arc;
        }
      }

      const prevX = px[i];
      const prevY = py[i];
      px[i] = x;
      py[i] = y;
      segmentsByGroup[group[i]].push(prevX, prevY, x, y);
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
    const elapsed = (now - mountedAt) / 1000;
    ctx.clearRect(0, 0, width, height);

    if (bangStart === null) {
      const canBang = (targets !== null || waitOver || elapsed > TIMING.maxWait) && elapsed >= TIMING.minCursor;
      if (canBang && squashStart === null) squashStart = elapsed;
      drawCursor(elapsed);

      if (squashStart !== null && elapsed - squashStart >= TIMING.squash) {
        prepare();
        bangStart = now;
      }
      frame = requestAnimationFrame(render);
      return;
    }

    const tb = ((now - bangStart) / 1000) * pace;
    const sky = 1 - clamp01((tb - TIMING.skyFrom) / (TIMING.skyTo - TIMING.skyFrom));
    if (sky !== lastSky) {
      backdrop.style.opacity = String(sky);
      lastSky = sky;
    }

    if (tb < 0.14) {
      const flash = 1 - tb / 0.14;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 1 + flash * 7, 0, Math.PI * 2);
      ctx.fill();
    }

    drawParticles(tb);

    if (!formedSent && tb >= TIMING.formed) {
      formedSent = true;
      onFormed();
    }

    if (tb >= END) {
      onDone();
      return;
    }

    frame = requestAnimationFrame(render);
  };

  const skip = () => {
    if (bangStart === null) {
      waitOver = true;
      return;
    }
    const tb = ((performance.now() - bangStart) / 1000) * pace;
    const jumpTo = TIMING.formed - 0.12;
    if (tb < jumpTo) bangStart -= ((jumpTo - tb) * 1000) / pace;
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
    for (let attempt = 0; attempt < 90 && !cancelled && bangStart === null; attempt++) {
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
