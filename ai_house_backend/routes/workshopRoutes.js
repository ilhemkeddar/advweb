const express = require('express');
const router = express.Router();
const workshopController = require('../controllers/workshopController');

// URL: /api/workshops (Récupérer tous les workshops - pour la Home et les filtres)
router.get('/', workshopController.getAllWorkshops);

// URL: /api/workshops (POST - pour ajouter un nouveau workshop)
router.post('/', workshopController.createWorkshop);

// --- AJOUTE CETTE LIGNE ICI ---
// URL: /api/workshops/:id (Pour le bouton "View Details")
router.get('/:id', workshopController.getWorkshopById);
// URL: /api/workshops/:id (Pour changer le statut)
router.patch('/:id', workshopController.updateWorkshop);

module.exports = router;