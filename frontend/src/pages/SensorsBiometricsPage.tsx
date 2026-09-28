import React from 'react';
import type { TelemetryData } from '../types/blynk';
import { PrimaryMetricCards } from '../components/dashboard/PrimaryMetricCards';
import { SecondaryMetricCards } from '../components/dashboard/SecondaryMetricCards';

interface SensorsBiometricsPageProps {
  data: TelemetryData;
  isDemoMode: boolean;
}

export const SensorsBiometricsPage: React.FC<SensorsBiometricsPageProps> = ({ data, isDemoMode }) => (
  <div className="space-y-6 animate-fade-in">
    <div className="px-1">
      <p className="eyebrow text-cyan-400/80">Telemetry workspace / 02</p>
      <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white">Sensors &amp; biometrics</h1>
      <p className="mt-1 text-sm text-slate-500">Detailed readings from the chair hardware and derived ergonomic signals.</p>
    </div>

    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">Chair telemetry</h2>
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600">V0 · V2 · V7 · V8</span>
      </div>
      <PrimaryMetricCards
        distance={data.distance}
        balanceDifference={data.balanceDifference}
        frontPressure={data.frontPressure}
        bodyTemperature={data.bodyTemperature}
        isDemoMode={isDemoMode}
      />
    </section>

    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">Environment &amp; risk</h2>
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600">V4 · V5 · V6 · V13</span>
      </div>
      <SecondaryMetricCards
        environmentTemperature={data.environmentTemperature}
        humidity={data.humidity}
        stressIndex={data.stressIndex}
        riskScore={data.riskScore}
        isDemoMode={isDemoMode}
      />
    </section>
  </div>
);
