import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Tooltip } from '../common/Tooltip';
import { CloudRain, Sun, Zap, ShieldCheck } from 'lucide-react';
import { formatMetric } from '../../utils/formatters';

interface SecondaryMetricCardsProps {
  environmentTemperature: number | null;
  humidity: number | null;
  stressIndex: number | null;
  riskScore: number | null;
  isDemoMode?: boolean;
}

export const SecondaryMetricCards: React.FC<SecondaryMetricCardsProps> = ({
  environmentTemperature,
  humidity,
  stressIndex,
  riskScore,
  isDemoMode = false
}) => {
  const envTempFormatted = formatMetric(environmentTemperature, '°C', 1);
  const humidityFormatted = formatMetric(humidity, '%', 1);
  const stressFormatted = formatMetric(stressIndex, '', 1);
  const riskFormatted = formatMetric(riskScore, '/100', 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. ENVIRONMENT TEMPERATURE (Live V4) */}
      <Card>
        <div className="flex items-start justify-between">
          <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <Sun className="w-4 h-4" />
          </div>
          <Badge variant={envTempFormatted.isAvailable ? 'live' : 'unavailable'}>
            {envTempFormatted.isAvailable ? (isDemoMode ? 'DEMO' : 'LIVE V4') : 'NO SIGNAL'}
          </Badge>
        </div>

        <div className="mt-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            DHT22 AMBIENT
          </div>
          <div className="text-xs font-semibold text-slate-200">
            ENVIRONMENT TEMP
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {envTempFormatted.isAvailable ? (
              envTempFormatted.display
            ) : (
              <span className="text-sm font-semibold text-slate-500">DATA NOT AVAILABLE</span>
            )}
          </div>
        </div>

        <div className="mt-2 text-[10px] text-slate-500">
          Source: Blynk V4 (DHT22 Sensor)
        </div>
      </Card>

      {/* 2. HUMIDITY (Live V5) */}
      <Card>
        <div className="flex items-start justify-between">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <CloudRain className="w-4 h-4" />
          </div>
          <Badge variant={humidityFormatted.isAvailable ? 'live' : 'unavailable'}>
            {humidityFormatted.isAvailable ? (isDemoMode ? 'DEMO' : 'LIVE V5') : 'NO SIGNAL'}
          </Badge>
        </div>

        <div className="mt-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            DHT22 AMBIENT
          </div>
          <div className="text-xs font-semibold text-slate-200">
            HUMIDITY
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {humidityFormatted.isAvailable ? (
              humidityFormatted.display
            ) : (
              <span className="text-sm font-semibold text-slate-500">DATA NOT AVAILABLE</span>
            )}
          </div>
        </div>

        <div className="mt-2 text-[10px] text-slate-500">
          Source: Blynk V5 (DHT22 Sensor)
        </div>
      </Card>

      {/* 3. STRESS INDEX (Live V6) */}
      <Card>
        <div className="flex items-start justify-between">
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Zap className="w-4 h-4" />
          </div>
          <Badge variant={stressFormatted.isAvailable ? 'live' : 'unavailable'}>
            {stressFormatted.isAvailable ? (isDemoMode ? 'DEMO' : 'LIVE V6') : 'NO SIGNAL'}
          </Badge>
        </div>

        <div className="mt-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            ESP32 BIO-METRIC
          </div>
          <div className="text-xs font-semibold text-slate-200">
            STRESS INDEX
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {stressFormatted.isAvailable ? (
              stressFormatted.display
            ) : (
              <span className="text-sm font-semibold text-slate-500">DATA NOT AVAILABLE</span>
            )}
          </div>
        </div>

        <div className="mt-2 text-[10px] text-slate-500">
          Computed from Temp &amp; Humidity on ESP32
        </div>
      </Card>

      {/* 4. RISK SCORE (Current firmware does NOT send Risk Score. Must show DATA NOT AVAILABLE) */}
      <Card>
        <div className="flex items-start justify-between">
          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant={riskFormatted.isAvailable && isDemoMode ? 'demo' : 'unavailable'}>
              {riskFormatted.isAvailable && isDemoMode ? 'DEMO V13' : 'FUTURE V13'}
            </Badge>
            <Tooltip content="The current ESP32 firmware does NOT send a Risk Score to Blynk Cloud (V5 is Humidity, not Risk Score). Ready for future V13 stream." />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            ERGONOMIC RISK
          </div>
          <div className="text-xs font-semibold text-slate-200">
            RISK SCORE
          </div>
          <div className="mt-2 text-2xl font-bold font-mono">
            {riskFormatted.isAvailable && isDemoMode ? (
              <span className="text-amber-300">{riskFormatted.display}</span>
            ) : (
              <span className="text-sm font-semibold text-slate-500">DATA NOT AVAILABLE</span>
            )}
          </div>
        </div>

        <div className="mt-2 text-[10px] text-slate-500">
          Reserved for future Blynk V13 datastream
        </div>
      </Card>
    </div>
  );
};
