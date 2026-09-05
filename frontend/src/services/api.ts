import type { TelemetryData, BlynkConfigResponse } from '../types/blynk';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function fetchBlynkData(isDemo = false): Promise<TelemetryData> {
  const url = `${API_BASE_URL}/api/blynk/data?demo=${isDemo ? 'true' : 'false'}`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const json = await res.json();
    return json.data;
  } catch (err: any) {
    console.error('API Fetch Error:', err);
    return {
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
      isStale: true,
      timestamp: null,
      lastUpdated: null,
      error: err.message || 'Unable to connect to backend'
    };
  }
}

export async function fetchBlynkConfig(): Promise<BlynkConfigResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/blynk/config`);
    if (!res.ok) return null;
    const json = await res.json();
    return json;
  } catch (err) {
    console.warn('Failed to fetch Blynk config:', err);
    return null;
  }
}

export async function fetchHealth(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    return await res.json();
  } catch {
    return { status: 'offline' };
  }
}
