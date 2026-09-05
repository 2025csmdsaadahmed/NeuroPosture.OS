/**
 * Centralized Blynk Configuration & Datastream Mapping
 *
 * Current ESP32 code reality:
 * - V0: Body Temperature (°C)
 * - V1: (Not used in current firmware)
 * - V2: Distance (cm)
 * - V3: Posture Status ("Posture Optimal", "CAUTION: Posture Shifting", "CRITICAL: Bad Posture!")
 * - V4: Environmental Temperature (°C)
 * - V5: Humidity (%)
 * - V6: Stress Index (Computed from MLX90614 & DHT22)
 *
 * NOT SENT TO BLYNK (Calculated locally on ESP32):
 * - FSR Front Left, Front Right, Back Left, Back Right
 * - Balance Difference
 * - Total Front Pressure
 * - Risk Score
 */

const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../../.env');

function getAuthToken() {
  try {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/^BLYNK_AUTH_TOKEN\s*=\s*(.*)$/m);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  } catch (e) {
    // fallback to process.env
  }
  return (process.env.BLYNK_AUTH_TOKEN || '').trim();
}

const BLYNK_CONFIG = {
  get authToken() {
    return getAuthToken();
  },
  serverUrl: process.env.BLYNK_SERVER_URL || 'https://blynk.cloud',
  port: parseInt(process.env.PORT || '5001', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  cacheTtlMs: 2000, // 2-second cache to prevent Blynk rate limiting
  staleThresholdMs: 15000 // Flag data as stale if not updated in 15 seconds
};

// Central mapping configuration - easily modified when firmware is updated
const BLYNK_MAPPING = {
  bodyTemperature: 'V0',
  distance: 'V2',
  postureStatus: 'V3',
  environmentTemperature: 'V4',
  humidity: 'V5',
  stressIndex: 'V6',

  // Future extensions (Reserved pins; currently null because ESP32 doesn't transmit them)
  balanceDifference: null, // Future: 'V7'
  frontPressure: null,     // Future: 'V8'
  fsrFrontLeft: null,      // Future: 'V9'
  fsrFrontRight: null,     // Future: 'V10'
  fsrBackLeft: null,       // Future: 'V11'
  fsrBackRight: null,      // Future: 'V12'
  riskScore: null,         // Future: 'V13'
  sittingState: null       // Future: 'V14'
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
    pin: 'V0',
    name: 'Body Temperature',
    shortName: 'BODY TEMP',
    unit: '°C',
    status: 'ACTIVE',
    source: 'Blynk V0 (MLX90614)',
    hardware: 'MLX90614 Non-contact IR Sensor'
  },
  environmentTemperature: {
    pin: 'V4',
    name: 'Environmental Temperature',
    shortName: 'ENV TEMP',
    unit: '°C',
    status: 'ACTIVE',
    source: 'Blynk V4 (DHT22)',
    hardware: 'DHT22 Temp & Humidity Sensor'
  },
  humidity: {
    pin: 'V5',
    name: 'Humidity',
    shortName: 'HUMIDITY',
    unit: '%',
    status: 'ACTIVE',
    source: 'Blynk V5 (DHT22)',
    hardware: 'DHT22 Temp & Humidity Sensor'
  },
  stressIndex: {
    pin: 'V6',
    name: 'Stress Index',
    shortName: 'STRESS INDEX',
    unit: '',
    status: 'ACTIVE',
    source: 'Blynk V6 (ESP32 Algorithm)',
    hardware: 'ESP32 Bio-environmental Calculation'
  },
  postureStatus: {
    pin: 'V3',
    name: 'Posture Status',
    shortName: 'POSTURE',
    unit: '',
    status: 'ACTIVE',
    source: 'Blynk V3 (ESP32 Posture Logic)',
    hardware: 'ESP32 Ergonomic State Engine'
  },
  riskScore: {
    pin: null,
    futurePin: 'V13',
    name: 'Ergonomic Risk Score',
    shortName: 'RISK SCORE',
    unit: '/100',
    status: 'NOT_TRANSMITTED',
    source: 'Reserved for future firmware update',
    hardware: 'DeskCore Cloud / Edge Analytics'
  }
};

module.exports = {
  BLYNK_CONFIG,
  BLYNK_MAPPING,
  SENSOR_METADATA
};
