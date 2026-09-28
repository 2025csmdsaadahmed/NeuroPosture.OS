import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Tooltip } from '../common/Tooltip';
import { Disc, Layers } from 'lucide-react';

interface SeatPressureMapProps {
  fsrFrontLeft: number | null;
  fsrFrontRight: number | null;
  isDemoMode?: boolean;
}

export const SeatPressureMap: React.FC<SeatPressureMapProps> = ({
  fsrFrontLeft,
  fsrFrontRight,
  isDemoMode = false
}) => {
  const quadrants = [
    {
      id: 'back-left',
      name: 'BACK LEFT',
      short: 'BL',
      val: null,
      reservedPin: 'V11',
      desc: 'Not connected in current Blynk mapping'
    },
    {
      id: 'back-right',
      name: 'BACK RIGHT',
      short: 'BR',
      val: null,
      reservedPin: 'V12',
      desc: 'Not connected in current Blynk mapping'
    },
    {
      id: 'left',
      name: 'FSR LEFT',
      short: 'L',
      val: fsrFrontLeft,
      reservedPin: 'V0',
      desc: 'Left seat pressure sensor'
    },
    {
      id: 'right',
      name: 'FSR RIGHT',
      short: 'R',
      val: fsrFrontRight,
      reservedPin: 'V1',
      desc: 'Right seat pressure sensor'
    }
  ];

  return (
    <Card className="h-full flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Disc className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              PRESSURE MONITORING
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {isDemoMode ? (
              <Badge variant="demo">DEMO ACTIVE</Badge>
            ) : (
              <Badge variant="live">V0–V1 ACTIVE</Badge>
            )}
            <Tooltip
              content="The current device transmits two FSR readings: left on V0 and right on V1."
            />
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-2 mb-4 leading-relaxed">
          4-Point Ischial &amp; Thigh Load Distribution
        </p>

        {/* 4 Quadrants Grid */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {quadrants.map((q) => {
            const hasData = q.val !== null && q.val !== undefined;

            return (
              <div
                key={q.id}
                className={`p-3 rounded-xl border transition-all flex flex-col justify-between min-h-[112px] ${
                  hasData
                    ? 'bg-dark-850/80 border-cyan-500/30'
                    : 'bg-dark-900/50 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-300 flex items-center gap-1 text-[10px] xl:text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60" />
                    {q.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {q.reservedPin}
                  </span>
                </div>

                <div className="my-1">
                  {hasData ? (
                    <div className="text-lg xl:text-xl font-bold font-mono text-cyan-300">
                      {q.val}{' '}
                      <span className="text-[11px] text-slate-400 font-normal">pts</span>
                    </div>
                  ) : (
                    <div className="text-[11px] font-medium font-mono text-slate-500 uppercase tracking-tight">
                      DATA NOT AVAILABLE
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 truncate">
                  {q.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info Notice */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-500" />
          <span>FSR Telemetry Flow:</span>
        </span>
        <span className="text-slate-500 font-mono">
          {isDemoMode ? 'Simulated Telemetry' : 'Blynk V0 / V1'}
        </span>
      </div>
    </Card>
  );
};
