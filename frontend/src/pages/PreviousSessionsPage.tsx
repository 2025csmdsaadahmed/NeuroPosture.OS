import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { loadSessions, loadSessionsForProfile, clearSessions, formatDuration, type SessionRecord } from '../services/sessionStorage';
import { loadCurrentProfile } from '../services/profileStorage';
import {
  Clock, Calendar, User, ChevronRight, Trash2, Activity,
  Thermometer, Droplets, Zap, AlertCircle, CheckCircle2, Info
} from 'lucide-react';

export const PreviousSessionsPage: React.FC = () => {
  const [currentProfile] = useState(() => loadCurrentProfile());
  const [sessions, setSessions] = useState<SessionRecord[]>(() => loadSessions());
  const [selected, setSelected] = useState<SessionRecord | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'current'>('current');

  const handleClear = () => {
    clearSessions();
    setSessions([]);
    setSelected(null);
    setShowClearConfirm(false);
  };

  const activeSessions = viewMode === 'current' && currentProfile?.id ? loadSessionsForProfile(currentProfile.id) : sessions;

  const postureTotal = (s: SessionRecord) =>
    s.summary.optimalPostureCount + s.summary.cautionPostureCount + s.summary.criticalPostureCount;

  const posturePercent = (count: number, total: number) =>
    total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white tracking-wide">PREVIOUS SESSIONS</h1>
          </div>
          <p className="text-xs text-slate-400">
            Stored locally on your device • {activeSessions.length} session{activeSessions.length !== 1 ? 's' : ''} recorded
          </p>
        </div>
        {sessions.length > 0 && (
          <div className="flex items-center gap-2">
            {showClearConfirm ? (
              <>
                <span className="text-xs text-red-400 font-medium">Clear all sessions?</span>
                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-semibold hover:bg-red-500/30 transition"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-900 text-slate-400 border border-slate-800 text-xs font-medium hover:text-red-400 hover:border-red-500/40 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setViewMode('current')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
            viewMode === 'current'
              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
              : 'bg-dark-900 text-slate-400 border-slate-800'
          }`}
        >
          Current user
        </button>
        <button
          onClick={() => setViewMode('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
            viewMode === 'all'
              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
              : 'bg-dark-900 text-slate-400 border-slate-800'
          }`}
        >
          All users
        </button>
      </div>

      {activeSessions.length === 0 ? (
        /* Empty State */
        <Card>
          <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-dark-850 border border-slate-800 flex items-center justify-center">
              <Clock className="w-8 h-8 text-slate-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-300 mb-1">No Sessions Recorded Yet</div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Sessions are automatically saved when you use the monitoring dashboard.
                Complete a monitoring session and return here to review your history.
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-dark-850 border border-slate-800 text-[11px] text-slate-500">
              <Info className="w-3.5 h-3.5 text-cyan-500/60" />
              Sessions are stored locally and never sent to the server
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Session List */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold px-1 mb-1">
              Session History
            </div>
            {activeSessions.map((session) => {
              const isSelected = selected?.id === session.id;
              const total = postureTotal(session);
              const optPct = posturePercent(session.summary.optimalPostureCount, total);
              return (
                <button
                  key={session.id}
                  onClick={() => setSelected(session)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500/40 shadow-glow-cyan'
                      : 'bg-dark-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-dark-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-cyan-500/20 border border-cyan-500/40' : 'bg-dark-850 border border-slate-800'
                      }`}>
                        <User className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-200 truncate">{session.userName}</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">{session.sessionDate}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] font-mono text-slate-400">
                        {formatDuration(session.durationSeconds)}
                      </span>
                      {session.summary.isDemoMode ? (
                        <Badge variant="demo">DEMO</Badge>
                      ) : (
                        <Badge variant="live">LIVE</Badge>
                      )}
                    </div>
                  </div>

                  {/* Mini posture bar */}
                  {total > 0 && (
                    <div className="mt-3 flex items-center gap-1.5">
                      <div className="flex-1 h-1.5 rounded-full bg-dark-850 overflow-hidden flex">
                        <div
                          className="h-full bg-emerald-500 rounded-l-full"
                          style={{ width: `${posturePercent(session.summary.optimalPostureCount, total)}%` }}
                        />
                        <div
                          className="h-full bg-amber-500"
                          style={{ width: `${posturePercent(session.summary.cautionPostureCount, total)}%` }}
                        />
                        <div
                          className="h-full bg-red-500 rounded-r-full"
                          style={{ width: `${posturePercent(session.summary.criticalPostureCount, total)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400">{optPct}% OK</span>
                    </div>
                  )}

                  {isSelected && (
                    <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-cyan-400 font-medium">
                      <span>View details</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Session Detail */}
          <div className="lg:col-span-8">
            {!selected ? (
              <Card>
                <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                  <ChevronRight className="w-8 h-8 text-slate-700" />
                  <p className="text-xs text-slate-500">Select a session on the left to view its details</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Profile & Date Header */}
                <Card>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center">
                        <User className="w-7 h-7 text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-base font-bold text-white">{selected.userName}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Age: <span className="text-slate-200 font-medium">{selected.userAge}</span>
                          {' • '}
                          Gender: <span className="text-slate-200 font-medium">{selected.userGender || 'Not specified'}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                          {selected.summary.isDemoMode ? (
                            <Badge variant="demo">DEMO SESSION</Badge>
                          ) : (
                            <Badge variant="live">LIVE SESSION</Badge>
                          )}
                          <span className="font-mono">{selected.summary.dataPoints} data points</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-slate-200">
                        {formatDuration(selected.durationSeconds)}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">duration</div>
                    </div>
                  </div>

                  {/* Date/Time Row */}
                  <div className="mt-4 pt-4 border-t border-slate-800/60 grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                      <div>
                        <div className="text-[10px] text-slate-500">Session Date</div>
                        <div className="text-xs font-semibold text-slate-200">{selected.sessionDate}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                      <div>
                        <div className="text-[10px] text-slate-500">Login Time</div>
                        <div className="text-xs font-semibold text-slate-200 font-mono">{selected.loginTime}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-slate-500 shrink-0" />
                      <div>
                        <div className="text-[10px] text-slate-500">Session End</div>
                        <div className="text-xs font-semibold text-slate-200 font-mono">
                          {selected.logoutTime ?? 'Active / Incomplete'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Sensor Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    {
                      label: 'AVG DISTANCE',
                      val: selected.summary.avgDistance,
                      unit: 'cm',
                      icon: Activity,
                      color: 'text-cyan-400',
                      note: 'HC-SR04 • V2',
                    },
                    {
                      label: 'AVG BODY TEMP',
                      val: selected.summary.avgBodyTemp,
                      unit: '°C',
                      icon: Thermometer,
                      color: 'text-sky-400',
                      note: 'MLX90614 • V0',
                    },
                    {
                      label: 'AVG HUMIDITY',
                      val: selected.summary.avgHumidity,
                      unit: '%',
                      icon: Droplets,
                      color: 'text-blue-400',
                      note: 'DHT22 • V5',
                    },
                    {
                      label: 'AVG STRESS INDEX',
                      val: selected.summary.avgStressIndex,
                      unit: '',
                      icon: Zap,
                      color: 'text-purple-400',
                      note: 'Computed on ESP32 • V6',
                    },
                    {
                      label: 'AVG ENV TEMP',
                      val: selected.summary.avgEnvTemp,
                      unit: '°C',
                      icon: Activity,
                      color: 'text-teal-400',
                      note: 'DHT22 • V4',
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="p-3.5 rounded-2xl bg-dark-900/70 border border-slate-800/80"
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {item.label}
                          </span>
                        </div>
                        <div className={`text-xl font-bold font-mono ${item.color}`}>
                          {item.val !== null
                            ? `${item.val.toFixed(1)} ${item.unit}`
                            : <span className="text-sm text-slate-500 font-medium">N/A</span>}
                        </div>
                        <div className="text-[10px] text-slate-600 mt-1 font-mono">{item.note}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Posture Breakdown */}
                <Card>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      POSTURE STATE BREAKDOWN
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {postureTotal(selected)} events recorded
                    </span>
                  </div>
                  {postureTotal(selected) === 0 ? (
                    <div className="text-xs text-slate-500 text-center py-4">No posture events recorded in this session</div>
                  ) : (
                    <>
                      {/* Stacked bar */}
                      <div className="h-3 rounded-full bg-dark-850 overflow-hidden flex mb-4">
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${posturePercent(selected.summary.optimalPostureCount, postureTotal(selected))}%` }}
                        />
                        <div
                          className="h-full bg-amber-500"
                          style={{ width: `${posturePercent(selected.summary.cautionPostureCount, postureTotal(selected))}%` }}
                        />
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${posturePercent(selected.summary.criticalPostureCount, postureTotal(selected))}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'OPTIMAL', count: selected.summary.optimalPostureCount, color: 'text-emerald-400', icon: CheckCircle2 },
                          { label: 'CAUTION', count: selected.summary.cautionPostureCount, color: 'text-amber-400', icon: AlertCircle },
                          { label: 'CRITICAL', count: selected.summary.criticalPostureCount, color: 'text-red-400', icon: AlertCircle },
                        ].map((p) => {
                          const Icon = p.icon;
                          return (
                            <div key={p.label} className="text-center p-3 rounded-xl bg-dark-850/60 border border-slate-800">
                              <Icon className={`w-4 h-4 mx-auto mb-1 ${p.color}`} />
                              <div className={`text-xl font-bold font-mono ${p.color}`}>{p.count}</div>
                              <div className="text-[10px] text-slate-500 font-medium mt-0.5">{p.label}</div>
                              <div className="text-[10px] text-slate-600 font-mono">
                                {posturePercent(p.count, postureTotal(selected))}%
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </Card>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
