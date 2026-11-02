import { m } from 'motion/react';
import type { DomainFilter as DomainOption } from '../../lib/projectIndex';
import { easing } from '../../lib/motion';

interface DomainFilterProps {
  options: DomainOption<string>[];
  selected: string;
  onSelect: (value: string) => void;
}

const DomainFilter = ({ options, selected, onSelect }: DomainFilterProps) => (
  <div
    role="group"
    aria-label="Filter projects by domain"
    className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
  >
    {options.map(({ value, count }) => {
      const isActive = value === selected;

      return (
        <button
          key={value}
          type="button"
          aria-pressed={isActive}
          onClick={() => onSelect(value)}
          className={`relative shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-colors duration-300 sm:text-sm ${
            isActive
              ? 'border-transparent text-[#0d0c14]'
              : 'border-white/15 bg-[#0d0c14]/85 text-white/80 hover:border-white/40 hover:text-white'
          }`}
        >
          {isActive && (
            <m.span
              layoutId="projectsActiveDomain"
              className="absolute -inset-px rounded-full bg-white"
              transition={{ duration: 0.6, ease: easing.expo }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
            {value}
            <span className={`tabular-nums ${isActive ? 'text-black/55' : 'text-white/50'}`}>
              {count}
            </span>
          </span>
        </button>
      );
    })}
  </div>
);

export default DomainFilter;
