const mongoose = require('mongoose');
const Department = require('../models/Department');
const Workshop = require('../models/Workshop');

// Récupérer tous les départements (Format simple)
exports.getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Récupérer les données pour les "Department Cards" (Home Page)
exports.getDepartmentCards = async (req, res) => {
    try {
        const departments = await Department.find();
        const cards = await Promise.all(departments.map(async (dept) => {
            const count = await Workshop.countDocuments({ department: dept._id });
            return {
                _id: dept._id,
                name: dept.name,
                code: dept.code,
                activityCount: count,
                icon: dept.icon
            };
        }));
        res.json(cards);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Créer un nouveau département (Via Thunder Client)
exports.createDepartment = async (req, res) => {
    try {
        const newDept = new Department(req.body);
        await newDept.save();
        res.status(201).json(newDept);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};