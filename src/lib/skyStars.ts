import { createRandom, pickSpectralTint, SPECTRAL_TINTS } from './cosmos';

export const SKY_SEED = 1977;

export interface SkyStar {
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

const STAR_AREA = 3400;
const MIN_STARS = 140;
const MAX_STARS = 700;
const MOBILE_WIDTH = 768;
const FLARES_DESKTOP = 7;
const FLARES_MOBILE = 4;

export const skyStarCount = (width: number, height: number) =>
  Math.min(MAX_STARS, Math.max(MIN_STARS, Math.round((width * height) / STAR_AREA)));

export const createSkyStars = (width: number, height: number): SkyStar[] => {
  const random = createRandom(SKY_SEED + 41);
  const count = skyStarCount(width, height);
  const flares = width < MOBILE_WIDTH ? FLARES_MOBILE : FLARES_DESKTOP;
  const stars: SkyStar[] = [];

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

export const starColor = (tint: number, alpha: number) => {
  const [red, green, blue] = SPECTRAL_TINTS[tint];
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const GLOW_SIZE = 24;
const FLARE_SIZE = 72;

export const twinkleAt = (star: SkyStar, time: number) =>
  0.72 + 0.28 * Math.sin(time * star.speed + star.phase);

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
    gradient.addColorStop(0.18, starColor(tint, 0.85));
    gradient.addColorStop(0.45, starColor(tint, 0.18));
    gradient.addColorStop(1, starColor(tint, 0));
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
      gradient.addColorStop(0, starColor(tint, 0));
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(1, starColor(tint, 0));
      ctx.fillStyle = gradient;
      if (horizontal) ctx.fillRect(0, half - 0.6, FLARE_SIZE, 1.2);
      else ctx.fillRect(half - 0.6, 0, 1.2, FLARE_SIZE);
    };
    spike(true);
    spike(false);

    const halo = ctx.createRadialGradient(half, half, 0, half, half, half * 0.42);
    halo.addColorStop(0, 'rgba(255, 255, 255, 1)');
    halo.addColorStop(0.12, starColor(tint, 0.9));
    halo.addColorStop(0.4, starColor(tint, 0.22));
    halo.addColorStop(1, starColor(tint, 0));
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, FLARE_SIZE, FLARE_SIZE);
  });

export const createStarPainter = (ctx: CanvasRenderingContext2D) => {
  const glows = SPECTRAL_TINTS.map((_, tint) => createGlow(tint));
  const flares = SPECTRAL_TINTS.map((_, tint) => createFlare(tint));
  let activeTint = -1;

  const draw = (star: SkyStar, x: number, y: number, twinkle: number, fade = 1, pop = 1) => {
    const alpha = star.brightness * twinkle * fade;
    if (alpha <= 0) return;
    ctx.globalAlpha = Math.min(1, alpha);

    if (star.flare) {
      const size = FLARE_SIZE * (0.55 + 0.45 * twinkle) * pop;
      ctx.drawImage(flares[star.tint], x - size / 2, y - size / 2, size, size);
    } else if (star.size > 1.15 || pop > 1.2) {
      const size = star.size * 7 * pop;
      ctx.drawImage(glows[star.tint], x - size / 2, y - size / 2, size, size);
    } else {
      if (star.tint !== activeTint) {
        activeTint = star.tint;
        ctx.fillStyle = starColor(activeTint, 1);
      }
      ctx.fillRect(x - star.size / 2, y - star.size / 2, star.size, star.size);
    }
  };

  const spark = (x: number, y: number, size: number, alpha: number) => {
    ctx.globalAlpha = alpha;
    ctx.drawImage(glows[1], x - size / 2, y - size / 2, size, size);
  };

  return {
    draw,
    spark,
    reset: () => {
      activeTint = -1;
    },
  };
};
