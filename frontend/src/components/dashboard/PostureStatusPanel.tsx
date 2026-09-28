import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { getPostureLevel } from '../../utils/formatters';
import { CheckCircle2, AlertTriangle, AlertOctagon, HelpCircle, Activity } from 'lucide-react';

interface PostureStatusPanelProps {
  postureStatus: string | null;
  riskScore?: number | null;
  isDemoMode?: boolean;
}

export const PostureStatusPanel: React.FC<PostureStatusPanelProps> = ({
  postureStatus,
  riskScore = null
}) => {
  const level = getPostureLevel(postureStatus ?? (riskScore !== null ? String(riskScore) : null));

  const configs = {
    optimal: {
      title: 'Optimal Alignment',
      badgeText: 'HEALTHY POSTURE',
      badgeVariant: 'optimal' as const,
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/5',
      glow: 'optimal' as const,
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      advice: 'Spine and lumbar curve are properly supported. Keep your feet flat and shoulders relaxed.'
    },
    caution: {
      title: 'Posture Shifting Detected',
      badgeText: 'CAUTION: ADJUST POSITION',
      badgeVariant: 'caution' as const,
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/5',
      glow: 'caution' as const,
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      advice: 'Sensors detect forward spine slouching or balance asymmetry. Lean back into the chair backrest.'
    },
    critical: {
      title: 'Ergonomic Violation Warning',
      badgeText: 'CRITICAL: BAD POSTURE',
      badgeVariant: 'critical' as const,
      border: 'border-red-500/30',
      bg: 'bg-red-500/5',
      glow: 'critical' as const,
      icon: AlertOctagon,
      iconColor: 'text-red-400',
      advice: 'Significant spine curvature deviation or structural imbalance. Straighten posture immediately to avoid cervical strain.'
    },
    unknown: {
      title: 'Awaiting ESP32 Telemetry',
      badgeText: 'CONNECTING...',
      badgeVariant: 'neutral' as const,
      border: 'border-slate-700/50',
      bg: 'bg-slate-900/50',
      glow: 'none' as const,
      icon: HelpCircle,
      iconColor: 'text-slate-400',
      advice: 'Waiting for posture status or risk score telemetry from the connected device.'
    }
  };

  const current = configs[level];
  const Icon = current.icon;

  return (
    <Card glow={current.glow} className={`transition-all duration-300 ${current.bg} ${current.border}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Section: Icon & Live Posture Text */}
        <div className="flex items-start sm:items-center gap-4">
          <div className={`p-3 rounded-2xl bg-dark-900/90 border border-white/10 shadow-lg ${current.iconColor}`}>
            <Icon className="w-7 h-7 animate-pulse-subtle" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                CURRENT ERGONOMIC RISK (BLYNK V5)
              </span>
              <Badge variant={current.badgeVariant}>
                {current.badgeText}
              </Badge>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {postureStatus || (riskScore !== null ? `Risk Score ${riskScore}/100` : 'Waiting for Telemetry...')}
            </h2>
          </div>
        </div>

        {/* Right Section: Ergonomic Guidance */}
        <div className="sm:max-w-xs text-xs text-slate-300 p-3 rounded-xl bg-dark-950/60 border border-slate-800/80">
          <span className="font-bold text-cyan-300 block mb-1">Ergonomic Advice:</span>
          <p className="text-slate-400 leading-relaxed">{current.advice}</p>
        </div>
      </div>
    </Card>
  );
};
