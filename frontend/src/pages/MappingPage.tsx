import React from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Layers, Terminal, CheckCircle2, Clock } from 'lucide-react';

export const MappingPage: React.FC = () => {
  const currentMappings = [
    { pin: 'V0', name: 'FSR Left', hardware: 'Left FSR pressure sensor', code: 'Blynk.virtualWrite(V0, fsrLeft);', status: 'ACTIVE LIVE' },
    { pin: 'V1', name: 'FSR Right', hardware: 'Right FSR pressure sensor', code: 'Blynk.virtualWrite(V1, fsrRight);', status: 'ACTIVE LIVE' },
    { pin: 'V2', name: 'Head Distance', hardware: 'HC-SR04 Ultrasonic', code: 'Blynk.virtualWrite(V2, distanceCm);', status: 'ACTIVE LIVE' },
    { pin: 'V3', name: 'Body Temperature', hardware: 'MLX90614 Infrared', code: 'Blynk.virtualWrite(V3, bodyTemp);', status: 'ACTIVE LIVE' },
    { pin: 'V4', name: 'Humidity', hardware: 'Humidity sensor', code: 'Blynk.virtualWrite(V4, humidity);', status: 'ACTIVE LIVE' },
    { pin: 'V5', name: 'Risk Score', hardware: 'ESP32 risk calculation', code: 'Blynk.virtualWrite(V5, riskScore);', status: 'ACTIVE LIVE' },
  ];

  const localOnly = [
    { metric: 'Balance Difference', calculation: 'balanceDifference = abs(totalLeft - totalRight)', futurePin: 'V7', notes: 'Calculated in current firmware, printed to Serial, not sent to Blynk' },
    { metric: 'Total Front Pressure', calculation: 'totalFrontPressure = valFL + valFR', futurePin: 'V8', notes: 'Calculated in current firmware, printed to Serial, not sent to Blynk' },
    { metric: 'FSR Front Left', calculation: 'analogRead(FSR_PIN_FL)', futurePin: 'V9', notes: 'ADC read locally on ESP32' },
    { metric: 'FSR Front Right', calculation: 'analogRead(FSR_PIN_FR)', futurePin: 'V10', notes: 'ADC read locally on ESP32' },
    { metric: 'FSR Back Left', calculation: 'analogRead(FSR_PIN_BL)', futurePin: 'V11', notes: 'ADC read locally on ESP32' },
    { metric: 'FSR Back Right', calculation: 'analogRead(FSR_PIN_BR)', futurePin: 'V12', notes: 'ADC read locally on ESP32' },
    { metric: 'Risk Score', calculation: 'Reserved for cloud/edge model', futurePin: 'V13', notes: 'Prepared in backend/frontend architecture' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-6 rounded-3xl bg-dark-900/70 border border-white/[0.08] backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-wide">
              BLYNK DATASTREAM MAPPING &amp; FIRMWARE ARCHITECTURE
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Source of Truth: Real ESP32 code vs future firmware datastreams
          </p>
        </div>
        <Badge variant="live">CENTRALIZED CONFIGURATION</Badge>
      </div>

      {/* Active Blynk Live Streams */}
      <Card>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              CURRENT LIVE BLYNK STREAMS (FIRMWARE V1)
            </h3>
          </div>
          <Badge variant="live">Transmitted via WiFi</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-sans uppercase text-[10px]">
                <th className="pb-3 font-semibold">Datastream</th>
                <th className="pb-3 font-semibold">Metric Name</th>
                <th className="pb-3 font-semibold">Hardware Component</th>
                <th className="pb-3 font-semibold">ESP32 Firmware Source Line</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {currentMappings.map((m) => (
                <tr key={m.pin} className="hover:bg-dark-850/50 transition">
                  <td className="py-3 font-bold text-cyan-400">{m.pin}</td>
                  <td className="py-3 font-sans font-medium text-slate-200">{m.name}</td>
                  <td className="py-3 font-sans text-slate-400">{m.hardware}</td>
                  <td className="py-3 text-cyan-300/80 bg-dark-950/60 px-2 rounded">{m.code}</td>
                  <td className="py-3 text-right">
                    <Badge variant="live">LIVE</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Locally Calculated but Not Sent to Blynk */}
      <Card>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              CALCULATED ON ESP32 BUT NOT TRANSMITTED TO BLYNK (READY FOR V2)
            </h3>
          </div>
          <Badge variant="unavailable">Awaiting additional pins</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-sans uppercase text-[10px]">
                <th className="pb-3 font-semibold">Metric</th>
                <th className="pb-3 font-semibold">Current ESP32 Logic</th>
                <th className="pb-3 font-semibold">Reserved Future Pin</th>
                <th className="pb-3 font-semibold">Firmware Notes</th>
                <th className="pb-3 font-semibold text-right">UI State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {localOnly.map((l) => (
                <tr key={l.metric} className="hover:bg-dark-850/50 transition">
                  <td className="py-3 font-sans font-bold text-slate-200">{l.metric}</td>
                  <td className="py-3 text-amber-300/80 bg-dark-950/60 px-2 rounded">{l.calculation}</td>
                  <td className="py-3 font-bold text-slate-400">{l.futurePin}</td>
                  <td className="py-3 font-sans text-slate-400">{l.notes}</td>
                  <td className="py-3 text-right">
                    <span className="text-[11px] font-medium text-slate-500 font-sans">
                      DATA NOT AVAILABLE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Developer Instructions */}
      <Card>
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-3">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            HOW TO ACTIVATE FUTURE DATASTREAMS
          </h3>
        </div>
        <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
          <p>
            When you update the ESP32 code to add <code className="text-cyan-300 bg-dark-950 px-1 py-0.5 rounded">Blynk.virtualWrite(V7, balanceDifference);</code>, simply update the pin mapping in:
          </p>
          <pre className="p-3 bg-dark-950 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto">
{`// backend/src/config/blynk.js
const BLYNK_MAPPING = {
  ...
  balanceDifference: 'V7', // change from null to 'V7'
  frontPressure: 'V8'      // change from null to 'V8'
};`}
          </pre>
          <p className="text-slate-400">
            The backend normalizer will immediately query V7 and V8, and the frontend will automatically switch from "DATA NOT AVAILABLE" to live numeric telemetry with zero frontend refactoring!
          </p>
        </div>
      </Card>
    </div>
  );
};
