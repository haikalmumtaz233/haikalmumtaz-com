import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import MomentsChart from './MomentsChart';
import MomentsGrid from './MomentsGrid';

const FavoriteMoments = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) return <MomentsGrid />;
  return <MomentsChart />;
};

export default FavoriteMoments;
