import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';

import { getPostureLevel } from '../../utils/formatters';
import { Bell, AlertTriangle, AlertOctagon, CheckCircle2, Zap } from 'lucide-react';

interface AlertItem {
  id: string;
  type: 'optimal' | 'caution' | 'critical' | 'stress';
  title: string;
  message: string;
  timestamp: string;
}

interface AlertsFeedProps {
  postureStatus: string | null;
  stressIndex: number | null;
}

export const AlertsFeed: React.FC<AlertsFeedProps> = ({
  postureStatus,
  stressIndex
}) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    if (!postureStatus) return;

    const level = getPostureLevel(postureStatus);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    let newAlert: AlertItem | null = null;

    if (level === 'critical') {
      newAlert = {
        id: `alert-${Date.now()}`,
        type: 'critical',
        title: 'CRITICAL: Bad Posture!',
        message: 'Severe ergonomic deviation detected by DeskCore sensors. Realign spine immediately.',
        timestamp: now
      };
    } else if (level === 'caution') {
      newAlert = {
        id: `alert-${Date.now()}`,
        type: 'caution',
        title: 'CAUTION: Posture Shifting',
        message: 'Spine posture or seat balance has shifted away from baseline.',
        timestamp: now
      };
    } else if (level === 'optimal') {
      // Only log optimal if the previous wasn't optimal
      newAlert = {
        id: `alert-${Date.now()}`,
        type: 'optimal',
        title: 'Posture Optimal',
        message: 'Ergonomic posture restored. Healthy spine alignment maintained.',
        timestamp: now
      };
    }

    if (newAlert) {
      setAlerts((prev) => {
        // Prevent duplicate consecutive alerts of the same type
        if (prev.length > 0 && prev[0].title === newAlert!.title) {
          return prev;
        }
        return [newAlert!, ...prev.slice(0, 5)];
      });
    }
  }, [postureStatus]);

  // Check stress threshold alert
  useEffect(() => {
    if (stressIndex !== null && stressIndex > 2.5) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const stressAlert: AlertItem = {
        id: `stress-${Date.now()}`,
        type: 'stress',
        title: 'Elevated Stress Index',
        message: `Current stress index is ${stressIndex.toFixed(1)}. Consider taking a brief ergonomic break.`,
        timestamp: now
      };

      setAlerts((prev) => {
        if (prev.some((a) => a.type === 'stress' && (Date.now() - parseInt(a.id.replace('stress-', ''), 10)) < 30000)) {
          return prev;
        }
        return [stressAlert, ...prev.slice(0, 5)];
      });
    }
  }, [stressIndex]);

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              DESKCORE ALERTS
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Real-time Log
          </span>
        </div>

        <div className="mt-4 space-y-2.5">
          {alerts.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 flex flex-col items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-slate-600 mb-2" />
              <span>No alerts recorded yet. Monitoring active posture stream.</span>
            </div>
          ) : (
            alerts.map((alert) => {
              const icons = {
                optimal: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
                caution: <AlertTriangle className="w-4 h-4 text-amber-400" />,
                critical: <AlertOctagon className="w-4 h-4 text-red-400" />,
                stress: <Zap className="w-4 h-4 text-purple-400" />
              };

              const borders = {
                optimal: 'border-emerald-500/20 bg-emerald-500/5',
                caution: 'border-amber-500/20 bg-amber-500/5',
                critical: 'border-red-500/20 bg-red-500/5',
                stress: 'border-purple-500/20 bg-purple-500/5'
              };

              return (
                <div
                  key={alert.id}
                  className={`p-3 rounded-xl border flex items-start gap-3 transition ${borders[alert.type]}`}
                >
                  <div className="mt-0.5 shrink-0">{icons[alert.type]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white truncate">
                        {alert.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {alert.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {alert.message}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500 text-center">
        Derived directly from Blynk stream V3 and ESP32 telemetry
      </div>
    </Card>
  );
};
