# NEUROPOSTURE OS: DESKCORE — SMART CHAIR

A production-grade, real-time IoT ergonomic monitoring web application for the **DeskCore Smart Chair** system.

This platform bridges an **ESP32 microcontroller** reading multi-sensor ergonomic hardware to **Blynk Cloud**, passing data through a **secure Node.js / Express backend** and rendering an interactive **React + TypeScript + Tailwind CSS** dashboard.

---

## Architecture Overview

```
[ HARDWARE SENSORS ]
- HC-SR04 Ultrasonic (Distance)
- MLX90614 Infrared (Body Temperature)
- DHT22 (Ambient Temp & Humidity)
- 4x FSR Sensors (Seat Quadrant Pressure)
- WS2812B NeoPixel & Buzzer (Local Alerts)
       │
       ▼
  [ ESP32 ]
  - Calculates balanceDifference = |totalLeft - totalRight|
  - Calculates totalFrontPressure = valFL + valFR
  - Calculates Stress Index
  - Classifies Posture Status
       │ (Wi-Fi)
       ▼
 [ BLYNK CLOUD ] (REST API)
       │
       ▼
[ SECURE BACKEND ] (Node.js / Express on http://localhost:5001)
  - Reads BLYNK_AUTH_TOKEN from backend/.env
  - Normalizes telemetry
  - Detects data staleness (> 15s)
  - NEVER exposes auth token to client
       │ (JSON /api/blynk/data)
       ▼
[ NEUROPOSTURE OS FRONTEND ] (React / Vite on http://localhost:5173)
  - Interactive normal ergonomic office chair illustration
  - Strictly distinguishes real Blynk telemetry from unavailable data
  - Live charts & session analytics
  - Onboarding user profile & Demo Mode simulation
```

---

## Critical Security Rule

> [!CAUTION]
> **The Blynk Auth Token belongs exclusively in `backend/.env`!**
> - The browser never makes direct requests to Blynk Cloud.
> - The frontend JavaScript bundle never contains, receives, or stores the Blynk token.
> - The token is never logged, exposed via API endpoints, or committed to Git.
> - `backend/.env` is strictly listed in `.gitignore`.

---

## Current ESP32 Firmware Telemetry Truth

The frontend adheres strictly to the **actual ESP32 firmware**:

### Active Live Blynk Streams (Real Data)
| Blynk Pin | Metric Name | Hardware Sensor | Unit / Format | Status |
| :--- | :--- | :--- | :--- | :--- |
| **V0** | Body Temperature | MLX90614 Non-Contact IR | `XX.X °C` | **LIVE** |
| **V2** | Head / Spine Distance | HC-SR04 Ultrasonic | `XX.X cm` | **LIVE** |
| **V3** | Posture Status | ESP32 State Engine | Text (Optimal / Caution / Critical) | **LIVE** |
| **V4** | Environmental Temperature | DHT22 Sensor | `XX.X °C` | **LIVE** |
| **V5** | Relative Humidity | DHT22 Sensor | `XX.X %` | **LIVE** |
| **V6** | Stress Index | Bio-environmental calculation | `X.X` | **LIVE** |

### Calculated on ESP32 Locally (NOT Transmitted to Blynk in Current Firmware)
The current ESP32 code calculates several metrics locally and prints them to the Serial Monitor, but does **not** transmit them to Blynk:
- `balanceDifference = abs(totalLeft - totalRight)`
- `totalFrontPressure = valFL + valFR`
- `valFL`, `valFR`, `valBL`, `valBR` (4 individual FSR seat quadrant readings)
- `Risk Score`

**Dashboard Behavior:**
- In Live Mode, these metrics strictly display **`DATA NOT AVAILABLE`**.
- No synthetic or fabricated numbers are shown.
- Small informative tooltips explain that the metric is calculated on the ESP32 and awaits firmware V2 transmission.

---

## Future Blynk Datastream Mapping (V7–V14)

The backend and frontend are built with a centralized configuration (`shared/constants.js` and `backend/src/config/blynk.js`) ready for instant activation:

```javascript
const BLYNK_MAPPING = {
  bodyTemperature: "V0",
  distance: "V2",
  postureStatus: "V3",
  environmentTemperature: "V4",
  humidity: "V5",
  stressIndex: "V6",

  // Reserved for future ESP32 firmware updates:
  balanceDifference: null, // Change to "V7" when ESP32 calls Blynk.virtualWrite(V7, balanceDifference)
  frontPressure: null,     // Change to "V8" when ESP32 calls Blynk.virtualWrite(V8, totalFrontPressure)
  fsrFrontLeft: null,      // Change to "V9"
  fsrFrontRight: null,     // Change to "V10"
  fsrBackLeft: null,       // Change to "V11"
  fsrBackRight: null,      // Change to "V12"
  riskScore: null,         // Change to "V13"
  sittingState: null       // Change to "V14"
};
```

---

## Demo Mode

For testing and demonstration without a live ESP32 chair:
- Toggle **DEMO MODE ON/OFF** in the top navigation bar.
- When **ON**: A visible, pulsating **`DEMO MODE`** badge appears, and realistic smart chair telemetry (posture state cycles, shifting ultrasonic distances, thermal data, and simulated FSR seat distributions) is rendered.
- When **OFF**: Reverts strictly to real Blynk Cloud data from the backend.

---

## Quick Start & Local Setup

### Prerequisites
- Node.js v18+ (Tested on v24)
- npm v9+

### 1. Backend Setup
```bash
cd backend
npm install

# Create your local environment file
cp .env.example .env

# Edit .env and enter your real Blynk Auth Token (optional if testing with Demo Mode)
# BLYNK_AUTH_TOKEN=YOUR_REAL_BLYNK_TOKEN_HERE

# Start backend server
npm start
# Runs on http://localhost:5001
```

### 2. Frontend Setup
```bash
cd frontend
npm install

# Start Vite dev server
npm run dev
# Opens on http://localhost:5173
```

### 3. Verification Endpoints
- Telemetry Data: `http://localhost:5001/api/blynk/data`
- Demo Telemetry: `http://localhost:5001/api/blynk/data?demo=true`
- Configuration: `http://localhost:5001/api/blynk/config`
- Backend Health: `http://localhost:5001/api/health`

---

## Project Structure

```
chair/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── blynk.js             # Centralized mapping & configuration
│   │   ├── controllers/
│   │   │   └── blynkController.js   # Telemetry, Config, Health endpoints
│   │   ├── routes/
│   │   │   └── blynkRoutes.js       # /api/blynk/* routing
│   │   ├── services/
│   │   │   └── blynkService.js      # Blynk Cloud REST client, cache, rate limits
│   │   ├── utils/
│   │   │   └── normalizer.js        # Data sanitization, null enforcement, demo generator
│   │   └── server.js                # Express app entry point
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── chair/
│   │   │   │   ├── ChairIllustration.tsx   # 2D ergonomic office chair illustration
│   │   │   │   └── SeatPressureMap.tsx     # 4-quadrant FSR pressure matrix
│   │   │   ├── charts/
│   │   │   │   └── LiveSensorChart.tsx     # Real-time multi-metric trend chart
│   │   │   ├── dashboard/
│   │   │   │   ├── PrimaryMetricCards.tsx  # DIST, BAL DIFF, FRONT P, BODY TEMP
│   │   │   │   ├── SecondaryMetricCards.tsx# ENV TEMP, HUMIDITY, STRESS INDEX, RISK SCORE
│   │   │   │   ├── PostureStatusPanel.tsx  # Prominent posture banner & guidance
│   │   │   │   ├── BalanceAnalysisCard.tsx # Lateral & front tilt breakdown
│   │   │   │   ├── AlertsFeed.tsx          # Real-time posture & stress alerts
│   │   │   │   └── SystemHealthBar.tsx     # ESP32, Blynk, Backend verification
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx              # Brand, connection status, user profile
│   │   │   │   └── TabNavigation.tsx       # View switcher
│   │   │   ├── modals/
│   │   │   │   ├── UserProfileModal.tsx    # "WELCOME TO NEUROPOSTURE OS"
│   │   │   │   └── DataMappingModal.tsx    # Datastream inspector
│   │   │   └── common/
│   │   │       ├── Card.tsx                # Glassmorphic dark container
│   │   │       ├── Badge.tsx               # Status badges
│   │   │       └── Tooltip.tsx             # Firmware explanation tooltips
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── AnalyticsPage.tsx
│   │   │   ├── AiErgonomicsPage.tsx        # "AI ENGINE: READY FOR INTEGRATION"
│   │   │   └── MappingPage.tsx             # Complete firmware telemetry reference
│   │   ├── hooks/
│   │   │   └── useBlynkData.ts             # 3-second polling & state sync
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   ├── blynk.ts
│   │   │   └── user.ts
│   │   ├── utils/
│   │   │   └── formatters.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── shared/
│   └── constants.js                         # Centralized mappings
├── .env.example
├── .gitignore
└── README.md
```
