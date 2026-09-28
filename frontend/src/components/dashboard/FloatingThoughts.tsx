import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react';
import type { PostureLevel } from '../../types/blynk';

interface FloatingThoughtsProps {
  postureLevel: PostureLevel;
}

const thoughts = {
  left: [
    'Relax the left shoulder and let the arm rest naturally.',
    'A balanced left side reduces neck and upper-back tension.',
    'Keep both feet grounded to support even weight distribution.'
  ],
  center: [
    'A neutral spine keeps your head stacked over your hips.',
    'Sitting straight gives your breathing muscles more room to work.',
    'Small posture corrections now prevent larger strain later.'
  ],
  right: [
    'Check that the right shoulder is not drifting forward.',
    'Even pressure across the seat helps your pelvis stay centered.',
    'A supported lumbar curve keeps focus comfortable for longer.'
  ]
};

export const FloatingThoughts: React.FC<FloatingThoughtsProps> = ({ postureLevel }) => {
  const [thoughtIndex, setThoughtIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setThoughtIndex((index) => (index + 1) % thoughts.center.length), 7000);
    return () => clearInterval(timer);
  }, []);

  const tone = postureLevel === 'critical' ? 'text-red-300' : postureLevel === 'caution' ? 'text-amber-300' : 'text-cyan-300';
  const items = [
    { key: 'left', label: 'LEFT ALIGNMENT', icon: ArrowLeft, color: 'border-sky-500/25 bg-sky-500/5' },
    { key: 'center', label: 'CENTER BALANCE', icon: ArrowDown, color: 'border-cyan-500/30 bg-cyan-500/10' },
    { key: 'right', label: 'RIGHT ALIGNMENT', icon: ArrowRight, color: 'border-blue-500/25 bg-blue-500/5' }
  ] as const;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-3" aria-label="Floating ergonomic thoughts">
      {items.map(({ key, label, icon: Icon, color }) => (
        <div key={key} className={`rounded-2xl border p-4 ${color} transition-all duration-500`}>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            <Icon className={`w-3.5 h-3.5 ${tone}`} />
            {label}
          </div>
          <div className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-slate-300">
            <Lightbulb className="mt-0.5 w-3.5 h-3.5 shrink-0 text-amber-300/80" />
            <p>{thoughts[key][thoughtIndex]}</p>
          </div>
        </div>
      ))}
    </section>
  );
};
