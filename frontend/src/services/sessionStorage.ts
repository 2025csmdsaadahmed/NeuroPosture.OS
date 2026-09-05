/**
 * Session Storage Service
 * Persists session summaries in localStorage (client-side only).
 * NEVER stores any Blynk Auth Token or backend credentials.
 */

export interface SessionRecord {
  id: string;
  userName: string;
  userAge: number | string;
  userGender: string;
  sessionDate: string;      // ISO date string
  loginTime: string;        // HH:MM:SS
  logoutTime: string | null;
  durationSeconds: number;
  summary: {
    avgDistance: number | null;
    avgBodyTemp: number | null;
    avgHumidity: number | null;
    avgStressIndex: number | null;
    avgEnvTemp: number | null;
    optimalPostureCount: number;
    cautionPostureCount: number;
    criticalPostureCount: number;
    dataPoints: number;
    isDemoMode: boolean;
  };
}

const STORAGE_KEY = 'deskcore_sessions';
const MAX_SESSIONS = 20;

export function loadSessions(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SessionRecord[];
  } catch {
    return [];
  }
}

export function saveSession(session: SessionRecord): void {
  try {
    const existing = loadSessions();
    // Prepend new session, keep max limit
    const updated = [session, ...existing].slice(0, MAX_SESSIONS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Silently fail — not critical
  }
}

export function clearSessions(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return `${h}h ${rem}m`;
}
