import React from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { LiveSensorChart } from '../components/charts/LiveSensorChart';
import type { HistoricalDataPoint } from '../types/blynk';
import type { UserProfile } from '../types/user';
import { LineChart, Lock, Clock, User } from 'lucide-react';
import { loadCurrentProfile } from '../services/profileStorage';
import { loadSessionsForProfile, loadSessions, formatDuration } from '../services/sessionStorage';

interface AnalyticsPageProps {
  history: HistoricalDataPoint[];
  userProfile?: UserProfile | null;
  isDemoMode: boolean;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  history,
  userProfile,
  isDemoMode
}) => {
  const hasSessionData = history.length > 0;

  // Compute session stats
  const distVals = history.map((h) => h.distance).filter((v): v is number => v !== null);
  const avgDist = distVals.length > 0 ? (distVals.reduce((a, b) => a + b, 0) / distVals.length).toFixed(1) : null;

  const tempVals = history.map((h) => h.bodyTemperature).filter((v): v is number => v !== null);
  const avgTemp = tempVals.length > 0 ? (tempVals.reduce((a, b) => a + b, 0) / tempVals.length).toFixed(1) : null;

  const stressVals = history.map((h) => h.stressIndex).filter((v): v is number => v !== null);
  const avgStress = stressVals.length > 0 ? (stressVals.reduce((a, b) => a + b, 0) / stressVals.length).toFixed(1) : null;

  const optimalCount = history.filter((h) => h.postureStatus && h.postureStatus.includes('Optimal')).length;
  const cautionCount = history.filter((h) => h.postureStatus && h.postureStatus.includes('CAUTION')).length;
  const criticalCount = history.filter((h) => h.postureStatus && h.postureStatus.includes('CRITICAL')).length;
  const currentProfile = loadCurrentProfile();
  const scopedSessions = currentProfile?.id ? loadSessionsForProfile(currentProfile.id) : loadSessions();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-dark-900/70 border border-white/[0.08] backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LineChart className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-wide">
              SESSION ANALYTICS &amp; ERGONOMIC TRENDS
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {userProfile?.fullName ? `${userProfile.fullName}'s posture performance across active Blynk datastreams` : 'Historical logging of active Blynk datastreams across current session'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isDemoMode ? 'demo' : 'live'}>
            {isDemoMode ? 'SIMULATED DATA' : 'REAL BLYNK TELEMETRY'}
          </Badge>
          <span className="text-xs font-mono text-slate-400">
            {history.length} data points logged
          </span>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              CAPTURED LOGIN SESSIONS
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            {currentProfile?.fullName ? `Tracking ${currentProfile.fullName}` : 'Tracking all users'}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {scopedSessions.slice(0, 4).map((session) => (
            <div key={session.id} className="rounded-2xl border border-slate-800 bg-dark-900/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-white">{session.userName}</div>
                  <div className="text-[11px] text-slate-500 font-mono">Profile session</div>
                </div>
                <Badge variant={session.summary.isDemoMode ? 'demo' : 'live'}>
                  {session.summary.isDemoMode ? 'DEMO' : 'LIVE'}
                </Badge>
              </div>
              <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-400 font-mono">
                <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{session.sessionDate} {session.loginTime}</span>
                <span>{formatDuration(session.durationSeconds)}</span>
              </div>
            </div>
          ))}
          {scopedSessions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-dark-900/40 p-6 text-center text-xs text-slate-500">
              No sign-in sessions have been captured yet.
            </div>
          )}
        </div>
      </Card>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="text-[11px] font-bold uppercase text-slate-400">
            AVG HEAD/SPINE DISTANCE
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-cyan-400">
            {avgDist ? `${avgDist} cm` : 'NO HISTORICAL DATA'}
          </div>
          <div className="mt-1 text-[10px] text-slate-500">
            Optimal zone: 35–50 cm
          </div>
        </Card>

        <Card>
          <div className="text-[11px] font-bold uppercase text-slate-400">
            AVG BODY TEMPERATURE
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-sky-400">
            {avgTemp ? `${avgTemp} °C` : 'NO HISTORICAL DATA'}
          </div>
          <div className="mt-1 text-[10px] text-slate-500">
            Measured via MLX90614
          </div>
        </Card>

        <Card>
          <div className="text-[11px] font-bold uppercase text-slate-400">
            AVG STRESS INDEX
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-purple-400">
            {avgStress ? avgStress : 'NO HISTORICAL DATA'}
          </div>
          <div className="mt-1 text-[10px] text-slate-500">
            Normal: 1.0 – 2.5
          </div>
        </Card>

        <Card>
          <div className="text-[11px] font-bold uppercase text-slate-400">
            POSTURE STATE RATIO
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs font-mono">
            <span className="text-emerald-400 font-bold">{optimalCount} Opt</span>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400 font-bold">{cautionCount} Caut</span>
            <span className="text-slate-600">/</span>
            <span className="text-red-400 font-bold">{criticalCount} Crit</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-500">
            Based on V3 status events
          </div>
        </Card>
      </div>

      {/* Live Sensor Trend Chart (moved here from dashboard) */}
      <LiveSensorChart history={history} isDemoMode={isDemoMode} />

      {/* Historical Telemetry Stream Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distance Over Time */}
        <Card>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              DISTANCE OVER TIME (V2)
            </h3>
            <Badge variant="live">LIVE STREAM</Badge>
          </div>
          <div className="py-6">
            {!hasSessionData ? (
              <div className="text-center text-xs font-mono text-slate-500 py-10">
                NO HISTORICAL DATA AVAILABLE
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800/60 font-mono">
                  <span>Packet Timestamp</span>
                  <span>Head/Body Distance</span>
                  <span>Status</span>
                </div>
                {history.slice(-6).reverse().map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/40 font-mono"
                  >
                    <span className="text-slate-400">{h.time}</span>
                    <span className="text-cyan-300 font-semibold">{h.distance ?? '--'} cm</span>
                    <span className="text-[10px] text-slate-500">HC-SR04 Active</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Temperature & Humidity Over Time */}
        <Card>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              THERMAL &amp; HUMIDITY OVER TIME (V0 &amp; V5)
            </h3>
            <Badge variant="live">LIVE STREAM</Badge>
          </div>
          <div className="py-6">
            {!hasSessionData ? (
              <div className="text-center text-xs font-mono text-slate-500 py-10">
                NO HISTORICAL DATA AVAILABLE
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800/60 font-mono">
                  <span>Timestamp</span>
                  <span>Body Temp</span>
                  <span>Humidity</span>
                </div>
                {history.slice(-6).reverse().map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/40 font-mono"
                  >
                    <span className="text-slate-400">{h.time}</span>
                    <span className="text-sky-300 font-semibold">{h.bodyTemperature ?? '--'} °C</span>
                    <span className="text-blue-300 font-semibold">{h.humidity ?? '--'} %</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Future Metrics - Explicit Requirement 28 */}
      <Card>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              PLANNED METRIC STREAMS (AWAITING ESP32 FIRMWARE V2)
            </h3>
          </div>
          <Badge variant="unavailable">AWAITING FIRMWARE</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-dark-850/40 border border-slate-800 text-center">
            <div className="text-xs font-bold text-slate-400">BALANCE DIFFERENCE</div>
            <div className="text-xs font-mono font-medium text-slate-500 mt-2">
              NO HISTORICAL DATA AVAILABLE
            </div>
            <div className="text-[10px] text-slate-600 mt-1">Reserved for V7</div>
          </div>

          <div className="p-4 rounded-xl bg-dark-850/40 border border-slate-800 text-center">
            <div className="text-xs font-bold text-slate-400">FRONT PRESSURE</div>
            <div className="text-xs font-mono font-medium text-slate-500 mt-2">
              NO HISTORICAL DATA AVAILABLE
            </div>
            <div className="text-[10px] text-slate-600 mt-1">Reserved for V8</div>
          </div>

          <div className="p-4 rounded-xl bg-dark-850/40 border border-slate-800 text-center">
            <div className="text-xs font-bold text-slate-400">FSR DISTRIBUTION</div>
            <div className="text-xs font-mono font-medium text-slate-500 mt-2">
              NO HISTORICAL DATA AVAILABLE
            </div>
            <div className="text-[10px] text-slate-600 mt-1">Reserved for V9–V12</div>
          </div>

          <div className="p-4 rounded-xl bg-dark-850/40 border border-slate-800 text-center">
            <div className="text-xs font-bold text-slate-400">RISK SCORE</div>
            <div className="text-xs font-mono font-medium text-slate-500 mt-2">
              NO HISTORICAL DATA AVAILABLE
            </div>
            <div className="text-[10px] text-slate-600 mt-1">Reserved for V13</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
