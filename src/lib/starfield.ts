import { createRandom, pickSpectralTint, SPECTRAL_TINTS, type Random } from './cosmos';

interface StarfieldOptions {
  seed: number;
  reduced: boolean;
  progress: () => number;
}

interface Star {
  x: number;
  y: number;
  depth: number;
  size: number;
  brightness: number;
  phase: number;
  speed: number;
  tint: number;
  flare: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  dx: number;
  dy: number;
  speed: number;
  length: number;
  age: number;
  life: number;
}

const STAR_AREA = 3400;
const MIN_STARS = 140;
const MAX_STARS = 700;
const FLARES_DESKTOP = 7;
const FLARES_MOBILE = 4;
const SCROLL_PARALLAX = 0.07;
const DRIFT_SPEED = 9;
const ARRIVAL_START = 0.75;
const POINTER_REACH = 16;
const GLOW_SIZE = 24;
const FLARE_SIZE = 72;
const MAX_DPR = 2;

const wrap = (value: number, max: number) => ((value % max) + max) % max;

const rgba = (tint: number, alpha: number) => {
  const [red, green, blue] = SPECTRAL_TINTS[tint];
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const createSprite = (size: number, paint: (ctx: CanvasRenderingContext2D) => void) => {
  const sprite = document.createElement('canvas');
  sprite.width = size;
  sprite.height = size;
  const ctx = sprite.getContext('2d');
  if (ctx) paint(ctx);
  return sprite;
};

const createGlow = (tint: number) =>
  createSprite(GLOW_SIZE, (ctx) => {
    const half = GLOW_SIZE / 2;
    const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.18, rgba(tint, 0.85));
    gradient.addColorStop(0.45, rgba(tint, 0.18));
    gradient.addColorStop(1, rgba(tint, 0));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GLOW_SIZE, GLOW_SIZE);
  });

const createFlare = (tint: number) =>
  createSprite(FLARE_SIZE, (ctx) => {
    const half = FLARE_SIZE / 2;
    const spike = (horizontal: boolean) => {
      const gradient = horizontal
        ? ctx.createLinearGradient(0, half, FLARE_SIZE, half)
        : ctx.createLinearGradient(half, 0, half, FLARE_SIZE);
      gradient.addColorStop(0, rgba(tint, 0));
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(1, rgba(tint, 0));
      ctx.fillStyle = gradient;
      if (horizontal) ctx.fillRect(0, half - 0.6, FLARE_SIZE, 1.2);
      else ctx.fillRect(half - 0.6, 0, 1.2, FLARE_SIZE);
    };
    spike(true);
    spike(false);

    const halo = ctx.createRadialGradient(half, half, 0, half, half, half * 0.42);
    halo.addColorStop(0, 'rgba(255, 255, 255, 1)');
    halo.addColorStop(0.12, rgba(tint, 0.9));
    halo.addColorStop(0.4, rgba(tint, 0.22));
    halo.addColorStop(1, rgba(tint, 0));
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, FLARE_SIZE, FLARE_SIZE);
  });

const createStars = (count: number, flares: number, random: Random) => {
  const stars: Star[] = [];
  for (let index = 0; index < count; index++) {
    const brightness = 0.25 + 0.75 * random() ** 2.4;
    stars.push({
      x: random(),
      y: random(),
      depth: 0.3 + random() * 1.3,
      size: 0.5 + brightness * 1.1,
      brightness,
      phase: random() * Math.PI * 2,
      speed: 0.6 + random() * 2.2,
      tint: pickSpectralTint(random),
      flare: false,
    });
  }
  stars.sort((a, b) => b.brightness - a.brightness);
  for (let index = 0; index < flares && index < stars.length; index++) {
    stars[index].flare = true;
    stars[index].brightness = 0.85 + random() * 0.15;
    stars[index].speed *= 0.4;
  }
  return stars.sort((a, b) => a.tint - b.tint);
};

const spawnShootingStar = (width: number, height: number, random: Random): ShootingStar => {
  const heading = Math.PI * 0.78 + (random() - 0.5) * 0.4;
  const direction = random() < 0.5 ? 1 : -1;
  return {
    x: width * (0.15 + random() * 0.7),
    y: height * random() * 0.45,
    dx: Math.cos(heading) * direction,
    dy: Math.sin(heading),
    speed: 900 + random() * 500,
    length: 120 + random() * 120,
    age: 0,
    life: 0.6 + random() * 0.5,
  };
};

export const runStarfield = (canvas: HTMLCanvasElement, options: StarfieldOptions) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const random = createRandom(options.seed + 41);
  const glows = SPECTRAL_TINTS.map((_, tint) => createGlow(tint));
  const flareSprites = SPECTRAL_TINTS.map((_, tint) => createFlare(tint));

  let width = 0;
  let height = 0;
  let stars: Star[] = [];
  let shooting: ShootingStar | null = null;
  let nextShootingAt = 4 + random() * 6;

  let frame = 0;
  let lastTime = 0;
  let elapsed = 0;
  let drift = 0;
  let scroll = window.scrollY;
  let pointerX = 0;
  let pointerY = 0;
  let targetPointerX = 0;
  let targetPointerY = 0;

  const targetCount = () =>
    Math.min(MAX_STARS, Math.max(MIN_STARS, Math.round((width * height) / STAR_AREA)));

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = targetCount();
    if (Math.abs(count - stars.length) > stars.length * 0.25) {
      stars = createStars(count, width < 768 ? FLARES_MOBILE : FLARES_DESKTOP, random);
    }
  };

  const drawShootingStar = (star: ShootingStar) => {
    const travel = star.speed * star.age;
    const headX = star.x + star.dx * travel;
    const headY = star.y + star.dy * travel;
    const tail = Math.min(star.length, travel);
    const tailX = headX - star.dx * tail;
    const tailY = headY - star.dy * tail;
    const fade = Math.sin((Math.PI * star.age) / star.life);

    const gradient = ctx.createLinearGradient(tailX, tailY, headX, headY);
    gradient.addColorStop(0, 'rgba(202, 215, 255, 0)');
    gradient.addColorStop(1, `rgba(255, 255, 255, ${0.9 * fade})`);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(headX, headY);
    ctx.stroke();

    ctx.globalAlpha = fade;
    ctx.drawImage(
      glows[1],
      headX - GLOW_SIZE / 4,
      headY - GLOW_SIZE / 4,
      GLOW_SIZE / 2,
      GLOW_SIZE / 2,
    );
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    const shift = scroll * SCROLL_PARALLAX + drift;
    let activeTint = -1;

    for (const star of stars) {
      const x = wrap(star.x * width + pointerX * star.depth, width);
      const y = wrap(star.y * height - shift * star.depth + pointerY * star.depth, height);
      const twinkle = options.reduced
        ? 1
        : 0.72 + 0.28 * Math.sin(elapsed * star.speed + star.phase);
      const alpha = star.brightness * twinkle;

      if (star.flare) {
        const size = FLARE_SIZE * (0.55 + 0.45 * twinkle);
        ctx.globalAlpha = alpha;
        ctx.drawImage(flareSprites[star.tint], x - size / 2, y - size / 2, size, size);
      } else if (star.size > 1.15) {
        const size = star.size * 7;
        ctx.globalAlpha = alpha;
        ctx.drawImage(glows[star.tint], x - size / 2, y - size / 2, size, size);
      } else {
        if (star.tint !== activeTint) {
          activeTint = star.tint;
          ctx.fillStyle = rgba(activeTint, 1);
        }
        ctx.globalAlpha = alpha;
        ctx.fillRect(x - star.size / 2, y - star.size / 2, star.size, star.size);
      }
    }

    if (shooting) drawShootingStar(shooting);
    ctx.globalAlpha = 1;
  };

  resize();

  if (options.reduced) {
    const redraw = () => {
      resize();
      draw();
    };
    draw();
    window.addEventListener('resize', redraw);
    return () => window.removeEventListener('resize', redraw);
  }

  const handlePointer = (event: PointerEvent) => {
    targetPointerX = ((event.clientX - width / 2) / width) * -POINTER_REACH;
    targetPointerY = ((event.clientY - height / 2) / height) * -POINTER_REACH;
  };

  const tick = (time: number) => {
    const delta = lastTime === 0 ? 0 : Math.min(0.1, (time - lastTime) / 1000);
    lastTime = time;
    elapsed += delta;

    const ease = 1 - Math.exp(-delta * 3);
    pointerX += (targetPointerX - pointerX) * ease;
    pointerY += (targetPointerY - pointerY) * ease;
    scroll += (window.scrollY - scroll) * (1 - Math.exp(-delta * 6));

    const arrival = Math.min(
      1,
      Math.max(0, (options.progress() - ARRIVAL_START) / (1 - ARRIVAL_START)),
    );
    drift += DRIFT_SPEED * (1 - 0.7 * arrival) * delta;

    if (shooting) {
      shooting.age += delta;
      if (shooting.age >= shooting.life) shooting = null;
    } else if (elapsed >= nextShootingAt) {
      shooting = spawnShootingStar(width, height, random);
      nextShootingAt = elapsed + 7 + random() * 9;
    }

    draw();
    frame = requestAnimationFrame(tick);
  };

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', handlePointer, { passive: true });
  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', handlePointer);
  };
};
