import { m, type MotionValue } from 'motion/react';
import { constellationPath, type ChartPoint } from '../../lib/momentsChart';

interface MomentsConstellationProps {
  points: ChartPoint[];
  reveal: MotionValue<number>;
  activeIndex: number;
}

const MomentsConstellation = ({ points, reveal, activeIndex }: MomentsConstellationProps) => {
  const path = constellationPath(points);
  if (!path) return null;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
    >
      <path
        d={path}
        fill="none"
        stroke="rgb(255 255 255 / 0.18)"
        strokeWidth={1}
        strokeDasharray="2 6"
      />
      <m.path
        d={path}
        fill="none"
        stroke="rgb(196 181 253 / 0.85)"
        strokeWidth={1.25}
        style={{ pathLength: reveal }}
      />
      {points.map((point, index) => {
        const isLit = index <= activeIndex;
        return (
          <g key={`${point.x}-${point.y}`}>
            <circle
              cx={point.x}
              cy={point.y}
              r={10}
              fill={isLit ? 'rgb(196 181 253 / 0.18)' : 'transparent'}
              className="transition-[fill] duration-500"
            />
            <circle
              cx={point.x}
              cy={point.y}
              r={isLit ? 4 : 3}
              fill={isLit ? '#ffffff' : '#0d0c14'}
              stroke={isLit ? '#ffffff' : 'rgb(255 255 255 / 0.5)'}
              strokeWidth={1}
              className="transition-[fill,stroke] duration-500"
            />
          </g>
        );
      })}
    </svg>
  );
};

export default MomentsConstellation;
