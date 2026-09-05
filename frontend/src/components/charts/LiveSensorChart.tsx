import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import type { HistoricalDataPoint } from '../../types/blynk';
import { LineChart as ChartIcon, Lock } from 'lucide-react';

interface LiveSensorChartProps {
  history: HistoricalDataPoint[];
  isDemoMode?: boolean;
}

type AvailableMetric = 'distance' | 'bodyTemperature' | 'environmentTemperature' | 'humidity' | 'stressIndex';

export const LiveSensorChart: React.FC<LiveSensorChartProps> = ({
  history,
  isDemoMode = false
}) => {
  const [selectedMetric, setSelectedMetric] = useState<AvailableMetric>('distance');

  const metricConfigs: Record<
    AvailableMetric,
    { label: string; pin: string; unit: string; color: string; stroke: string; min: number; max: number }
  > = {
    distance: {
      label: 'Head / Body Distance',
      pin: 'V2',
      unit: 'cm',
      color: '#06b6d4',
      stroke: 'rgba(6, 182, 212, 1)',
      min: 20,
      max: 65
    },
    bodyTemperature: {
      label: 'Body Temperature',
      pin: 'V0',
      unit: '°C',
      color: '#38bdf8',
      stroke: 'rgba(56, 189, 248, 1)',
      min: 34,
      max: 40
    },
    environmentTemperature: {
      label: 'Environmental Temperature',
      pin: 'V4',
      unit: '°C',
      color: '#10b981',
      stroke: 'rgba(16, 185, 129, 1)',
      min: 15,
      max: 35
    },
    humidity: {
      label: 'Relative Humidity',
      pin: 'V5',
      unit: '%',
      color: '#3b82f6',
      stroke: 'rgba(59, 130, 246, 1)',
      min: 20,
      max: 80
    },
    stressIndex: {
      label: 'Stress Index',
      pin: 'V6',
      unit: '',
      color: '#a855f7',
      stroke: 'rgba(168, 85, 247, 1)',
      min: 0,
      max: 5
    }
  };

  const futureMetrics = [
    { label: 'Balance Difference', pin: 'V7 (Future)' },
    { label: 'Front Pressure', pin: 'V8 (Future)' },
    { label: 'Risk Score', pin: 'V13 (Future)' },
  ];

  const config = metricConfigs[selectedMetric];

  // Extract numeric points for selected metric
  const validPoints = history
    .map((h, index) => ({
      time: h.time,
      val: h[selectedMetric] !== null ? Number(h[selectedMetric]) : null,
      index
    }))
    .filter((p) => p.val !== null);

  // SVG Chart Dimensions
  const width = 600;
  const height = 200;
  const padding = { top: 20, right: 30, bottom: 30, left: 45 };

  let minVal = config.min;
  let maxVal = config.max;

  if (validPoints.length > 0) {
    const rawVals = validPoints.map((p) => p.val as number);
    const dataMin = Math.min(...rawVals);
    const dataMax = Math.max(...rawVals);
    minVal = Math.min(minVal, Math.floor(dataMin - (dataMax - dataMin) * 0.1));
    maxVal = Math.max(maxVal, Math.ceil(dataMax + (dataMax - dataMin) * 0.1));
    if (minVal === maxVal) {
      minVal -= 1;
      maxVal += 1;
    }
  }

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const pointsCoordinates = validPoints.map((p, idx) => {
    const x =
      validPoints.length > 1
        ? padding.left + (idx / (validPoints.length - 1)) * chartWidth
        : padding.left + chartWidth / 2;
    const y =
      padding.top +
      chartHeight -
      ((p.val! - minVal) / (maxVal - minVal)) * chartHeight;
    return { ...p, x, y };
  });

  const pathD = pointsCoordinates.reduce((acc, curr, i) => {
    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD =
    pointsCoordinates.length > 1
      ? `${pathD} L ${pointsCoordinates[pointsCoordinates.length - 1].x} ${
          padding.top + chartHeight
        } L ${pointsCoordinates[0].x} ${padding.top + chartHeight} Z`
      : '';

  return (
    <Card>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ChartIcon className="w-4 h-4 text-cyan-400" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              LIVE SENSOR TREND
            </h3>
            <span className="text-[11px] text-slate-400">
              Real-time time-series telemetry (Active Blynk streams)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isDemoMode ? 'demo' : 'live'}>
            {isDemoMode ? 'SIMULATED TELEMETRY' : 'REAL STREAM'}
          </Badge>
          <span className="text-[11px] font-mono text-slate-400">
            {validPoints.length} packets recorded
          </span>
        </div>
      </div>

      {/* Metric Selectors (Active & Future) */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {(Object.keys(metricConfigs) as AvailableMetric[]).map((key) => {
          const m = metricConfigs[key];
          const isSelected = selectedMetric === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedMetric(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                isSelected
                  ? 'bg-dark-800 text-white border border-cyan-500/40 shadow-sm'
                  : 'bg-dark-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: m.color }}
              />
              <span>{m.label}</span>
              <span className="text-[10px] font-mono text-slate-400">{m.pin}</span>
            </button>
          );
        })}

        {/* Grayed out future metrics - unclickable as per prompt requirement */}
        {futureMetrics.map((f) => (
          <div
            key={f.label}
            title="Awaiting ESP32 firmware update. Values not plotted."
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900/30 text-slate-600 border border-slate-800/40 cursor-not-allowed select-none"
          >
            <Lock className="w-3 h-3 text-slate-600" />
            <span>{f.label}</span>
            <span className="text-[10px] font-mono text-slate-600">{f.pin}</span>
          </div>
        ))}
      </div>

      {/* SVG Canvas Chart */}
      <div className="mt-4 relative w-full aspect-[2.6/1] min-h-[220px] bg-dark-950/70 border border-slate-800/80 rounded-2xl p-2 overflow-hidden flex items-center justify-center">
        {validPoints.length === 0 ? (
          <div className="text-center text-xs text-slate-500 py-12">
            Waiting for live telemetry packets from Blynk Cloud ({config.pin})...
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`grad-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={config.color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={config.color} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padding.top + chartHeight * ratio;
              const val = (maxVal - ratio * (maxVal - minVal)).toFixed(1);
              return (
                <g key={ratio}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Shaded Area */}
            {areaD && (
              <path
                d={areaD}
                fill={`url(#grad-${selectedMetric})`}
              />
            )}

            {/* Line Path */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke={config.stroke}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data Points */}
            {pointsCoordinates.map((pt, i) => (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="3.5"
                  fill="#0b0f19"
                  stroke={config.color}
                  strokeWidth="2"
                />
              </g>
            ))}
          </svg>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
        <span>
          Showing live window for{' '}
          <strong className="text-white">{config.label}</strong> ({config.unit || 'index'})
        </span>
        <span className="font-mono text-cyan-400">
          Current: {validPoints.length > 0 ? validPoints[validPoints.length - 1].val : '--'}{' '}
          {config.unit}
        </span>
      </div>
    </Card>
  );
};
