import { techCategories } from '../../data/techStack';
import SectionHeader from '../ui/SectionHeader';
import { useIsMobile } from '../../hooks/useMediaQuery';
import TechStackSwitcher from './TechStackSwitcher';
import TechStackShowcase from './TechStackShowcase';

const technologyCount = techCategories.reduce((total, category) => total + category.items.length, 0);

const TechStack = () => {
  const isMobile = useIsMobile();

  return (
    <section className="relative pt-24 md:pt-32 2xl:pt-40 pb-16 md:pb-20">
      <div className="shell">
        <SectionHeader
          title={['Tech stack']}
          meta={
            <p className="text-sm md:text-base text-white/55">
              {technologyCount} technologies in {techCategories.length} areas
            </p>
          }
        />

        {isMobile ? <TechStackSwitcher /> : <TechStackShowcase />}
      </div>
    </section>
  );
};

export default TechStack;
