
const mongoose = require('mongoose');
const Representative = require('../models/Representative');

// Récupérer tous les représentants avec filtres dynamiques
exports.getAllRepresentatives = async (req, res) => {
    try {
        const { department, status } = req.query;
        let query = {};

        // Filtres basés sur le design Figma (ex: image_945648)
        if (department && department !== 'All Departments') {
            query.department = department;
        }
        
        if (status && status !== 'All Status') {
            query.status = status;
        }

        const reps = await Representative.find(query).sort({ createdAt: -1 });

        // On renvoie le compte et les données pour l'affichage "Showing X representatives"
        res.json({
            count: reps.length,
            data: reps
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Ajouter un nouveau représentant (Via Thunder Client)
exports.createRepresentative = async (req, res) => {
    try {
        // Le req.body utilisera les champs : name, role, department, email, etc.
        const newRep = new Representative(req.body);
        await newRep.save();
        res.status(201).json({ 
            message: "Représentant ajouté avec succès !", 
            data: newRep 
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};