const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const activeIndexAt = (progress: number, count: number) => {
  if (count <= 0) return 0;
  return clamp(Math.floor(clamp(progress, 0, 1) * count), 0, count - 1);
};

export const segmentTarget = (index: number, count: number, start: number, distance: number) => {
  if (count <= 0) return start;
  const slice = clamp(index, 0, count - 1);
  return start + ((slice + 0.5) / count) * distance;
};
