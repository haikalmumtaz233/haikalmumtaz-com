import { m, useTransform, type MotionValue } from 'motion/react';
import type { Moment } from '../../data/moments';
import OptimizedImage from '../ui/OptimizedImage';

const withoutFixedWidth = (className: string) =>
  className
    .split(' ')
    .filter((token) => !token.includes('w-['))
    .join(' ');

interface MomentPlateProps {
  moment: Moment;
  progress: MotionValue<number>;
  speed: number;
  fluid?: boolean;
}

const MomentPlate = ({ moment, progress, speed, fluid = false }: MomentPlateProps) => {
  const drift = useTransform(progress, [0, 1], [speed, -speed]);
  const sizeClass = fluid ? `${withoutFixedWidth(moment.className)} w-full` : moment.className;

  return (
    <m.figure
      data-moment-anchor
      className="panel group rounded-2xl p-3"
      style={speed === 0 ? undefined : { y: drift }}
    >
      <div className={`relative overflow-hidden rounded-xl bg-white/4 ${sizeClass}`}>
        <OptimizedImage
          src={moment.image}
          alt={moment.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-expo group-hover:scale-105"
          containerClassName="h-full w-full"
        />
      </div>
      <figcaption className="flex items-center justify-between gap-4 px-1 pt-3.5 pb-1">
        <span className="text-base font-semibold leading-tight text-white md:text-xl">
          {moment.title}
        </span>
        <span className="shrink-0 rounded-full border border-white/15 px-2.5 py-0.5 font-mono text-xs tabular-nums text-white/85">
          {moment.year}
        </span>
      </figcaption>
    </m.figure>
  );
};

export default MomentPlate;
