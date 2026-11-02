import type { ReactNode } from 'react';
import RuleReveal from '../../journey/RuleReveal';
import FadeIn from '../../journey/FadeIn';
import SectionEyebrow from './SectionEyebrow';

interface SectionHeaderProps {
  title: string[];
  meta?: ReactNode;
  as?: 'h1' | 'h2';
  delay?: number;
  className?: string;
  section?: string;
}

export const SECTION_TITLE_CLASS =
  'font-monument font-black uppercase text-white tracking-tight leading-[0.95] text-[clamp(2rem,5.4vw,4.75rem)]';

const SectionHeader = ({
  title,
  meta,
  as = 'h2',
  delay = 0,
  className = '',
  section,
}: SectionHeaderProps) => (
  <div className={`mb-12 md:mb-16 2xl:mb-20 ${className}`}>
    {section && <SectionEyebrow id={section} delay={delay} className="mb-5 md:mb-6" />}
    <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
      <RuleReveal as={as} lines={title} delay={delay} className={SECTION_TITLE_CLASS} />
      {meta && (
        <FadeIn delay={delay + 0.6} className="pb-1 md:pb-2">
          {meta}
        </FadeIn>
      )}
    </div>
  </div>
);

export default SectionHeader;
