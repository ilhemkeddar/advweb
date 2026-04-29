const mongoose = require('mongoose');
const Expert = require('../models/Expert');

// Récupérer tous les experts (pour la Home Page)
exports.getAllExperts = async (req, res) => {
    try {
        const experts = await Expert.find();
        res.status(200).json(experts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Ajouter un expert (via Postman ou ton futur dashboard)
exports.createExpert = async (req, res) => {
    try {
        const newExpert = new Expert(req.body);
        await newExpert.save();
        res.status(201).json({ message: "Expert ajouté !", data: newExpert });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};