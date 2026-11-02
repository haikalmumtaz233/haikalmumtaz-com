import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useIsMobile } from '../../hooks/useMediaQuery';
import MomentsScatter from './MomentsScatter';
import MomentsChart from './MomentsChart';
import MomentsGrid from './MomentsGrid';

const FavoriteMoments = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  if (prefersReducedMotion) return <MomentsGrid />;
  if (isMobile) return <MomentsScatter />;
  return <MomentsChart />;
};

export default FavoriteMoments;
