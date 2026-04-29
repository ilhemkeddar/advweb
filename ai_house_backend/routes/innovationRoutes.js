const express = require('express');
const router = express.Router();
const innovationController = require('../controllers/innovationController');

router.get('/stats', innovationController.getInnovationStats);

module.exports = router;