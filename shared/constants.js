/**
 * NEUROPOSTURE OS - DESKCORE SMART CHAIR
 * Centralized Blynk Datastream Mapping
 *
 * Current ESP32 Firmware Telemetry:
 * - V0: Body Temperature (°C) - MLX90614
 * - V2: Distance (cm) - HC-SR04 Ultrasonic
 * - V3: Posture Status (String: "Posture Optimal", "CAUTION: Posture Shifting", "CRITICAL: Bad Posture!")
 * - V4: Environmental Temperature (°C) - DHT22
 * - V5: Humidity (%) - DHT22
 * - V6: Stress Index (Number)
 *
 * Future Datastreams (Calculated locally by ESP32, prepared for future firmware update):
 * - V7: Balance Difference (|totalLeft - totalRight|)
 * - V8: Front Pressure (valFL + valFR)
 * - V9: FSR Front Left
 * - V10: FSR Front Right
 * - V11: FSR Back Left
 * - V12: FSR Back Right
 * - V13: Risk Score
 * - V14: Sitting/Posture State
 */

const BLYNK_MAPPING = {
  // Real active datastreams in current ESP32 firmware
  bodyTemperature: "V0",
  distance: "V2",
  postureStatus: "V3",
  environmentTemperature: "V4",
  humidity: "V5",
  stressIndex: "V6",

  // Future extensions (Reserved pins; currently null because ESP32 doesn't transmit them)
  balanceDifference: null, // Reserved for V7
  frontPressure: null,     // Reserved for V8
  fsrFrontLeft: null,      // Reserved for V9
  fsrFrontRight: null,     // Reserved for V10
  fsrBackLeft: null,       // Reserved for V11
  fsrBackRight: null,      // Reserved for V12
  riskScore: null,         // Reserved for V13
  sittingState: null       // Reserved for V14
};

const SENSOR_META = {
  distance: {
    label: "Head / Body Distance",
    shortLabel: "DIST",
    unit: "cm",
    pin: "V2",
    isLive: true,
    description: "Real-time distance from ultrasonic sensor to back/head."
  },
  balanceDifference: {
    label: "Balance Difference",
    shortLabel: "BAL DIFF",
    unit: "pts",
    pin: null,
    futurePin: "V7",
    isLive: false,
    description: "Calculated internally on ESP32 (|totalLeft - totalRight|) but not transmitted to Blynk."
  },
  frontPressure: {
    label: "Front Pressure",
    shortLabel: "FRONT P",
    unit: "pts",
    pin: null,
    futurePin: "V8",
    isLive: false,
    description: "Calculated internally on ESP32 (valFL + valFR) but not transmitted to Blynk."
  },
  bodyTemperature: {
    label: "Body Temperature",
    shortLabel: "BODY TEMP",
    unit: "°C",
    pin: "V0",
    isLive: true,
    description: "Infrared body surface temperature from MLX90614 sensor."
  },
  environmentTemperature: {
    label: "Environment Temperature",
    shortLabel: "ENV TEMP",
    unit: "°C",
    pin: "V4",
    isLive: true,
    description: "Ambient room temperature from DHT22 sensor."
  },
  humidity: {
    label: "Ambient Humidity",
    shortLabel: "HUMIDITY",
    unit: "%",
    pin: "V5",
    isLive: true,
    description: "Ambient relative humidity from DHT22 sensor."
  },
  stressIndex: {
    label: "Stress Index",
    shortLabel: "STRESS INDEX",
    unit: "",
    pin: "V6",
    isLive: true,
    description: "Combined bio-environmental stress index computed on ESP32."
  },
  postureStatus: {
    label: "Posture Status",
    shortLabel: "POSTURE",
    unit: "",
    pin: "V3",
    isLive: true,
    description: "Ergonomic posture classification evaluated on ESP32."
  },
  riskScore: {
    label: "Ergonomic Risk Score",
    shortLabel: "RISK SCORE",
    unit: "/100",
    pin: null,
    futurePin: "V13",
    isLive: false,
    description: "Comprehensive risk score awaiting future firmware stream."
  }
};

module.exports = {
  BLYNK_MAPPING,
  SENSOR_META
};
