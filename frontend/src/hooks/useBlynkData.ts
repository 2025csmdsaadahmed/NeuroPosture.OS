import { useState, useEffect, useRef, useCallback } from 'react';
import type { TelemetryData, HistoricalDataPoint } from '../types/blynk';
import { fetchBlynkData } from '../services/api';

const MAX_HISTORY_POINTS = 30;
const POLLING_INTERVAL_MS = 3000;

export function useBlynkData() {
  const [data, setData] = useState<TelemetryData>({
    distance: null,
    bodyTemperature: null,
    environmentTemperature: null,
    humidity: null,
    stressIndex: null,
    postureStatus: null,
    balanceDifference: null,
    frontPressure: null,
    fsrFrontLeft: null,
    fsrFrontRight: null,
    fsrBackLeft: null,
    fsrBackRight: null,
    riskScore: null,
    connected: false,
    isStale: false,
    timestamp: null,
    lastUpdated: null,
    error: null
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem('deskcore_demo_mode') === 'true';
  });

  const [history, setHistory] = useState<HistoricalDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastFetchTime, setLastFetchTime] = useState<number>(Date.now());
  const [secondsAgo, setSecondsAgo] = useState<number>(0);

  const isDemoModeRef = useRef(isDemoMode);
  isDemoModeRef.current = isDemoMode;

  const toggleDemoMode = useCallback((val?: boolean) => {
    setIsDemoMode((prev) => {
      const next = typeof val === 'boolean' ? val : !prev;
      localStorage.setItem('deskcore_demo_mode', String(next));
      return next;
    });
  }, []);

  const loadData = useCallback(async () => {
    try {
      const currentDemo = isDemoModeRef.current;
      const latest = await fetchBlynkData(currentDemo);
      setData(latest);
      setLastFetchTime(Date.now());
      setSecondsAgo(0);

      // Append to time-series history only if we have at least one valid real or demo reading
      if (latest.distance !== null || latest.bodyTemperature !== null) {
        const timeLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const point: HistoricalDataPoint = {
          time: timeLabel,
          distance: latest.distance,
          bodyTemperature: latest.bodyTemperature,
          environmentTemperature: latest.environmentTemperature,
          humidity: latest.humidity,
          stressIndex: latest.stressIndex,
          postureStatus: latest.postureStatus
        };

        setHistory((prev) => {
          const updated = [...prev, point];
          if (updated.length > MAX_HISTORY_POINTS) {
            return updated.slice(updated.length - MAX_HISTORY_POINTS);
          }
          return updated;
        });
      }
    } catch (err) {
      console.error('Polling error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Polling loop
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, POLLING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadData, isDemoMode]);

  // Seconds ago timer (increments every second for reactive UI)
  useEffect(() => {
    const timer = setInterval(() => {
      const sec = Math.floor((Date.now() - lastFetchTime) / 1000);
      setSecondsAgo(sec);
    }, 1000);
    return () => clearInterval(timer);
  }, [lastFetchTime]);

  return {
    data,
    history,
    isLoading,
    isDemoMode,
    toggleDemoMode,
    secondsAgo,
    refresh: loadData
  };
}
