const express = require('express');
const cors = require('cors');
const { BLYNK_CONFIG } = require('./config/blynk');
const blynkRoutes = require('./routes/blynkRoutes');

const app = express();

// Security: Enable CORS with customizable origin
app.use(cors({
  origin: '*', // Allows local Vite dev server and custom ports
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging (sanitized - never logs tokens)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/blynk', blynkRoutes);

// Root health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'NeuroPosture OS DeskCore Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

const PORT = BLYNK_CONFIG.port || 5001;

app.listen(PORT, '127.0.0.1', () => {
  console.log(`=======================================================`);
  console.log(` NEUROPOSTURE OS: DESKCORE BACKEND`);
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(` Blynk Server: ${BLYNK_CONFIG.serverUrl}`);
  console.log(` Auth Token: ${BLYNK_CONFIG.authToken ? 'CONFIGURED [HIDDEN]' : 'NOT SET (Use .env)'}`);
  console.log(` Telemetry Endpoint: http://localhost:${PORT}/api/blynk/data`);
  console.log(` Config Endpoint: http://localhost:${PORT}/api/blynk/config`);
  console.log(`=======================================================`);
});
