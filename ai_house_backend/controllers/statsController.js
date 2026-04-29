// controllers/statsController.js
const Workshop = require('../models/Workshop');
const Department = require('../models/Department');
const Expert = require('../models/Expert'); // On utilise ton nouveau modèle ici !
const Registration = require('../models/Registration');
const mongoose = require('mongoose');
exports.getStats = async (req, res) => {
    try {
        // On compte les vraies données
        const workshopCount = await Workshop.countDocuments();
        const departmentCount = await Department.countDocuments();
        const expertCount = await Expert.countDocuments(); // Compte tes experts
        
        // Pour les étudiants, on garde 250 par défaut pour le design 
        // ou tu peux compter tes inscriptions réelles :
        const studentCount = 250; 

        res.status(200).json({
            students: studentCount,
            workshops: workshopCount,
            experts: expertCount,
            departments: departmentCount
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Erreur lors du calcul des statistiques", 
            error: error.message 
        });
    }
};