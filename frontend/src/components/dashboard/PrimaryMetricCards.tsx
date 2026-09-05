import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Tooltip } from '../common/Tooltip';
import { Radio, Scale, Compass, Thermometer } from 'lucide-react';
import { formatMetric } from '../../utils/formatters';

interface PrimaryMetricCardsProps {
  distance: number | null;
  balanceDifference: number | null;
  frontPressure: number | null;
  bodyTemperature: number | null;
  isDemoMode?: boolean;
}

export const PrimaryMetricCards: React.FC<PrimaryMetricCardsProps> = ({
  distance,
  balanceDifference,
  frontPressure,
  bodyTemperature,
  isDemoMode = false
}) => {
  const distFormatted = formatMetric(distance, 'cm', 1);
  const balFormatted = formatMetric(balanceDifference, 'pts', 0);
  const frontFormatted = formatMetric(frontPressure, 'pts', 0);
  const tempFormatted = formatMetric(bodyTemperature, '°C', 1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. DIST (Real Live Blynk V2) */}
      <Card className="relative overflow-hidden group">
        <div className="flex items-start justify-between">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant={distFormatted.isAvailable ? 'live' : 'unavailable'}>
              {distFormatted.isAvailable ? (isDemoMode ? 'DEMO' : 'LIVE V2') : 'NO SIGNAL'}
            </Badge>
            <Tooltip content="Real-time head/spine distance measured by HC-SR04 ultrasonic sensor. Telemetry received via Blynk V2." />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            DIST
          </div>
          <div className="text-xs font-medium text-slate-300 mb-1">
            HEAD / BODY DISTANCE
          </div>

          <div className="mt-2 flex items-baseline gap-1">
            {distFormatted.isAvailable ? (
              <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                {distFormatted.display}
              </span>
            ) : (
              <span className="text-lg font-bold font-mono text-slate-500">
                DATA NOT AVAILABLE
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Target range: 35–50 cm</span>
          <span className="font-mono text-cyan-400">HC-SR04</span>
        </div>
      </Card>

      {/* 2. BAL DIFF (Calculated on ESP32, Awaiting Blynk V7) */}
      <Card className="relative overflow-hidden group">
        <div className="flex items-start justify-between">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Scale className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant={balFormatted.isAvailable && isDemoMode ? 'demo' : 'unavailable'}>
              {balFormatted.isAvailable && isDemoMode ? 'DEMO V7' : 'FUTURE V7'}
            </Badge>
            <Tooltip content="Calculated internally on ESP32 as |totalLeft - totalRight|. Currently not transmitted to Blynk Cloud in this firmware. Ready for future V7." />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            BAL DIFF
          </div>
          <div className="text-xs font-medium text-slate-300 mb-1">
            BALANCE DIFFERENCE
          </div>

          <div className="mt-2 flex items-baseline gap-1">
            {balFormatted.isAvailable ? (
              <span className="text-3xl font-extrabold font-mono text-amber-300 tracking-tight">
                {balFormatted.display}
              </span>
            ) : (
              <span className="text-lg font-bold font-mono text-slate-500 tracking-tight">
                DATA NOT AVAILABLE
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Lateral asymmetry</span>
          <span className="font-mono text-amber-400/80">Awaiting Blynk V7</span>
        </div>
      </Card>

      {/* 3. FRONT P (Calculated on ESP32, Awaiting Blynk V8) */}
      <Card className="relative overflow-hidden group">
        <div className="flex items-start justify-between">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Compass className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant={frontFormatted.isAvailable && isDemoMode ? 'demo' : 'unavailable'}>
              {frontFormatted.isAvailable && isDemoMode ? 'DEMO V8' : 'FUTURE V8'}
            </Badge>
            <Tooltip content="Calculated internally on ESP32 as valFL + valFR. Currently printed to Serial only and not transmitted to Blynk. Ready for future V8." />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            FRONT P
          </div>
          <div className="text-xs font-medium text-slate-300 mb-1">
            TOTAL FRONT PRESSURE
          </div>

          <div className="mt-2 flex items-baseline gap-1">
            {frontFormatted.isAvailable ? (
              <span className="text-3xl font-extrabold font-mono text-indigo-300 tracking-tight">
                {frontFormatted.display}
              </span>
            ) : (
              <span className="text-lg font-bold font-mono text-slate-500 tracking-tight">
                DATA NOT AVAILABLE
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Forward thigh tilt</span>
          <span className="font-mono text-indigo-400/80">Awaiting Blynk V8</span>
        </div>
      </Card>

      {/* 4. BODY TEMP (Real Live Blynk V0) */}
      <Card className="relative overflow-hidden group">
        <div className="flex items-start justify-between">
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <Thermometer className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant={tempFormatted.isAvailable ? 'live' : 'unavailable'}>
              {tempFormatted.isAvailable ? (isDemoMode ? 'DEMO' : 'LIVE V0') : 'NO SIGNAL'}
            </Badge>
            <Tooltip content="Infrared body surface temperature measured by MLX90614 sensor. Telemetry received via Blynk V0." />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            BODY TEMP
          </div>
          <div className="text-xs font-medium text-slate-300 mb-1">
            BODY TEMPERATURE
          </div>

          <div className="mt-2 flex items-baseline gap-1">
            {tempFormatted.isAvailable ? (
              <span className="text-3xl font-extrabold font-mono text-sky-300 tracking-tight">
                {tempFormatted.display}
              </span>
            ) : (
              <span className="text-lg font-bold font-mono text-slate-500">
                DATA NOT AVAILABLE
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Normal: 36.0–37.3 °C</span>
          <span className="font-mono text-sky-400">MLX90614</span>
        </div>
      </Card>
    </div>
  );
};
