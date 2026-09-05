const express = require('express');
const BlynkController = require('../controllers/blynkController');

const router = express.Router();

router.get('/data', BlynkController.getData);
router.get('/config', BlynkController.getConfig);
router.get('/health', BlynkController.getHealth);

module.exports = router;
