/**
 * Blynk Controller
 * Exposes safe, normalized endpoints to the frontend.
 * Strictly avoids exposing BLYNK_AUTH_TOKEN.
 */

const BlynkService = require('../services/blynkService');
const { BLYNK_MAPPING, SENSOR_METADATA } = require('../config/blynk');

class BlynkController {
  /**
   * GET /api/blynk/data
   * Optional query param: ?demo=true
   */
  static async getData(req, res) {
    try {
      const isDemo = req.query.demo === 'true' || req.query.demo === '1';
      const data = await BlynkService.getTelemetry(isDemo);
      res.json({
        success: true,
        data
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve telemetry',
        message: err.message
      });
    }
  }

  /**
   * GET /api/blynk/config
   * Returns current datastream mapping & metadata (NO SECRETS)
   */
  static getConfig(req, res) {
    try {
      res.json({
        success: true,
        mapping: BLYNK_MAPPING,
        metadata: SENSOR_METADATA,
        futureExtensions: [
          { key: 'balanceDifference', reservedPin: 'V7', name: 'Balance Difference' },
          { key: 'frontPressure', reservedPin: 'V8', name: 'Front Pressure' },
          { key: 'fsrBackLeft', reservedPin: 'V9', name: 'FSR Back Left' },
          { key: 'fsrBackRight', reservedPin: 'V10', name: 'FSR Back Right' },
          { key: 'postureStatus', reservedPin: 'V6', name: 'Posture Status' }
        ]
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve configuration'
      });
    }
  }

  /**
   * GET /api/blynk/health
   */
  static async getHealth(req, res) {
    try {
      const health = await BlynkService.checkHealth();
      res.json({
        success: true,
        health
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: 'Health check failed'
      });
    }
  }
}

module.exports = BlynkController;
