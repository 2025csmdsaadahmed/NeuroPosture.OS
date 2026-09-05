export interface TelemetryData {
  // Live Blynk Streams (Real)
  distance: number | null;                // V2 (cm)
  bodyTemperature: number | null;         // V0 (°C)
  environmentTemperature: number | null;  // V4 (°C)
  humidity: number | null;                // V5 (%)
  stressIndex: number | null;             // V6
  postureStatus: string | null;           // V3 (Text)

  // Future streams / Internal ESP32 metrics (null in live mode)
  balanceDifference: number | null;       // Reserved for V7
  frontPressure: number | null;           // Reserved for V8
  fsrFrontLeft: number | null;            // Reserved for V9
  fsrFrontRight: number | null;           // Reserved for V10
  fsrBackLeft: number | null;             // Reserved for V11
  fsrBackRight: number | null;            // Reserved for V12
  riskScore: number | null;               // Reserved for V13

  // System & Connection state
  connected: boolean;
  isStale: boolean;
  timestamp: string | null;
  lastUpdated: string | null;
  isDemo?: boolean;
  error?: string | null;
}

export type PostureLevel = 'optimal' | 'caution' | 'critical' | 'unknown';

export interface SensorMetaItem {
  pin: string | null;
  futurePin?: string;
  name: string;
  shortName: string;
  unit: string;
  status: 'ACTIVE' | 'NOT_TRANSMITTED';
  source: string;
  hardware: string;
}

export interface BlynkConfigResponse {
  mapping: Record<string, string | null>;
  metadata: Record<string, SensorMetaItem>;
  futureExtensions: Array<{
    key: string;
    reservedPin: string;
    name: string;
  }>;
}

export interface HistoricalDataPoint {
  time: string;
  distance: number | null;
  bodyTemperature: number | null;
  environmentTemperature: number | null;
  humidity: number | null;
  stressIndex: number | null;
  postureStatus: string | null;
}
