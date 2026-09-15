import { useState, useRef, useEffect, memo } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  blurClassName?: string;
  containerClassName?: string;
  eager?: boolean;
}

const OptimizedImage = memo(({
  src,
  alt,
  className = '',
  blurClassName = '',
  containerClassName = '',
  eager = false,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(eager);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (eager || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.01,
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [eager]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${containerClassName}`}>
      <div
        className={`absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 ${blurClassName} ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-500 pointer-events-none`}
      />

      {isInView && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          onLoad={() => setIsLoaded(true)}
          className={`${className} ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-500`}
        />
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
