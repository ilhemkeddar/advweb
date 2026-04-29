const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/authMiddleware');

// --- Routes Publiques ---
// N'importe qui peut créer un compte ou se connecter
router.post('/register', userController.register);
router.post('/login', userController.login);

// --- Route PROTÉGÉE ---
// On garde une SEULE ligne pour le dashboard. 
// Le middleware 'auth' vérifie le token AVANT de donner les stats.
router.get('/dashboard/:userId', auth, userController.getUserDashboard);

module.exports = router;