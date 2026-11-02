import { useMotionValue } from 'motion/react';
import { moments } from '../../data/moments';
import { yearGroups } from '../../lib/momentsChart';
import MomentsIntro from './MomentsIntro';
import MomentPlate from './MomentPlate';

const groups = yearGroups(moments);

const MomentsGrid = () => {
  const still = useMotionValue(0);

  return (
    <section className="relative section-space">
      <div className="shell">
        <div className="mb-12 md:mb-16">
          <MomentsIntro
            showHint={false}
            titleClassName="font-monument font-black uppercase text-white tracking-tight leading-[0.95] text-[clamp(2rem,5.4vw,4.75rem)]"
          />
        </div>

        <div className="grid gap-14">
          {groups.map((group) => (
            <section key={`${group.year}-${group.start}`} aria-label={group.year}>
              <h3 className="mb-6 font-monument text-2xl font-black text-white md:text-3xl">
                {group.year}
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {moments.slice(group.start, group.start + group.count).map((moment) => (
                  <MomentPlate key={moment.id} moment={moment} progress={still} speed={0} fluid />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MomentsGrid;
