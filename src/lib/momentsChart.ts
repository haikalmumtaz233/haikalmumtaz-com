export interface YearGroup {
  year: string;
  start: number;
  count: number;
}

export interface ChartPoint {
  x: number;
  y: number;
}

export const yearGroups = (items: readonly { year: string }[]): YearGroup[] =>
  items.reduce<YearGroup[]>((groups, item, index) => {
    const last = groups.at(-1);
    if (last && last.year === item.year) {
      return [...groups.slice(0, -1), { ...last, count: last.count + 1 }];
    }
    return [...groups, { year: item.year, start: index, count: 1 }];
  }, []);

const round = (value: number) => Math.round(value * 10) / 10;

export const constellationPath = (points: readonly ChartPoint[]) =>
  points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${round(point.x)} ${round(point.y)}`)
    .join(' ');

export const passedNodes = (points: readonly ChartPoint[], offsetX: number, markerX: number) =>
  points.reduce((last, point, index) => (point.x + offsetX <= markerX ? index : last), -1);

export const revealFraction = (points: readonly ChartPoint[], offsetX: number, markerX: number) => {
  const first = points.at(0);
  const last = points.at(-1);
  if (!first || !last || points.length < 2 || last.x === first.x) return 0;
  const fraction = (markerX - offsetX - first.x) / (last.x - first.x);
  return Math.min(1, Math.max(0, fraction));
};
