import React from 'react';
import type { TelemetryData, HistoricalDataPoint } from '../types/blynk';
import { PostureStatusPanel } from '../components/dashboard/PostureStatusPanel';
import { PrimaryMetricCards } from '../components/dashboard/PrimaryMetricCards';
import { SecondaryMetricCards } from '../components/dashboard/SecondaryMetricCards';
import { ChairIllustration } from '../components/chair/ChairIllustration';
import { SeatPressureMap } from '../components/chair/SeatPressureMap';
import { AlertsFeed } from '../components/dashboard/AlertsFeed';
import { SystemHealthBar } from '../components/dashboard/SystemHealthBar';
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
  const postureLevel = getPostureLevel(data.postureStatus);

  return (
    <div className="space-y-6">
      {/* Demo Mode Notice Banner if Active */}
      {isDemoMode && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 shadow-glow-caution flex items-center justify-between text-xs text-amber-200 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <strong className="font-bold uppercase tracking-wider text-amber-300">
              DEMO MODE ACTIVE:
            </strong>
            <span>
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
        isDemoMode={isDemoMode}
      />

      {/* Primary Metric Cards (DIST, BAL DIFF, FRONT P, BODY TEMP) */}
      <PrimaryMetricCards
        distance={data.distance}
        balanceDifference={data.balanceDifference}
        frontPressure={data.frontPressure}
        bodyTemperature={data.bodyTemperature}
        isDemoMode={isDemoMode}
      />

      {/* Main Visual Layout: LEFT = Chair + Seat Pressure | RIGHT = System Health (large) + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT Column: Chair Illustration (large) + Seat Pressure Map beneath */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <ChairIllustration
            postureLevel={postureLevel}
            distance={data.distance}
            bodyTemperature={data.bodyTemperature}
            postureStatusText={data.postureStatus}
            isDemoMode={isDemoMode}
          />
          <SeatPressureMap
            fsrFrontLeft={data.fsrFrontLeft}
            fsrFrontRight={data.fsrFrontRight}
            fsrBackLeft={data.fsrBackLeft}
            fsrBackRight={data.fsrBackRight}
            isDemoMode={isDemoMode}
          />
        </div>

        {/* RIGHT Column: System Health Pipeline (large) + Alerts Feed */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <SystemHealthBar
            blynkConnected={data.connected}
            isStale={data.isStale}
            isDemoMode={isDemoMode}
          />
          <AlertsFeed
            postureStatus={data.postureStatus}
            stressIndex={data.stressIndex}
          />
        </div>
      </div>

      {/* Secondary Metric Cards (ENV TEMP, HUMIDITY, STRESS INDEX, RISK SCORE) */}
      <SecondaryMetricCards
        environmentTemperature={data.environmentTemperature}
        humidity={data.humidity}
        stressIndex={data.stressIndex}
        riskScore={data.riskScore}
        isDemoMode={isDemoMode}
      />
    </div>
  );
};
