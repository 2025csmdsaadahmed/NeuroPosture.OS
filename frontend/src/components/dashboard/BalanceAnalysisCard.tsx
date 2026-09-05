import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Tooltip } from '../common/Tooltip';
import { Scale, Compass, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { formatMetric } from '../../utils/formatters';

interface BalanceAnalysisCardProps {
  balanceDifference: number | null;
  frontPressure: number | null;
  isDemoMode?: boolean;
}

export const BalanceAnalysisCard: React.FC<BalanceAnalysisCardProps> = ({
  balanceDifference,
  frontPressure,
  isDemoMode = false
}) => {
  const balMetric = formatMetric(balanceDifference, 'pts', 0);
  const frontMetric = formatMetric(frontPressure, 'pts', 0);

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              BALANCE &amp; FRONT TILT ANALYSIS
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {isDemoMode ? (
              <Badge variant="demo">DEMO ACTIVE</Badge>
            ) : (
              <Badge variant="unavailable">Awaiting V7 &amp; V8</Badge>
            )}
            <Tooltip content="The ESP32 firmware calculates totalLeft, totalRight, balanceDifference, and totalFrontPressure locally, but does not currently send these to Blynk Cloud." />
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-2 mb-4 leading-relaxed">
          Lateral symmetry and anterior thigh load analysis
        </p>

        {/* Two Metric Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Balance Difference */}
          <div className="p-4 rounded-xl bg-dark-850/60 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">BALANCE DIFFERENCE</span>
              <span className="font-mono text-[10px] text-slate-500">V7</span>
            </div>

            <div className="my-2">
              {balMetric.isAvailable ? (
                <div className="text-2xl font-bold font-mono text-amber-300">
                  {balMetric.display}
                </div>
              ) : (
                <div className="text-xs font-medium font-mono text-slate-500 tracking-tight">
                  DATA NOT AVAILABLE
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <ArrowRightLeft className="w-3 h-3" />
              <span>|Total Left - Total Right|</span>
            </div>
          </div>

          {/* Front Pressure */}
          <div className="p-4 rounded-xl bg-dark-850/60 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">FRONT PRESSURE</span>
              <span className="font-mono text-[10px] text-slate-500">V8</span>
            </div>

            <div className="my-2">
              {frontMetric.isAvailable ? (
                <div className="text-2xl font-bold font-mono text-indigo-300">
                  {frontMetric.display}
                </div>
              ) : (
                <div className="text-xs font-medium font-mono text-slate-500 tracking-tight">
                  DATA NOT AVAILABLE
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <Compass className="w-3 h-3" />
              <span>FSR Front Left + Front Right</span>
            </div>
          </div>
        </div>
      </div>

      {/* Firmware Status Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1 text-slate-400">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
          <span>Firmware Status:</span>
        </span>
        <span className="text-slate-500 font-medium">
          Calculated locally on ESP32 • Not transmitted to Blynk
        </span>
      </div>
    </Card>
  );
};
