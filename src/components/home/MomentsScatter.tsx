import { motion } from 'framer-motion';
import { moments } from '../../data/moments';
import OptimizedImage from '../ui/OptimizedImage';
import RuleReveal from '../../journey/RuleReveal';
import FadeIn from '../../journey/FadeIn';
import { easing } from '../../lib/motion';

const TILTS = [-4, 3.5, -2.5, 4, -3.5, 2.5, -4, 3, -2];
const PAPER = '#ede8df';

const MomentsScatter = () => (
  <section className="relative section-space overflow-hidden">
    <div className="shell">
      <RuleReveal
        lines={['Favorite', 'moments']}
        className="font-monument font-black uppercase text-white tracking-tight leading-[0.95] text-[clamp(2.4rem,12vw,3.5rem)]"
      />
      <FadeIn>
        <p className="mt-6 max-w-xs text-base text-white/55">Events, teams, and milestones since 2022.</p>
      </FadeIn>

      <ol className="mt-14 flex flex-col">
        {moments.map((moment, index) => {
          const tilt = TILTS[index % TILTS.length];
          const isRight = index % 2 === 1;
          return (
            <motion.li
              key={moment.id}
              className={`relative w-[82%] ${isRight ? 'ml-auto' : 'mr-auto'} ${index > 0 ? 'mt-8' : ''}`}
              style={{ zIndex: index + 1 }}
              initial={{ opacity: 0, y: 90, rotate: tilt * 4, scale: 0.86 }}
              whileInView={{ opacity: 1, y: 0, rotate: tilt, scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 1.1, ease: easing.expo }}
            >
              <figure
                className="rounded-[6px] p-2.5 pb-4 shadow-[0_16px_24px_-10px_rgba(0,0,0,0.85)]"
                style={{ backgroundColor: PAPER }}
              >
                <div className="aspect-[4/5] overflow-hidden rounded-[3px] bg-black/10">
                  <OptimizedImage
                    src={moment.image}
                    alt={moment.title}
                    className="h-full w-full object-cover"
                    containerClassName="h-full w-full"
                  />
                </div>
                <figcaption className="flex items-baseline justify-between gap-3 px-1 pt-3.5 text-[#1a1622]">
                  <span className="text-[17px] font-semibold leading-tight">{moment.title}</span>
                  <span className="font-monument text-xs font-black tabular-nums text-[#1a1622]/45">
                    {moment.year}
                  </span>
                </figcaption>
              </figure>
            </motion.li>
          );
        })}
      </ol>
    </div>
  </section>
);

export default MomentsScatter;
