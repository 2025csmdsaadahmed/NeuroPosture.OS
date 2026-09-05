import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top'
}) => {
  const [visible, setVisible] = useState(false);

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children || (
        <button
          type="button"
          aria-label="More information"
          className="text-slate-400 hover:text-cyan-400 transition-colors p-0.5 focus:outline-none"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      )}

      {visible && (
        <div
          role="tooltip"
          className={`absolute z-50 w-56 px-3 py-2 text-xs font-normal text-slate-200 bg-dark-800/95 backdrop-blur-md rounded-lg border border-slate-700 shadow-xl pointer-events-none transition-opacity duration-150 ${positionStyles[position]}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};
