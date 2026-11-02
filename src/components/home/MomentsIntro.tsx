import { ArrowRight } from 'lucide-react';
import { moments } from '../../data/moments';
import RuleReveal from '../../journey/RuleReveal';
import FadeIn from '../../journey/FadeIn';

const firstYear = moments.at(0)?.year;

interface MomentsIntroProps {
  showHint: boolean;
  titleClassName: string;
}

const MomentsIntro = ({ showHint, titleClassName }: MomentsIntroProps) => (
  <div className="text-left">
    <RuleReveal lines={['Favorite', 'moments']} className={titleClassName} />
    <FadeIn>
      <p className="mt-6 max-w-xs text-base text-white/85 md:mt-8 2xl:text-lg">
        Events, teams, and milestones since {firstYear}.
      </p>
      {showHint && (
        <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-hull/85 px-4 py-2 text-sm text-white/90">
          Scroll to travel the chart
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </p>
      )}
    </FadeIn>
  </div>
);

export default MomentsIntro;
