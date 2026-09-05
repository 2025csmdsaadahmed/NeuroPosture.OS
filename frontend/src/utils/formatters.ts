import type { PostureLevel } from '../types/blynk';

/**
 * Format sensor value or return "DATA NOT AVAILABLE"
 */
export function formatMetric(
  value: number | null | undefined,
  unit = '',
  decimals = 1
): { display: string; isAvailable: boolean } {
  if (value === null || value === undefined || isNaN(value)) {
    return {
      display: 'DATA NOT AVAILABLE',
      isAvailable: false
    };
  }
  return {
    display: `${Number(value).toFixed(decimals)}${unit ? ' ' + unit : ''}`,
    isAvailable: true
  };
}

/**
 * Classify posture status string from ESP32
 */
export function getPostureLevel(status: string | null | undefined): PostureLevel {
  if (!status) return 'unknown';
  const lower = status.toLowerCase();
  if (lower.includes('critical') || lower.includes('bad posture')) {
    return 'critical';
  }
  if (lower.includes('caution') || lower.includes('shifting')) {
    return 'caution';
  }
  if (lower.includes('optimal') || lower.includes('good')) {
    return 'optimal';
  }
  return 'unknown';
}

/**
 * Relative time formatter ("X seconds ago", "just now")
 */
export function formatRelativeTime(isoString: string | null | undefined): string {
  if (!isoString) return 'Never';
  const then = new Date(isoString).getTime();
  const now = Date.now();
  const diffSec = Math.max(0, Math.floor((now - then) / 1000));

  if (diffSec < 2) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  return `${Math.floor(diffMin / 60)}h ago`;
}
