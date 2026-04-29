const express = require('express');
const router = express.Router();
const representativeController = require('../controllers/representativeController');

// URL: /api/representatives
router.get('/', representativeController.getAllRepresentatives);
router.post('/', representativeController.createRepresentative);

module.exports = router;