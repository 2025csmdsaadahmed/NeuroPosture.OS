import React from 'react';
import type { TelemetryData } from '../types/blynk';
import { SystemHealthBar } from '../components/dashboard/SystemHealthBar';

interface SystemTelemetryPageProps {
  data: TelemetryData;
  isDemoMode: boolean;
}

export const SystemTelemetryPage: React.FC<SystemTelemetryPageProps> = ({ data, isDemoMode }) => (
  <div className="space-y-6 animate-fade-in">
    <div className="px-1">
      <p className="eyebrow text-cyan-400/80">Infrastructure workspace / 03</p>
      <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white">System &amp; telemetry pipeline</h1>
      <p className="mt-1 text-sm text-slate-500">Connection health across the ESP32, Blynk Cloud, backend, and UI stream.</p>
    </div>
    <SystemHealthBar
      blynkConnected={data.connected}
      isStale={data.isStale}
      isDemoMode={isDemoMode}
    />
  </div>
);
