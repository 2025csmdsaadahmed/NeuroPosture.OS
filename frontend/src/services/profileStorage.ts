import type { HistoricalDataPoint } from '../types/blynk';
import type { UserProfile } from '../types/user';

const CURRENT_PROFILE_KEY = 'deskcore_user_profile';
const PROFILES_KEY = 'deskcore_user_profiles';
const METRICS_KEY = 'deskcore_profile_metrics';

function createProfileId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `profile-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function loadCurrentProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(CURRENT_PROFILE_KEY);
    if (!raw) return null;
    const profile = JSON.parse(raw) as UserProfile;
    return { ...profile, id: profile.id || createProfileId() };
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): UserProfile {
  const savedProfile = { ...profile, id: profile.id || createProfileId() };
  try {
    localStorage.setItem(CURRENT_PROFILE_KEY, JSON.stringify(savedProfile));
    const existing = JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]') as UserProfile[];
    const updated = [savedProfile, ...existing.filter((item) => item.id !== savedProfile.id)];
    localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
  } catch {
    // Local persistence is best-effort and never blocks monitoring.
  }
  return savedProfile;
}

export function loadSavedProfiles(): UserProfile[] {
  try {
    return JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]') as UserProfile[];
  } catch {
    return [];
  }
}

export function loadProfileMetrics(profileId: string): HistoricalDataPoint[] {
  try {
    const allMetrics = JSON.parse(localStorage.getItem(METRICS_KEY) || '{}') as Record<string, HistoricalDataPoint[]>;
    return allMetrics[profileId] || [];
  } catch {
    return [];
  }
}

export function saveProfileMetrics(profileId: string, metrics: HistoricalDataPoint[]): void {
  try {
    const allMetrics = JSON.parse(localStorage.getItem(METRICS_KEY) || '{}') as Record<string, HistoricalDataPoint[]>;
    const previous = allMetrics[profileId] || [];
    const merged = [...previous, ...metrics].filter((point, index, points) => {
      const signature = JSON.stringify(point);
      return points.findIndex((candidate) => JSON.stringify(candidate) === signature) === index;
    });
    allMetrics[profileId] = merged.slice(-300);
    localStorage.setItem(METRICS_KEY, JSON.stringify(allMetrics));
  } catch {
    // Local persistence is best-effort and never blocks monitoring.
  }
}
