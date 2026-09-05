import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'cyan' | 'optimal' | 'caution' | 'critical' | 'none';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = 'none',
  interactive = false
}) => {
  const glowStyles = {
    none: '',
    cyan: 'border-cyan-500/30 shadow-glow-cyan',
    optimal: 'border-emerald-500/30 shadow-glow-optimal',
    caution: 'border-amber-500/30 shadow-glow-caution',
    critical: 'border-red-500/30 shadow-glow-critical'
  };

  return (
    <div
      className={`bg-dark-900/70 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 shadow-glass transition-all duration-300 ${
        glowStyles[glow]
      } ${interactive ? 'hover:border-cyan-500/40 hover:bg-dark-850/80 cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
