import React from 'react';
import { Card } from '../common/Card';
import { Cpu, Wifi, Server, Activity, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface SystemHealthBarProps {
  blynkConnected: boolean;
  isStale: boolean;
  isDemoMode?: boolean;
}

export const SystemHealthBar: React.FC<SystemHealthBarProps> = ({
  blynkConnected,
  isStale,
  isDemoMode = false
}) => {
  const healthItems = [
    {
      id: 'esp32',
      name: 'ESP32 HARDWARE',
      status: isDemoMode ? 'SIMULATED' : blynkConnected ? 'ONLINE' : 'WAITING',
      isGood: isDemoMode || blynkConnected,
      isWarning: false,
      icon: Cpu,
      detail: 'Sensors: HC-SR04, MLX90614, DHT22, 4xFSR',
      description: isDemoMode
        ? 'Running simulated sensor readings for UI preview.'
        : blynkConnected
        ? 'ESP32 board is active and transmitting sensor telemetry via Wi-Fi.'
        : 'Waiting for ESP32 to connect. Ensure it has a valid Blynk token and Wi-Fi.'
    },
    {
      id: 'blynk',
      name: 'BLYNK CLOUD',
      status: isDemoMode ? 'BYPASSED' : blynkConnected ? 'CONNECTED' : 'OFFLINE',
      isGood: isDemoMode || blynkConnected,
      isWarning: false,
      icon: Wifi,
      detail: 'REST Gateway — blynk.cloud',
      description: isDemoMode
        ? 'Blynk Cloud bypassed. Simulated packets used in its place.'
        : blynkConnected
        ? 'Blynk Cloud REST API responding. Datastreams V0, V2–V6 active.'
        : 'No Blynk token set or token is invalid. Add BLYNK_AUTH_TOKEN to backend/.env.'
    },
    {
      id: 'backend',
      name: 'SECURE BACKEND',
      status: 'CONNECTED',
      isGood: true,
      isWarning: false,
      icon: Server,
      detail: 'Node.js Express — /api/blynk/data',
      description: 'Local backend API is running. Token is stored securely server-side and never exposed to the browser.'
    },
    {
      id: 'data',
      name: 'DATA STREAM',
      status: isDemoMode ? 'DEMO ACTIVE' : isStale ? 'STALE' : blynkConnected ? 'LIVE' : 'NO SIGNAL',
      isGood: isDemoMode || (blynkConnected && !isStale),
      isWarning: isStale && !isDemoMode,
      icon: Activity,
      detail: isStale ? 'Last sync > 15s ago — possible disconnect' : 'Polled every 3 seconds',
      description: isDemoMode
        ? 'Simulated packets cycling through realistic posture states.'
        : isStale
        ? 'Data stream has gone stale (>15s since last packet). Check ESP32 and Wi-Fi connection.'
        : blynkConnected
        ? 'Telemetry packets are flowing in real-time from the DeskCore chair.'
        : 'No telemetry received. Chair hardware or Blynk token may be missing.'
    }
  ];

  const overallOk = healthItems.every((i) => i.isGood);
  const hasWarning = healthItems.some((i) => i.isWarning);

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              SYSTEM HEALTH &amp; TELEMETRY PIPELINE
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Real-time verification of the ESP32 → Blynk Cloud → Backend → UI data chain
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isDemoMode ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[11px] font-bold font-mono">
              <AlertTriangle className="w-3.5 h-3.5" />
              DEMO
            </span>
          ) : overallOk ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              ALL SYSTEMS OK
            </span>
          ) : hasWarning ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[11px] font-bold font-mono">
              <AlertTriangle className="w-3.5 h-3.5" />
              DEGRADED
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-[11px] font-bold font-mono">
              <XCircle className="w-3.5 h-3.5" />
              OFFLINE
            </span>
          )}
        </div>
      </div>

      {/* Health Items Grid — expanded layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {healthItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border flex flex-col gap-3 transition-all ${
                item.isGood
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : item.isWarning
                  ? 'bg-amber-500/5 border-amber-500/20'
                  : 'bg-red-500/5 border-red-500/20'
              }`}
            >
              {/* Top Row: Icon + Name + Status Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl border ${
                      item.isGood
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : item.isWarning
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 tracking-wide">{item.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{item.detail}</div>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono tracking-wider shrink-0 ${
                    item.isGood
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : item.isWarning
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Pipeline Visual Footer */}
      <div className="mt-5 pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono text-slate-500">
        <span className="text-slate-400 font-semibold">ESP32 SENSORS</span>
        <span className="text-slate-700">→</span>
        <span>Wi-Fi</span>
        <span className="text-slate-700">→</span>
        <span className="text-slate-400 font-semibold">BLYNK CLOUD</span>
        <span className="text-slate-700">→</span>
        <span>REST API</span>
        <span className="text-slate-700">→</span>
        <span className="text-slate-400 font-semibold">SECURE BACKEND</span>
        <span className="text-slate-700">→</span>
        <span>JSON /api/blynk/data</span>
        <span className="text-slate-700">→</span>
        <span className="text-cyan-400 font-semibold">NEUROPOSTURE OS UI</span>
      </div>
    </Card>
  );
};
