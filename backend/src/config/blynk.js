/**
 * Centralized Blynk Configuration & Datastream Mapping
 *
 * Current device datastream reality:
 * - V0: FSR Left
 * - V1: FSR Right
 * - V2: Head Distance (cm)
 * - V3: Body Temperature (°C)
 * - V4: Humidity (%)
 * - V5: Risk Score
 *
 * NOT SENT TO BLYNK (Calculated locally on ESP32):
 * - Posture status text
 * - Environmental temperature
 * - Stress index
 * - Balance Difference
 * - Total Front Pressure
 * - Additional FSR quadrants
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const BLYNK_CONFIG = {
  authToken: (process.env.BLYNK_AUTH_TOKEN || '').trim(),
  serverUrl: process.env.BLYNK_SERVER_URL || 'https://blynk.cloud',
  port: parseInt(process.env.PORT || '5001', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  cacheTtlMs: 2000, // 2-second cache to prevent Blynk rate limiting
  staleThresholdMs: 15000 // Flag data as stale if not updated in 15 seconds
};

// Central mapping configuration - easily modified when firmware is updated
const BLYNK_MAPPING = {
  fsrFrontLeft: 'V0',
  fsrFrontRight: 'V1',
  distance: 'V2',
  bodyTemperature: 'V3',
  humidity: 'V4',
  riskScore: 'V5',
  postureStatus: null,
  environmentTemperature: null,
  stressIndex: null,

  // Future extensions (Reserved pins; currently null because ESP32 doesn't transmit them)
  balanceDifference: null, // Future: 'V7'
  frontPressure: null,     // Future: 'V8'
  fsrBackLeft: null,       // Future: 'V11'
  fsrBackRight: null,      // Future: 'V12'
  sittingState: null
};

// Human-readable metadata and firmware availability
const SENSOR_METADATA = {
  distance: {
    pin: 'V2',
    name: 'Head / Body Distance',
    shortName: 'DIST',
    unit: 'cm',
    status: 'ACTIVE',
    source: 'Blynk V2 (HC-SR04)',
    hardware: 'HC-SR04 Ultrasonic Sensor'
  },
  fsrFrontLeft: {
    pin: 'V0',
    name: 'FSR Left',
    shortName: 'FSR LEFT',
    unit: 'pts',
    status: 'ACTIVE',
    source: 'Blynk V0 (FSR Left)',
    hardware: 'Left FSR Pressure Sensor'
  },
  fsrFrontRight: {
    pin: 'V1',
    name: 'FSR Right',
    shortName: 'FSR RIGHT',
    unit: 'pts',
    status: 'ACTIVE',
    source: 'Blynk V1 (FSR Right)',
    hardware: 'Right FSR Pressure Sensor'
  },
  balanceDifference: {
    pin: null,
    futurePin: 'V7',
    name: 'Balance Difference',
    shortName: 'BAL DIFF',
    unit: 'pts',
    status: 'NOT_TRANSMITTED',
    source: 'Calculated internally on ESP32; not sent to Blynk in current firmware',
    hardware: '4x FSR Pressure Sensors'
  },
  frontPressure: {
    pin: null,
    futurePin: 'V8',
    name: 'Front Pressure',
    shortName: 'FRONT P',
    unit: 'pts',
    status: 'NOT_TRANSMITTED',
    source: 'Calculated internally on ESP32; not sent to Blynk in current firmware',
    hardware: '2x Front FSR Pressure Sensors'
  },
  bodyTemperature: {
    pin: 'V3',
    name: 'Body Temperature',
    shortName: 'BODY TEMP',
    unit: '°C',
    status: 'ACTIVE',
    source: 'Blynk V3 (MLX90614)',
    hardware: 'MLX90614 Non-contact IR Sensor'
  },
  environmentTemperature: {
    pin: null,
    name: 'Environmental Temperature',
    shortName: 'ENV TEMP',
    unit: '°C',
    status: 'NOT_TRANSMITTED',
    source: 'Not present in current device mapping',
    hardware: 'DHT22 Temp & Humidity Sensor'
  },
  humidity: {
    pin: 'V4',
    name: 'Humidity',
    shortName: 'HUMIDITY',
    unit: '%',
    status: 'ACTIVE',
    source: 'Blynk V4 (Humidity)',
    hardware: 'DHT22 Temp & Humidity Sensor'
  },
  stressIndex: {
    pin: null,
    name: 'Stress Index',
    shortName: 'STRESS INDEX',
    unit: '',
    status: 'NOT_TRANSMITTED',
    source: 'Not present in current device mapping',
    hardware: 'ESP32 Bio-environmental Calculation'
  },
  postureStatus: {
    pin: null,
    name: 'Posture Status',
    shortName: 'POSTURE',
    unit: '',
    status: 'NOT_TRANSMITTED',
    source: 'Not present in current device mapping',
    hardware: 'ESP32 Ergonomic State Engine'
  },
  riskScore: {
    pin: 'V5',
    name: 'Ergonomic Risk Score',
    shortName: 'RISK SCORE',
    unit: '/100',
    status: 'ACTIVE',
    source: 'Blynk V5 (Risk Score)',
    hardware: 'DeskCore Cloud / Edge Analytics'
  }
};

module.exports = {
  BLYNK_CONFIG,
  BLYNK_MAPPING,
  SENSOR_METADATA
};
