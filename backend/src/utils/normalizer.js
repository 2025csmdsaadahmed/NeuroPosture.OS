/**
 * Data Normalizer for NeuroPosture OS DeskCore
 * Normalizes raw Blynk REST responses into clean, typed telemetry objects.
 * Strictly guarantees that unmapped or missing metrics are null.
 */

function parseNumeric(value, decimals = 1) {
  if (value === null || value === undefined || value === '') return null;
  const num = parseFloat(value);
  if (isNaN(num)) return null;
  return Number(num.toFixed(decimals));
}

function parseString(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'object') return null;
  const str = String(value).trim();
  return str.length > 0 ? str : null;
}

/**
 * Normalizes raw pin readings from Blynk Cloud
 * @param {Object} rawPins Map of pin name to raw value, e.g. { V0: '36.8', V2: '45.2', ... }
 * @param {Object} mapping Current BLYNK_MAPPING
 * @param {boolean} isConnected Whether Blynk responded successfully
 * @param {string|null} errorMessage Any error message
 */
function normalizeBlynkData(rawPins = {}, mapping, isConnected = true, errorMessage = null) {
  const now = new Date().toISOString();

  // Helper to get value using mapping
  const getValue = (key) => {
    const pin = mapping[key];
    if (!pin) return null; // Not currently mapped or transmitted
    return rawPins[pin] !== undefined ? rawPins[pin] : null;
  };

  return {
    // Current Active Live Blynk Telemetry
    distance: parseNumeric(getValue('distance'), 1),
    bodyTemperature: parseNumeric(getValue('bodyTemperature'), 1),
    environmentTemperature: parseNumeric(getValue('environmentTemperature'), 1),
    humidity: parseNumeric(getValue('humidity'), 1),
    stressIndex: parseNumeric(getValue('stressIndex'), 1),
    postureStatus: parseString(getValue('postureStatus')),

    // Calculated on ESP32 locally, but NOT transmitted to Blynk currently:
    balanceDifference: parseNumeric(getValue('balanceDifference')),
    frontPressure: parseNumeric(getValue('frontPressure')),
    fsrFrontLeft: parseNumeric(getValue('fsrFrontLeft')),
    fsrFrontRight: parseNumeric(getValue('fsrFrontRight')),
    fsrBackLeft: parseNumeric(getValue('fsrBackLeft')),
    fsrBackRight: parseNumeric(getValue('fsrBackRight')),
    riskScore: parseNumeric(getValue('riskScore')),

    // Connection & Health Metadata (Token is NEVER included)
    connected: isConnected,
    isStale: false,
    timestamp: now,
    lastUpdated: now,
    error: errorMessage
  };
}

/**
 * Generates realistic telemetry for DEMO MODE only when explicitly activated by user.
 * Simulates a sitting user with changing posture states.
 */
let demoTick = 0;
function generateDemoData() {
  demoTick += 1;
  const now = new Date().toISOString();

  // Cycle postures realistically
  const postures = [
    'Posture Optimal',
    'Posture Optimal',
    'CAUTION: Posture Shifting',
    'Posture Optimal',
    'CRITICAL: Bad Posture!',
    'CAUTION: Posture Shifting'
  ];
  const postureStatus = postures[Math.floor(demoTick / 4) % postures.length];

  // Base parameters with slight physiological fluctuation
  const distance = Number((42.0 + Math.sin(demoTick * 0.2) * 5.5).toFixed(1));
  const bodyTemperature = Number((36.7 + Math.sin(demoTick * 0.05) * 0.3).toFixed(1));
  const environmentTemperature = Number((23.4 + Math.cos(demoTick * 0.05) * 0.4).toFixed(1));
  const humidity = Number((48.0 + Math.sin(demoTick * 0.1) * 2.0).toFixed(1));
  const stressIndex = Number((1.8 + Math.abs(Math.sin(demoTick * 0.15)) * 1.6).toFixed(1));

  // In demo mode, we also demonstrate what future FSR/Balance data will look like
  const isOptimal = postureStatus === 'Posture Optimal';
  const fsrFrontLeft = isOptimal ? 240 + Math.floor(Math.random() * 20) : 380 + Math.floor(Math.random() * 40);
  const fsrFrontRight = isOptimal ? 245 + Math.floor(Math.random() * 20) : 210 + Math.floor(Math.random() * 30);
  const fsrBackLeft = isOptimal ? 310 + Math.floor(Math.random() * 20) : 180 + Math.floor(Math.random() * 30);
  const fsrBackRight = isOptimal ? 315 + Math.floor(Math.random() * 20) : 170 + Math.floor(Math.random() * 30);

  const totalLeft = fsrFrontLeft + fsrBackLeft;
  const totalRight = fsrFrontRight + fsrBackRight;
  const balanceDifference = Math.abs(totalLeft - totalRight);
  const frontPressure = fsrFrontLeft + fsrFrontRight;
  const riskScore = isOptimal ? 18 : (postureStatus.startsWith('CAUTION') ? 54 : 88);

  return {
    distance,
    bodyTemperature,
    environmentTemperature,
    humidity,
    stressIndex,
    postureStatus,
    balanceDifference,
    frontPressure,
    fsrFrontLeft,
    fsrFrontRight,
    fsrBackLeft,
    fsrBackRight,
    riskScore,
    connected: true,
    isStale: false,
    timestamp: now,
    lastUpdated: now,
    isDemo: true,
    error: null
  };
}

module.exports = {
  normalizeBlynkData,
  generateDemoData
};
