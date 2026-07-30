import type { ReactNode } from 'react';

interface LedgerProps {
  children: ReactNode;
  label?: string;
}

export const Ledger = ({ children, label }: LedgerProps) => (
  <div className="w-full border-t border-white/15" role="list" aria-label={label}>
    {children}
  </div>
);

interface LedgerRowProps {
  marker: string;
  title: string;
  subtitle?: string;
  meta?: string;
  children?: ReactNode;
}

export const LedgerRow = ({ marker, title, subtitle, meta, children }: LedgerRowProps) => (
  <div
    role="listitem"
    tabIndex={0}
    className="group border-b border-white/15 py-4 md:py-5 transition-colors duration-300 hover:bg-white/[0.03] focus-within:bg-white/[0.03] focus:bg-white/[0.03] focus:outline-none"
  >
    <div className="grid grid-cols-[3.5rem_1fr] md:grid-cols-[5rem_1fr_auto] items-baseline gap-x-4 gap-y-1 px-2 md:px-3">
      <span className="font-mono text-xs md:text-sm tabular-nums text-purple-400">{marker}</span>

      <span className="text-base md:text-xl font-bold text-white leading-snug">{title}</span>

      {meta && (
        <span className="hidden md:block font-mono text-[11px] tabular-nums tracking-wide text-slate-400 whitespace-nowrap">
          {meta}
        </span>
      )}

      <span className="col-start-2 font-mono text-[11px] md:text-xs tracking-wide text-slate-400">
        {subtitle}
      </span>

      {meta && (
        <span className="col-start-2 md:hidden font-mono text-[11px] tabular-nums tracking-wide text-slate-400">
          {meta}
        </span>
      )}
    </div>

    {children && (
      <div className="grid grid-cols-[3.5rem_1fr] md:grid-cols-[5rem_1fr] gap-x-4 px-2 md:px-3">
        <div />
        <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-500 ease-smooth group-hover:max-h-64 group-hover:opacity-100 group-focus-within:max-h-64 group-focus-within:opacity-100 group-focus:max-h-64 group-focus:opacity-100">
          <div className="pt-3 text-sm md:text-base leading-relaxed text-slate-400 max-w-3xl">
            {children}
          </div>
        </div>
      </div>
    )}
  </div>
);
