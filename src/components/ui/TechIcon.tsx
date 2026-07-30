import type { TechIconSource } from '../../data/icons';

interface TechIconProps {
  icon: TechIconSource;
  name: string;
  className?: string;
}

const TechIcon = ({ icon, name, className = '' }: TechIconProps) => {
  if (icon.kind === 'image') {
    return (
      <img
        src={icon.src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        width={24}
        height={24}
        className={`block w-full h-full object-contain ${className}`}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      data-tech-icon={name}
      className={`block w-full h-full ${className}`}
    >
      <use href={`#${icon.id}`} />
    </svg>
  );
};

export default TechIcon;
