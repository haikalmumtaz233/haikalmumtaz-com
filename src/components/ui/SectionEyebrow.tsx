import FadeIn from '../../journey/FadeIn';
import { homeSections } from '../../data/sections';
import { sectionEyebrow } from '../../lib/sectionLabel';

interface SectionEyebrowProps {
  id: string;
  delay?: number;
  className?: string;
}

const SectionEyebrow = ({ id, delay = 0, className = '' }: SectionEyebrowProps) => {
  const label = sectionEyebrow(id, homeSections);
  if (!label) return null;

  return (
    <FadeIn delay={delay} className={className}>
      <p
        aria-hidden="true"
        className="flex items-center gap-3 font-mono text-xs tabular-nums tracking-[0.2em] text-white/80"
      >
        {label}
        <span className="h-px w-10 bg-white/40" />
      </p>
    </FadeIn>
  );
};

export default SectionEyebrow;
