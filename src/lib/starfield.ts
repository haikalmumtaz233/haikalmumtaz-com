import { createRandom, type Random } from './cosmos';
import { getIntroPhase } from './intro';
import {
  createSkyStars,
  createStarPainter,
  SKY_SEED,
  skyStarCount,
  twinkleAt,
  type SkyStar,
} from './skyStars';

interface StarfieldOptions {
  reduced: boolean;
  progress: () => number;
  scrollY: () => number;
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

const SCROLL_PARALLAX = 0.07;
const DRIFT_SPEED = 9;
const ARRIVAL_START = 0.75;
const STEER_SPEED = 60;
const STEER_EASE = 2.5;
const SHOOTING_HEAD = 12;
const MAX_DPR = 2;
const PIXEL_BUDGET = 4_000_000;
const CALM_SCROLL = 1.5;
const CALM_STEER = 0.2;

const wrap = (value: number, max: number) => ((value % max) + max) % max;

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

  const random = createRandom(SKY_SEED + 43);
  const painter = createStarPainter(ctx);

  let width = 0;
  let height = 0;
  let stars: SkyStar[] = [];
  let shooting: ShootingStar | null = null;
  let nextShootingAt = 4 + random() * 6;

  let frame = 0;
  let lastTime = 0;
  let elapsed = 0;
  let drift = 0;
  let scroll = options.scrollY();
  let steerX = 0;
  let steerY = 0;
  let targetSteerX = 0;
  let targetSteerY = 0;
  let flowX = 0;
  let flowY = 0;

  let skipFrame = false;

  const resize = () => {
    const nextWidth = window.innerWidth;
    const nextHeight = Math.max(window.innerHeight, nextWidth === width ? height : 0);
    if (nextWidth === width && nextHeight === height) return;
    width = nextWidth;
    height = nextHeight;
    const dpr = Math.min(
      window.devicePixelRatio || 1,
      MAX_DPR,
      Math.sqrt(PIXEL_BUDGET / (width * height)),
    );
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (Math.abs(skyStarCount(width, height) - stars.length) > stars.length * 0.25) {
      stars = createSkyStars(width, height);
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

    painter.spark(headX, headY, SHOOTING_HEAD, fade);
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    const shift = scroll * SCROLL_PARALLAX + drift;
    painter.reset();
    const clock = performance.now() / 1000;

    for (const star of stars) {
      const x = wrap(star.x * width + flowX * star.depth, width);
      const y = wrap(star.y * height + (flowY - shift) * star.depth, height);
      painter.draw(star, x, y, options.reduced ? 1 : twinkleAt(star, clock));
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
    if (event.pointerType !== 'mouse') return;
    targetSteerX = (event.clientX - width / 2) / (width / 2);
    targetSteerY = (event.clientY - height / 2) / (height / 2);
  };

  const releaseSteer = () => {
    targetSteerX = 0;
    targetSteerY = 0;
  };

  const tick = (time: number) => {
    const delta = lastTime === 0 ? 0 : Math.min(0.1, (time - lastTime) / 1000);
    lastTime = time;
    elapsed += delta;

    const phase = getIntroPhase();
    const introHolding = phase === 'playing' || phase === 'formed';
    const ease = 1 - Math.exp(-delta * STEER_EASE);
    steerX += (targetSteerX - steerX) * ease;
    steerY += (targetSteerY - steerY) * ease;
    const scrollTarget = options.scrollY();
    scroll += (scrollTarget - scroll) * (1 - Math.exp(-delta * 6));

    if (!introHolding) {
      const arrival = Math.min(
        1,
        Math.max(0, (options.progress() - ARRIVAL_START) / (1 - ARRIVAL_START)),
      );
      drift += DRIFT_SPEED * (1 - 0.7 * arrival) * delta;
      flowX -= steerX * STEER_SPEED * delta;
      flowY -= steerY * STEER_SPEED * delta;
    }

    if (introHolding) {
      nextShootingAt = elapsed + 3;
    } else if (shooting) {
      shooting.age += delta;
      if (shooting.age >= shooting.life) shooting = null;
    } else if (elapsed >= nextShootingAt) {
      shooting = spawnShootingStar(width, height, random);
      nextShootingAt = elapsed + 7 + random() * 9;
    }

    const calm =
      !shooting &&
      Math.abs(scrollTarget - scroll) < CALM_SCROLL &&
      Math.hypot(steerX, steerY) < CALM_STEER;
    skipFrame = calm && !skipFrame;

    if (phase !== 'playing' && !skipFrame) draw();
    frame = requestAnimationFrame(tick);
  };

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', handlePointer, { passive: true });
  window.addEventListener('blur', releaseSteer);
  document.documentElement.addEventListener('mouseleave', releaseSteer);
  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', handlePointer);
    window.removeEventListener('blur', releaseSteer);
    document.documentElement.removeEventListener('mouseleave', releaseSteer);
  };
};
