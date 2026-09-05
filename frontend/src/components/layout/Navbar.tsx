import React from 'react';
import { Activity, Wifi, WifiOff, User, Sparkles, Sliders } from 'lucide-react';
import type { UserProfile } from '../../types/user';

interface NavbarProps {
  userProfile: UserProfile | null;
  onOpenProfile: () => void;
  onOpenMapping: () => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  blynkConnected: boolean;
  isStale: boolean;
  secondsAgo: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  userProfile,
  onOpenProfile,
  onOpenMapping,
  isDemoMode,
  onToggleDemoMode,
  blynkConnected,
  isStale,
  secondsAgo
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-dark-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand & Titles */}
          <div className="flex items-center gap-3.5">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-glow-cyan">
              <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-400 animate-pulse-subtle" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-base text-white">
                  NEUROPOSTURE OS
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  DESKCORE
                </span>
              </div>
              <p className="text-xs font-medium text-slate-400 tracking-wide">
                SMART CHAIR MONITORING
              </p>
            </div>
          </div>

          {/* Center Connection Status Pills */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* DeskCore Status Indicator */}
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs ${
                isDemoMode
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : blynkConnected
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isDemoMode
                    ? 'bg-amber-400 animate-pulse'
                    : blynkConnected
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-slate-500'
                }`}
              />
              <span className="font-medium text-[11px] uppercase tracking-wider">
                {isDemoMode
                  ? 'DESKCORE SIMULATED'
                  : blynkConnected
                  ? 'DESKCORE ONLINE'
                  : 'DESKCORE OFFLINE'}
              </span>
            </div>

            {/* Blynk Cloud Connection */}
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs ${
                isDemoMode
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : blynkConnected
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {isDemoMode ? (
                <Sparkles className="w-3.5 h-3.5" />
              ) : blynkConnected ? (
                <Wifi className="w-3.5 h-3.5" />
              ) : (
                <WifiOff className="w-3.5 h-3.5" />
              )}
              <span className="font-semibold text-[11px] uppercase tracking-wider">
                {isDemoMode
                  ? 'DEMO STREAM'
                  : blynkConnected
                  ? 'BLYNK CONNECTED'
                  : 'BLYNK DISCONNECTED'}
              </span>
            </div>

            {/* Freshness / Last updated */}
            <div className="text-[11px] text-slate-400 pl-1 font-mono">
              {isStale && !isDemoMode ? (
                <span className="text-amber-400 font-medium">● DATA STALE</span>
              ) : (
                <span>Last updated: {secondsAgo}s ago</span>
              )}
            </div>
          </div>

          {/* Right Actions: Demo Mode toggle, Mapping, User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo Mode Toggle */}
            <button
              onClick={onToggleDemoMode}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition shadow-sm ${
                isDemoMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-glow-caution'
                  : 'bg-dark-900/90 text-slate-400 border-slate-700 hover:text-slate-200 hover:border-slate-600'
              }`}
              title="Toggle simulated telemetry for UI evaluation"
            >
              <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-amber-400 animate-ping' : 'bg-slate-500'}`} />
              <span>DEMO MODE: {isDemoMode ? 'ON' : 'OFF'}</span>
            </button>

            {/* Data Mapping Inspector Trigger */}
            <button
              onClick={onOpenMapping}
              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-dark-900 border border-transparent hover:border-slate-700 rounded-xl transition"
              title="Inspect Blynk Datastream Mapping"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* User Greeting & Profile modal trigger */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-dark-900 border border-slate-800 hover:border-cyan-500/40 hover:bg-dark-850 transition text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-white tracking-tight">
                  {userProfile?.fullName ? `Welcome, ${userProfile.fullName}` : 'Welcome, User'}
                </div>
                <div className="text-[10px] text-cyan-400 font-medium">Profile Settings</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
