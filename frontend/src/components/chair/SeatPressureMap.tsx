import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Tooltip } from '../common/Tooltip';
import { Disc, Layers } from 'lucide-react';

interface SeatPressureMapProps {
  fsrFrontLeft: number | null;
  fsrFrontRight: number | null;
  fsrBackLeft: number | null;
  fsrBackRight: number | null;
  isDemoMode?: boolean;
}

export const SeatPressureMap: React.FC<SeatPressureMapProps> = ({
  fsrFrontLeft,
  fsrFrontRight,
  fsrBackLeft,
  fsrBackRight,
  isDemoMode = false
}) => {
  const quadrants = [
    {
      id: 'back-left',
      name: 'BACK LEFT',
      short: 'BL',
      val: fsrBackLeft,
      reservedPin: 'V11',
      desc: 'Rear left thigh/ischial zone'
    },
    {
      id: 'back-right',
      name: 'BACK RIGHT',
      short: 'BR',
      val: fsrBackRight,
      reservedPin: 'V12',
      desc: 'Rear right thigh/ischial zone'
    },
    {
      id: 'front-left',
      name: 'FRONT LEFT',
      short: 'FL',
      val: fsrFrontLeft,
      reservedPin: 'V9',
      desc: 'Front left thigh support zone'
    },
    {
      id: 'front-right',
      name: 'FRONT RIGHT',
      short: 'FR',
      val: fsrFrontRight,
      reservedPin: 'V10',
      desc: 'Front right thigh support zone'
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
              <Badge variant="unavailable">Awaiting V9–V12</Badge>
            )}
            <Tooltip
              content="The ESP32 reads 4 analog FSR pins locally (valFL, valFR, valBL, valBR) to calculate balance and front pressure, but currently does not transmit raw quadrant telemetry to Blynk Cloud."
            />
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-2 mb-4 leading-relaxed">
          4-Point Ischial &amp; Thigh Load Distribution
        </p>

        {/* 4 Quadrants Grid */}
        <div className="grid grid-cols-2 gap-3">
          {quadrants.map((q) => {
            const hasData = q.val !== null && q.val !== undefined;

            return (
              <div
                key={q.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between min-h-[90px] ${
                  hasData
                    ? 'bg-dark-850/80 border-cyan-500/30'
                    : 'bg-dark-900/50 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60" />
                    {q.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {q.reservedPin}
                  </span>
                </div>

                <div className="my-1">
                  {hasData ? (
                    <div className="text-xl font-bold font-mono text-cyan-300">
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
          {isDemoMode ? 'Simulated Telemetry' : 'Calculated on ESP32 • Not in Blynk'}
        </span>
      </div>
    </Card>
  );
};
