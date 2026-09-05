import React from 'react';
import { X, CheckCircle2, Clock, ShieldAlert, Layers } from 'lucide-react';
import { Badge } from '../common/Badge';

interface DataMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataMappingModal: React.FC<DataMappingModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const currentMappings = [
    { key: 'bodyTemperature', pin: 'V0', label: 'Body Temperature', hardware: 'MLX90614 Infrared', live: true },
    { key: 'distance', pin: 'V2', label: 'Head / Body Distance', hardware: 'HC-SR04 Ultrasonic', live: true },
    { key: 'postureStatus', pin: 'V3', label: 'Posture Status', hardware: 'ESP32 State Engine', live: true },
    { key: 'environmentTemperature', pin: 'V4', label: 'Environment Temperature', hardware: 'DHT22 Sensor', live: true },
    { key: 'humidity', pin: 'V5', label: 'Relative Humidity', hardware: 'DHT22 Sensor', live: true },
    { key: 'stressIndex', pin: 'V6', label: 'Stress Index', hardware: 'Bio-environmental calculation', live: true },
  ];

  const futureMappings = [
    { key: 'balanceDifference', pin: 'V7 (Reserved)', label: 'Balance Difference', note: 'Calculated locally on ESP32; awaiting firmware Blynk.virtualWrite', hardware: '4x FSRs' },
    { key: 'frontPressure', pin: 'V8 (Reserved)', label: 'Total Front Pressure', note: 'Calculated locally on ESP32; awaiting firmware Blynk.virtualWrite', hardware: '2x Front FSRs' },
    { key: 'fsrFrontLeft', pin: 'V9 (Reserved)', label: 'FSR Front Left', note: 'Firmware reads ADC; awaiting virtual write', hardware: 'Front Left FSR' },
    { key: 'fsrFrontRight', pin: 'V10 (Reserved)', label: 'FSR Front Right', note: 'Firmware reads ADC; awaiting virtual write', hardware: 'Front Right FSR' },
    { key: 'fsrBackLeft', pin: 'V11 (Reserved)', label: 'FSR Back Left', note: 'Firmware reads ADC; awaiting virtual write', hardware: 'Back Left FSR' },
    { key: 'fsrBackRight', pin: 'V12 (Reserved)', label: 'FSR Back Right', note: 'Firmware reads ADC; awaiting virtual write', hardware: 'Back Right FSR' },
    { key: 'riskScore', pin: 'V13 (Reserved)', label: 'Ergonomic Risk Score', note: 'Reserved for cloud/edge model computation', hardware: 'Analytics Engine' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-dark-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 md:p-8 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Blynk Datastream Mapping
              </h2>
              <p className="text-xs text-slate-400">
                Current ESP32 firmware source of truth vs future extensions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto pr-1 py-4 space-y-6 flex-1">
          {/* Active section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Active Live Firmware Datastreams (ESP32)
              </span>
              <span className="text-[11px] text-slate-400">6 Active Streams</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentMappings.map((m) => (
                <div
                  key={m.key}
                  className="p-3 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {m.pin}
                      </span>
                      <span className="text-xs font-semibold text-slate-200">{m.label}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 pl-1">{m.hardware}</div>
                  </div>
                  <Badge variant="live">LIVE</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Reserved / Future Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Reserved Future Datastreams (V7–V14)
              </span>
              <span className="text-[11px] text-slate-400">Planned Expansion</span>
            </div>
            <div className="space-y-2">
              {futureMappings.map((m) => (
                <div
                  key={m.key}
                  className="p-3 rounded-xl bg-dark-850/50 border border-slate-800/80 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700/60">
                        {m.pin}
                      </span>
                      <span className="text-xs font-semibold text-slate-300">{m.label}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{m.note}</div>
                  </div>
                  <Badge variant="unavailable">Awaiting V2</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Security note */}
          <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-cyan-300">Centralized Configuration & Security Policy</p>
              <p className="text-slate-400 leading-relaxed">
                The Blynk Auth Token resides exclusively in <code className="text-cyan-300 bg-dark-950 px-1 py-0.5 rounded">backend/.env</code>.
                When new datastreams are added to the ESP32 code, simply update the pin in <code className="text-cyan-300 bg-dark-950 px-1 py-0.5 rounded">backend/src/config/blynk.js</code> to immediately activate live visualization.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
