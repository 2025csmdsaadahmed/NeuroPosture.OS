import React from 'react';
import type { TelemetryData, HistoricalDataPoint } from '../types/blynk';
import { PostureStatusPanel } from '../components/dashboard/PostureStatusPanel';
import { ChairIllustration } from '../components/chair/ChairIllustration';
import { SeatPressureMap } from '../components/chair/SeatPressureMap';
import { AlertsFeed } from '../components/dashboard/AlertsFeed';
import { FloatingThoughts } from '../components/dashboard/FloatingThoughts';
import { getPostureLevel } from '../utils/formatters';

interface DashboardPageProps {
  data: TelemetryData;
  history: HistoricalDataPoint[];
  isDemoMode: boolean;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  data,
  isDemoMode
}) => {
  const postureSignal = data.postureStatus ?? (data.riskScore !== null ? String(data.riskScore) : null);
  const postureLevel = getPostureLevel(postureSignal);

  return (
    <div className="space-y-6 sm:space-y-7 animate-fade-in">
      <div className="flex items-end justify-between gap-4 px-1">
        <div>
          <p className="eyebrow text-cyan-400/80">Live workspace / 01</p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white">Posture command center</h1>
          <p className="mt-1 text-sm text-slate-500">A quiet read on comfort, alignment, and chair health.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Session monitor
        </div>
      </div>
      {/* Demo Mode Notice Banner if Active */}
      {isDemoMode && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 shadow-glow-caution flex items-start sm:items-center justify-between gap-3 text-xs text-amber-200 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <strong className="font-bold uppercase tracking-wider text-amber-300">
              DEMO MODE ACTIVE:
            </strong>
            <span className="leading-relaxed">
              Simulated telemetry packets are active to evaluate UI behavior and charts without a live ESP32 chair.
            </span>
          </div>
          <span className="font-mono text-[11px] text-amber-400 font-semibold">
            Blynk Bypass Active
          </span>
        </div>
      )}

      {/* Prominent Current Posture Banner (Direct from V3) */}
      <PostureStatusPanel
        postureStatus={data.postureStatus}
        riskScore={data.riskScore}
        isDemoMode={isDemoMode}
      />

      <FloatingThoughts postureLevel={postureLevel} />

      {/* The overview keeps the posture story together without loading every
          secondary telemetry stream into the first viewport. */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <ChairIllustration
            postureLevel={postureLevel}
            distance={data.distance}
            bodyTemperature={data.bodyTemperature}
            postureStatusText={data.postureStatus ?? (data.riskScore !== null ? `Risk Score ${data.riskScore}/100` : null)}
            isDemoMode={isDemoMode}
          />
        </div>
        <div className="lg:col-span-5 flex flex-col gap-6">
          <AlertsFeed
            postureStatus={data.postureStatus}
            riskScore={data.riskScore}
            stressIndex={data.stressIndex}
          />
          <SeatPressureMap
            fsrFrontLeft={data.fsrFrontLeft}
            fsrFrontRight={data.fsrFrontRight}
            isDemoMode={isDemoMode}
          />
        </div>
      </div>
    </div>
  );
};
