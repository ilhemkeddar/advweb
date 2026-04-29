const express = require('express');
const router = express.Router();
const regController = require('../controllers/registrationController');

 

// Ligne 9 (Celle qui causait l'erreur)
router.post('/register', regController.registerToWorkshop);

// Route pour récupérer les workshops d'un étudiant
router.get('/my-workshops/:studentId', regController.getStudentWorkshops);

module.exports = router;