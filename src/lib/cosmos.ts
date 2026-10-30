export type Random = () => number;

export interface Bitmap {
  width: number;
  height: number;
  data: Uint8ClampedArray<ArrayBuffer>;
}

export interface PlanetSpec {
  width: number;
  height: number;
  radius: number;
  top: number;
}

export interface CosmosRequest {
  seed: number;
  sky: { width: number; height: number };
  dust: { width: number; height: number };
  planet: PlanetSpec;
}

export interface CosmosLayers {
  sky: Bitmap;
  dust: Bitmap;
  planet: Bitmap;
}

export interface CosmosImages {
  sky: ImageBitmap;
  dust: ImageBitmap;
  planet: ImageBitmap;
}

type Rgb = readonly [number, number, number];

const VIOLET: Rgb = [0.42, 0.25, 0.92];
const TEAL: Rgb = [0.13, 0.62, 0.8];
const MAGENTA: Rgb = [0.86, 0.28, 0.78];
export const SKY_MAX_ALPHA = 0.62;

const STARLIGHT: Rgb = [1, 0.9, 0.82];

export const SPECTRAL_TINTS: readonly Rgb[] = [
  [170, 191, 255],
  [202, 215, 255],
  [248, 247, 255],
  [255, 244, 234],
  [255, 214, 170],
  [255, 188, 140],
];

const SPECTRAL_WEIGHTS = [0.1, 0.2, 0.26, 0.2, 0.14, 0.1];

export const createRandom = (seed: number): Random => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const pickSpectralTint = (random: Random) => {
  let roll = random();
  for (let index = 0; index < SPECTRAL_WEIGHTS.length; index++) {
    roll -= SPECTRAL_WEIGHTS[index];
    if (roll < 0) return index;
  }
  return SPECTRAL_WEIGHTS.length - 1;
};

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

const mix = (a: Rgb, b: Rgb, t: number): Rgb => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

const hash = (x: number, y: number, seed: number) => {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(seed, 2246822519);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

export const valueNoise = (x: number, y: number, seed: number) => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const u = x - xi;
  const v = y - yi;
  const su = u * u * (3 - 2 * u);
  const sv = v * v * (3 - 2 * v);
  const a = hash(xi, yi, seed);
  const b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed);
  const d = hash(xi + 1, yi + 1, seed);
  return a + (b - a) * su + (c - a) * sv + (a - b - c + d) * su * sv;
};

export const fbm = (x: number, y: number, seed: number, octaves: number) => {
  let sum = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let norm = 0;
  for (let octave = 0; octave < octaves; octave++) {
    sum += amplitude * valueNoise(x * frequency, y * frequency, seed + octave * 101);
    norm += amplitude;
    amplitude *= 0.5;
    frequency *= 2.03;
  }
  return sum / norm;
};

export const bandAt = (x: number, y: number, aspect: number) => {
  const length = Math.hypot(1, aspect * 0.7);
  const alongX = 1 / length;
  const alongY = -(aspect * 0.7) / length;
  const dx = x - 0.5;
  const dy = y - aspect * 0.5;
  const along = dx * alongX + dy * alongY;
  const across = dx * -alongY + dy * alongX + 0.035 * Math.sin(along * 6.5);
  const width = 0.15 + 0.04 * Math.sin(along * 3.1 + 1.2);
  return Math.exp(-((across / width) ** 2));
};

export const dustAt = (x: number, y: number, seed: number) =>
  smoothstep(0.5, 0.7, fbm(x * 7 + 3.1, y * 7 - 1.7, seed + 7, 4));

const writePixel = (data: Uint8ClampedArray, offset: number, color: Rgb, alpha: number) => {
  data[offset] = color[0] * 255;
  data[offset + 1] = color[1] * 255;
  data[offset + 2] = color[2] * 255;
  data[offset + 3] = alpha * 255;
};

export const renderSky = (width: number, height: number, seed: number): Bitmap => {
  const data = new Uint8ClampedArray(width * height * 4);
  const aspect = height / width;

  for (let row = 0; row < height; row++) {
    const y = row / width;
    for (let column = 0; column < width; column++) {
      const x = column / width;
      const warpX = fbm(x * 3, y * 3, seed + 1, 3);
      const warpY = fbm(x * 3 + 5.2, y * 3 + 1.3, seed + 2, 3);
      const cloud = fbm(x * 2.2 + 1.6 * warpX, y * 2.2 + 1.6 * warpY, seed + 3, 5);
      const band = bandAt(x, y, aspect);
      const dust = dustAt(x, y, seed) * band;
      const hue = fbm(x * 1.5 + 9, y * 1.5, seed + 5, 3);

      const glow = smoothstep(0.42, 0.85, cloud) * (0.22 + 0.95 * band) + band * 0.34;
      const intensity = glow * (1 - 0.88 * dust);

      let color = mix(VIOLET, TEAL, smoothstep(0.38, 0.66, hue));
      color = mix(color, MAGENTA, smoothstep(0.6, 0.8, cloud) * 0.75);
      color = mix(color, STARLIGHT, band ** 2 * 0.65);

      writePixel(
        data,
        (row * width + column) * 4,
        color,
        SKY_MAX_ALPHA * (1 - Math.exp(-intensity * 1.5)),
      );
    }
  }

  return { width, height, data };
};

const plotMax = (bitmap: Bitmap, x: number, y: number, tint: Rgb, alpha: number) => {
  if (x < 0 || y < 0 || x >= bitmap.width || y >= bitmap.height) return;
  const offset = (y * bitmap.width + x) * 4;
  if (bitmap.data[offset + 3] >= alpha * 255) return;
  bitmap.data[offset] = tint[0];
  bitmap.data[offset + 1] = tint[1];
  bitmap.data[offset + 2] = tint[2];
  bitmap.data[offset + 3] = alpha * 255;
};

const plotDistantGalaxy = (bitmap: Bitmap, random: Random) => {
  const centerX = random() * bitmap.width;
  const centerY = random() * bitmap.height;
  const major = 2.5 + random() * 4;
  const minor = major * (0.3 + random() * 0.6);
  const angle = random() * Math.PI;
  const tint = SPECTRAL_TINTS[random() < 0.6 ? 4 : 1];
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const reach = Math.ceil(major * 2);

  for (let dy = -reach; dy <= reach; dy++) {
    for (let dx = -reach; dx <= reach; dx++) {
      const u = (dx * cos + dy * sin) / major;
      const v = (-dx * sin + dy * cos) / minor;
      const alpha = 0.6 * Math.exp(-(u * u + v * v) * 2.4);
      if (alpha > 0.02)
        plotMax(bitmap, Math.round(centerX + dx), Math.round(centerY + dy), tint, alpha);
    }
  }
};

export const renderDust = (width: number, height: number, seed: number): Bitmap => {
  const bitmap: Bitmap = { width, height, data: new Uint8ClampedArray(width * height * 4) };
  const random = createRandom(seed + 11);
  const aspect = height / width;
  const target = Math.round((width * height) / 85);
  let placed = 0;

  for (let attempt = 0; attempt < target * 6 && placed < target; attempt++) {
    const x = random() * width;
    const y = random() * height;
    const nx = x / width;
    const ny = y / width;
    const band = bandAt(nx, ny, aspect);
    const chance = 0.1 + 0.9 * band * (1 - 0.9 * dustAt(nx, ny, seed));
    if (random() > chance) continue;

    const tint = SPECTRAL_TINTS[pickSpectralTint(random)];
    const alpha = 0.1 + 0.55 * random() ** 3;
    const column = Math.floor(x);
    const row = Math.floor(y);
    plotMax(bitmap, column, row, tint, alpha);
    if (alpha > 0.5) {
      plotMax(bitmap, column + 1, row, tint, alpha * 0.45);
      plotMax(bitmap, column, row + 1, tint, alpha * 0.45);
    }
    placed++;
  }

  const galaxies = Math.max(3, Math.round((width * height) / 260000));
  for (let index = 0; index < galaxies; index++) plotDistantGalaxy(bitmap, random);

  return bitmap;
};

export const PLANET_RISE = 0.36;
export const PLANET_GLOW = 0.08;

export const planetLayout = (viewportWidth: number, viewportHeight: number) => {
  const glow = viewportHeight * PLANET_GLOW;
  return {
    radius: Math.max(viewportWidth * 0.75, viewportHeight * 0.55),
    glow,
    height: glow + viewportHeight * PLANET_RISE,
  };
};

const LIGHT = (() => {
  const x = 0.62;
  const y = -0.3;
  const z = -0.72;
  const length = Math.hypot(x, y, z);
  return { x: x / length, y: y / length, z: z / length };
})();

const LIGHT_EDGE = Math.hypot(LIGHT.x, LIGHT.y);
const NIGHT: Rgb = [0.018, 0.016, 0.032];
const CLOUD_DEEP: Rgb = [0.2, 0.17, 0.46];
const CLOUD_LIT: Rgb = [0.42, 0.64, 0.8];
const AIR: Rgb = [0.62, 0.84, 1];
const AIR_FAR: Rgb = [0.55, 0.4, 1];

export const planetPixel = (x: number, y: number, seed: number): readonly [Rgb, number] => {
  const distance = Math.hypot(x, y);
  const side = smoothstep(-0.35, 0.75, (x * LIGHT.x + y * LIGHT.y) / (distance * LIGHT_EDGE || 1));

  if (distance >= 1) {
    const height = distance - 1;
    const near = Math.exp(-height / 0.01) * 0.85;
    const far = Math.exp(-height / 0.035) * 0.26;
    const glow = 0.05 + 0.95 * side ** 1.5;
    const red = (AIR[0] * near + AIR_FAR[0] * far) * glow;
    const green = (AIR[1] * near + AIR_FAR[1] * far) * glow;
    const blue = (AIR[2] * near + AIR_FAR[2] * far) * glow;
    const alpha = clamp01(Math.max(red, green, blue));
    return alpha > 0 ? [[red / alpha, green / alpha, blue / alpha], alpha] : [NIGHT, 0];
  }

  const z = Math.sqrt(1 - distance * distance);
  const lit = x * LIGHT.x + y * LIGHT.y + z * LIGHT.z;
  const twilight = smoothstep(-0.08, 0.32, lit);
  const rim = (1 - z) ** 4 * smoothstep(-0.2, 0.5, lit) * 0.75;
  let surface: Rgb = [0, 0, 0];

  if (twilight > 0) {
    const swirl = fbm(x * 2.2, y * 2.2, seed + 31, 3) * 1.6;
    const bands = fbm(x * 1.4 + 4, y * 11 + swirl, seed + 37, 4);
    const strength = twilight * (0.12 + 0.6 * Math.max(0, lit));
    const tint = mix(CLOUD_DEEP, CLOUD_LIT, smoothstep(0.3, 0.75, bands));
    surface = [tint[0] * strength, tint[1] * strength, tint[2] * strength];
  }

  return [
    [
      clamp01(NIGHT[0] + surface[0] + AIR[0] * rim),
      clamp01(NIGHT[1] + surface[1] + AIR[1] * rim),
      clamp01(NIGHT[2] + surface[2] + AIR[2] * rim),
    ],
    1,
  ];
};

export const renderPlanet = ({ width, height, radius, top }: PlanetSpec, seed: number): Bitmap => {
  const data = new Uint8ClampedArray(width * height * 4);
  const centerX = width / 2;
  const centerY = top + radius;

  for (let row = 0; row < height; row++) {
    const y = (row + 0.5 - centerY) / radius;
    for (let column = 0; column < width; column++) {
      const x = (column + 0.5 - centerX) / radius;
      const [color, alpha] = planetPixel(x, y, seed);
      const edge = clamp01((1 - Math.hypot(x, y)) * radius + 0.5);
      if (edge > 0 && edge < 1) {
        const [airColor, airAlpha] = planetPixel(x * (1 + 1 / radius), y * (1 + 1 / radius), seed);
        const blended = edge + airAlpha * (1 - edge);
        writePixel(
          data,
          (row * width + column) * 4,
          [
            (color[0] * edge + airColor[0] * airAlpha * (1 - edge)) / blended,
            (color[1] * edge + airColor[1] * airAlpha * (1 - edge)) / blended,
            (color[2] * edge + airColor[2] * airAlpha * (1 - edge)) / blended,
          ],
          blended,
        );
      } else if (alpha > 0) {
        const fade = alpha < 1 ? smoothstep(0, top, row) : 1;
        writePixel(data, (row * width + column) * 4, color, alpha * fade);
      }
    }
  }

  return { width, height, data };
};

export const renderCosmos = (request: CosmosRequest): CosmosLayers => ({
  sky: renderSky(request.sky.width, request.sky.height, request.seed),
  dust: renderDust(request.dust.width, request.dust.height, request.seed),
  planet: renderPlanet(request.planet, request.seed),
});
