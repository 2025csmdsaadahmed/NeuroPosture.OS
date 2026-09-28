import React, { useState } from 'react';
import type { PostureLevel } from '../../types/blynk';
import { Radio, Thermometer, Disc } from 'lucide-react';

interface ChairIllustrationProps {
  postureLevel: PostureLevel;
  distance: number | null;
  bodyTemperature: number | null;
  postureStatusText: string | null;
  isDemoMode?: boolean;
}

export const ChairIllustration: React.FC<ChairIllustrationProps> = ({
  postureLevel,
  distance,
  bodyTemperature,
  postureStatusText,
  isDemoMode = false
}) => {
  const [activePin, setActivePin] = useState<string | null>(null);

  // Soft posture glow styling
  const glowColors = {
    optimal: 'rgba(16, 185, 129, 0.12)',
    caution: 'rgba(245, 158, 11, 0.14)',
    critical: 'rgba(239, 68, 68, 0.18)',
    unknown: 'rgba(56, 189, 248, 0.10)'
  };

  const ringColors = {
    optimal: 'border-emerald-500/40 text-emerald-400',
    caution: 'border-amber-500/40 text-amber-300',
    critical: 'border-red-500/40 text-red-400',
    unknown: 'border-cyan-500/40 text-cyan-400'
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-6 sm:p-8 bg-dark-900/40 rounded-3xl border border-white/[0.05] shadow-glass backdrop-blur-md overflow-hidden">
      {/* Dynamic ambient backdrop glow representing overall posture state */}
      <div
        className="absolute inset-0 transition-all duration-700 pointer-events-none rounded-3xl"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${glowColors[postureLevel]} 0%, transparent 70%)`
        }}
      />

      {/* Top Header Label */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800/60 z-10 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            DESKCORE SMART CHAIR
          </span>
          <span className="text-[10px] text-slate-500 font-mono">MODEL-ERGO-01</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-400">Posture:</span>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full border ${ringColors[postureLevel]}`}
          >
            {postureStatusText || 'Awaiting telemetry'}
          </span>
        </div>
      </div>

      {/* SVG Normal Ergonomic Office Chair Illustration */}
      <div className="relative w-full max-w-[520px] aspect-[1/1.2] flex items-center justify-center my-3 select-none">
        <svg
          viewBox="0 0 320 400"
          className="w-full h-full drop-shadow-2xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Grid / Positioning guidelines */}
          <circle cx="160" cy="200" r="140" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 4" />

          {/* CHAIR BASE & CASTERS (Normal 5-Star Ergonomic Base) */}
          <g id="chair-base" opacity="0.95">
            {/* Center column & pneumatic cylinder */}
            <rect x="154" y="270" width="12" height="42" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <rect x="156" y="275" width="8" height="30" rx="2" fill="#0f172a" />
            {/* Base hub */}
            <ellipse cx="160" cy="312" rx="14" ry="7" fill="#334155" stroke="#475569" strokeWidth="1.5" />
            {/* 5 Caster Legs */}
            {/* Center leg */}
            <path d="M160 312 L160 358" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
            {/* Left legs */}
            <path d="M154 314 L85 352" stroke="#334155" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M152 310 L105 328" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" />
            {/* Right legs */}
            <path d="M166 314 L235 352" stroke="#334155" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M168 310 L215 328" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" />

            {/* Caster Wheels */}
            <circle cx="160" cy="364" r="6" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            <circle cx="82" cy="356" r="6" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            <circle cx="238" cy="356" r="6" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            <circle cx="102" cy="331" r="5" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <circle cx="218" cy="331" r="5" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
          </g>

          {/* SEAT PAN (Normal Contoured Waterfall Cushion) */}
          <g id="chair-seat">
            {/* Seat bottom mechanism */}
            <rect x="142" y="258" width="36" height="14" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            {/* Seat cushion */}
            <path
              d="M78 244 C78 236 94 228 160 228 C226 228 242 236 242 244 C242 254 228 262 160 262 C92 262 78 254 78 244 Z"
              fill="#1e294b"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />
            {/* Contoured inner cushion shading */}
            <path
              d="M86 243 C86 238 100 232 160 232 C220 232 234 238 234 243 C234 250 220 256 160 256 C100 256 86 250 86 243 Z"
              fill="#0f172a"
              opacity="0.8"
            />

            {/* 4 FSR Seat Contact Nodes (FL, FR, BL, BR) */}
            {/* Back Left FSR */}
            <rect x="110" y="235" width="16" height="8" rx="2" fill="#334155" stroke="#475569" strokeWidth="1" />
            {/* Back Right FSR */}
            <rect x="194" y="235" width="16" height="8" rx="2" fill="#334155" stroke="#475569" strokeWidth="1" />
            {/* Front Left FSR */}
            <rect x="105" y="247" width="18" height="9" rx="2" fill="#334155" stroke="#475569" strokeWidth="1" />
            {/* Front Right FSR */}
            <rect x="197" y="247" width="18" height="9" rx="2" fill="#334155" stroke="#475569" strokeWidth="1" />
          </g>

          {/* BACKREST & LUMBAR (Normal High-Back Ergonomic Task Chair) */}
          <g id="chair-backrest">
            {/* Spine structural support frame */}
            <path
              d="M160 230 L160 110"
              stroke="#1e293b"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Lumbar support arch */}
            <path
              d="M112 186 Q160 178 208 186"
              stroke="#38bdf8"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeOpacity="0.5"
            />

            {/* Mesh Backrest outer frame */}
            <path
              d="M106 195 C102 160 106 100 118 80 C124 72 136 68 160 68 C184 68 196 72 202 80 C214 100 218 160 214 195 C210 214 196 220 160 220 C124 220 110 214 106 195 Z"
              fill="#0b1329"
              stroke="#475569"
              strokeWidth="2.5"
            />

            {/* Breathable ergonomic mesh weave lines */}
            <path d="M120 95 Q160 102 200 95" stroke="#1e294b" strokeWidth="1.2" />
            <path d="M115 115 Q160 123 205 115" stroke="#1e294b" strokeWidth="1.2" />
            <path d="M112 135 Q160 144 208 135" stroke="#1e294b" strokeWidth="1.2" />
            <path d="M110 155 Q160 165 210 155" stroke="#1e294b" strokeWidth="1.2" />
            <path d="M110 175 Q160 185 210 175" stroke="#1e294b" strokeWidth="1.2" />
            <path d="M112 195 Q160 204 208 195" stroke="#1e294b" strokeWidth="1.2" />

            {/* Headrest */}
            <rect x="135" y="44" width="50" height="20" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.4" />
            <rect x="155" y="64" width="10" height="7" fill="#334155" />
          </g>

          {/* 3D ARMRESTS (Normal Ergonomic Task Chair Armrests) */}
          <g id="chair-armrests">
            {/* Left Armrest stem & pad */}
            <path d="M88 238 L68 200 L68 178" stroke="#334155" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="56" y="170" width="26" height="8" rx="4" fill="#1e294b" stroke="#475569" strokeWidth="1.5" />
            {/* Right Armrest stem & pad */}
            <path d="M232 238 L252 200 L252 178" stroke="#334155" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="238" y="170" width="26" height="8" rx="4" fill="#1e294b" stroke="#475569" strokeWidth="1.5" />
          </g>

          {/* SENSOR PIN 1: HC-SR04 DISTANCE SENSOR (Chair Back / Head Area) */}
          <g
            id="pin-distance"
            className="cursor-pointer"
            onClick={() => setActivePin(activePin === 'distance' ? null : 'distance')}
          >
            {/* Sensor Radar Rings */}
            <circle cx="160" cy="54" r="14" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" className="animate-ping-slow" />
            <circle cx="160" cy="54" r="7" fill="#06b6d4" fillOpacity="0.3" stroke="#06b6d4" strokeWidth="2" />
            <circle cx="160" cy="54" r="2.5" fill="#ffffff" />
          </g>

          {/* SENSOR PIN 2: MLX90614 BODY TEMP SENSOR (Mid-Back / Lumbar Contact) */}
          <g
            id="pin-temp"
            className="cursor-pointer"
            onClick={() => setActivePin(activePin === 'temp' ? null : 'temp')}
          >
            <circle cx="160" cy="140" r="10" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
            <circle cx="160" cy="140" r="5" fill="#38bdf8" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="160" cy="140" r="1.8" fill="#ffffff" />
          </g>

          {/* SENSOR PIN 3: 4x FSR PRESSURE MATRIX (Seat Cushion Area) */}
          <g
            id="pin-fsr"
            className="cursor-pointer"
            onClick={() => setActivePin(activePin === 'fsr' ? null : 'fsr')}
          >
            <rect x="145" y="240" width="30" height="12" rx="4" fill="#0f172a" stroke="#64748b" strokeWidth="1.2" strokeDasharray="2 2" />
            <circle cx="160" cy="246" r="3.5" fill="#64748b" />
          </g>
        </svg>

        {/* Interactive Floating Sensor Callouts */}
        {/* Distance Pin Callout (V2) */}
        <div className="absolute top-1 right-2 sm:right-6 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-950/90 border border-cyan-500/40 shadow-lg text-[11px] text-cyan-300 backdrop-blur-md">
          <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span className="font-semibold font-mono">
            {distance !== null ? `${distance} cm` : 'HC-SR04: V2'}
          </span>
        </div>

        {/* Thermal Pin Callout (V3) */}
        <div className="absolute top-28 left-2 sm:left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-950/90 border border-sky-500/40 shadow-lg text-[11px] text-sky-300 backdrop-blur-md">
          <Thermometer className="w-3 h-3 text-sky-400" />
          <span className="font-semibold font-mono">
            {bodyTemperature !== null ? `${bodyTemperature} °C` : 'MLX90614: V3'}
          </span>
        </div>

        {/* Seat FSR Callout */}
        <div className="absolute bottom-16 right-2 sm:right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-950/90 border border-slate-700 shadow-lg text-[11px] text-slate-400 backdrop-blur-md">
          <Disc className="w-3 h-3 text-slate-400" />
          <span className="font-medium">
            {isDemoMode ? 'FSR Matrix (Demo Active)' : '4x FSR: Local on ESP32'}
          </span>
        </div>
      </div>

      {/* Sensor Legend / Sub-panel */}
      <div className="w-full mt-2 pt-3 border-t border-slate-800/60 grid grid-cols-3 gap-2 text-center text-[11px] z-10">
        <div className="p-2 rounded-xl bg-dark-950/50 border border-slate-800">
          <div className="text-slate-400 font-medium">Ultrasonic V2</div>
          <div className="text-cyan-400 font-mono font-semibold mt-0.5">
            {distance !== null ? `${distance} cm` : 'Active'}
          </div>
        </div>
        <div className="p-2 rounded-xl bg-dark-950/50 border border-slate-800">
          <div className="text-slate-400 font-medium">IR Body V3</div>
          <div className="text-sky-400 font-mono font-semibold mt-0.5">
            {bodyTemperature !== null ? `${bodyTemperature} °C` : 'Active'}
          </div>
        </div>
        <div className="p-2 rounded-xl bg-dark-950/50 border border-slate-800">
          <div className="text-slate-400 font-medium">Seat 4-FSR</div>
          <div className="text-slate-500 font-medium mt-0.5">
            {isDemoMode ? 'Simulated' : 'Local ESP32'}
          </div>
        </div>
      </div>
    </div>
  );
};
