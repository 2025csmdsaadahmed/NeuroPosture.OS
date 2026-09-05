/**
 * Blynk Service
 * Interacts with the Blynk Cloud REST API securely using BLYNK_AUTH_TOKEN.
 * Never leaks the token to the client.
 */

const axios = require('axios');
const { BLYNK_CONFIG, BLYNK_MAPPING } = require('../config/blynk');
const { normalizeBlynkData, generateDemoData } = require('../utils/normalizer');

let cache = {
  data: null,
  timestamp: 0
};

let lastSuccessfulSync = null;

class BlynkService {
  /**
   * Fetch single pin value from Blynk Cloud
   */
  static async fetchPin(pin) {
    if (!pin) return null;
    const url = `${BLYNK_CONFIG.serverUrl}/external/api/get`;
    try {
      const response = await axios.get(url, {
        params: {
          token: BLYNK_CONFIG.authToken.trim(),
          [pin]: ''
        },
        timeout: 3000
      });
      // Ensure error objects are not returned as pin readings
      if (response.data && typeof response.data === 'object' && response.data.error) {
        return null;
      }
      return response.data;
    } catch (err) {
      return null;
    }
  }

  /**
   * Fetch all active mapped pins from Blynk Cloud
   */
  static async getTelemetry(isDemoMode = false) {
    if (isDemoMode) {
      return generateDemoData();
    }

    // Always check token dynamically first
    const token = (BLYNK_CONFIG.authToken || '').trim();
    if (!token || token === 'YOUR_BLYNK_AUTH_TOKEN' || token === 'YOUR_BLYNK_AUTH_TOKEN_HERE') {
      cache = { data: null, timestamp: 0 };
      lastSuccessfulSync = null;
      return normalizeBlynkData({}, BLYNK_MAPPING, false, 'Blynk Auth Token not configured in backend/.env');
    }

    const now = Date.now();

    // Return cached data if within TTL
    if (cache.data && (now - cache.timestamp < BLYNK_CONFIG.cacheTtlMs)) {
      return {
        ...cache.data,
        isStale: lastSuccessfulSync ? (now - lastSuccessfulSync > BLYNK_CONFIG.staleThresholdMs) : false
      };
    }

    // Identify active pins in the current mapping
    const activeEntries = Object.entries(BLYNK_MAPPING).filter(([_, pin]) => pin !== null);
    const pinMap = {};

    try {
      // Query active pins concurrently with timeout
      const pinPromises = activeEntries.map(async ([key, pin]) => {
        const val = await BlynkService.fetchPin(pin);
        return { pin, key, val };
      });

      const results = await Promise.allSettled(pinPromises);
      let anySuccess = false;

      results.forEach((res) => {
        if (res.status === 'fulfilled' && res.value && res.value.val !== null && res.value.val !== undefined) {
          pinMap[res.value.pin] = res.value.val;
          anySuccess = true;
        }
      });

      if (anySuccess) {
        lastSuccessfulSync = now;
      }

      const isConnected = anySuccess;
      const isStale = lastSuccessfulSync ? (now - lastSuccessfulSync > BLYNK_CONFIG.staleThresholdMs) : !isConnected;
      const errorMsg = isConnected ? null : 'Failed to reach Blynk Cloud or device is offline';

      const normalized = normalizeBlynkData(pinMap, BLYNK_MAPPING, isConnected, errorMsg);
      normalized.isStale = isStale;

      // Update cache
      cache = {
        data: normalized,
        timestamp: now
      };

      return normalized;
    } catch (err) {
      const isStale = lastSuccessfulSync ? (now - lastSuccessfulSync > BLYNK_CONFIG.staleThresholdMs) : true;
      const errorData = normalizeBlynkData({}, BLYNK_MAPPING, false, err.message || 'Blynk connection failed');
      errorData.isStale = isStale;
      return errorData;
    }
  }

  /**
   * Check connection health
   */
  static async checkHealth() {
    const isTokenSet = Boolean(BLYNK_CONFIG.authToken && BLYNK_CONFIG.authToken !== 'YOUR_BLYNK_AUTH_TOKEN');
    let blynkReachable = false;

    if (isTokenSet) {
      try {
        const res = await axios.get(`${BLYNK_CONFIG.serverUrl}/external/api/isHardwareConnected`, {
          params: { token: BLYNK_CONFIG.authToken },
          timeout: 3000
        });
        blynkReachable = res.status === 200;
      } catch (e) {
        blynkReachable = false;
      }
    }

    return {
      status: 'ok',
      backendOnline: true,
      tokenConfigured: isTokenSet,
      blynkServer: BLYNK_CONFIG.serverUrl,
      blynkHardwareConnected: blynkReachable,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = BlynkService;
