import React from 'react';

interface BadgeProps {
  variant?: 'live' | 'demo' | 'unavailable' | 'optimal' | 'caution' | 'critical' | 'neutral';
  children: React.ReactNode;
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  pulse = false,
  className = ''
}) => {
  const variantStyles = {
    live: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    demo: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-glow-caution font-bold',
    unavailable: 'bg-slate-800/80 text-slate-400 border-slate-700/60 font-medium',
    optimal: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-semibold',
    caution: 'bg-amber-500/15 text-amber-300 border-amber-500/30 font-semibold',
    critical: 'bg-red-500/15 text-red-400 border-red-500/30 font-semibold',
    neutral: 'bg-slate-800/60 text-slate-300 border-slate-700/40'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border ${
        variantStyles[variant]
      } ${pulse ? 'animate-pulse' : ''} ${className}`}
    >
      {variant === 'live' && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping-slow inline-block" />
      )}
      {children}
    </span>
  );
};
