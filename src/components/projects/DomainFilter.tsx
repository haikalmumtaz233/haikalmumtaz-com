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
          className={`relative shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-colors duration-300 sm:text-sm ${
            isActive ? 'text-white' : 'text-white/55 hover:text-white/85'
          }`}
        >
          {isActive && (
            <m.span
              layoutId="projectsActiveDomain"
              className="absolute inset-0 rounded-full border border-white/20 bg-white/10"
              transition={{ duration: 0.6, ease: easing.expo }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
            {value}
            <span className="tabular-nums text-white/45">{count}</span>
          </span>
        </button>
      );
    })}
  </div>
);

export default DomainFilter;
