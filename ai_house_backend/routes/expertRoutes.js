const express = require('express');
const router = express.Router();
const expertController = require('../controllers/expertController');

// URL: /api/experts
router.get('/', expertController.getAllExperts);
router.post('/', expertController.createExpert);

module.exports = router;