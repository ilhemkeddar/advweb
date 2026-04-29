const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');

router.get('/', resourceController.getAllResources);
router.get('/stats', resourceController.getResourceStats);
router.post('/', resourceController.createResource);

module.exports = router;