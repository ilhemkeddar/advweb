const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

// URL: /api/departments (Liste simple pour les formulaires)
router.get('/', departmentController.getAllDepartments);

// URL: /api/departments/cards (Pour les cartes avec compteurs d'activité)
router.get('/cards', departmentController.getDepartmentCards);

// URL: /api/departments (POST)
router.post('/', departmentController.createDepartment);

module.exports = router;