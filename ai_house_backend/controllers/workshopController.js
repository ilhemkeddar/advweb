const Workshop = require('../models/Workshop');
const mongoose = require('mongoose');
// Récupérer tous les workshops avec filtres
exports.getAllWorkshops = async (req, res) => {
    try {
        const { department, type, status, category, search, limit } = req.query;
        let query = {};

        // Filtre par Département
        if (department) query.department = department;
        
        // Filtre par Type (Workshop, Seminar, Competition)
        if (type && type !== 'All Types') query.type = type;
        
        // Filtre par Statut (Upcoming, Past)
        if (status && status !== 'All Status') query.status = status;

        // Filtre par Categories (ex: Deep Learning, Python)
        if (category && category !== 'All Categories') query.category =category;
            
        // Barre de Recherche (Titre)
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        let findQuery = Workshop.find(query);
        
        // Limitation (pour la Home Page par exemple)
        if (limit) findQuery = findQuery.limit(parseInt(limit));

        const workshops = await findQuery;
        res.json(workshops);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Ajouter un nouveau workshop
exports.createWorkshop = async (req, res) => {
    try {
        // C'est ici que l'erreur se produit si Workshop n'est pas bien importé
        const newWorkshop = new Workshop(req.body); 
        await newWorkshop.save();
        res.status(201).json(newWorkshop);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.getWorkshopById = async (req, res) => {
    try {
        // On récupère le workshop par son ID
        const workshop = await Workshop.findById(req.params.id);
        
        if (!workshop) {
            return res.status(404).json({ message: "Workshop non trouvé" });
        }

        res.status(200).json(workshop);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des détails", details: err.message });
    }
};
exports.updateWorkshop = async (req, res) => {
    try {
        const updatedWorkshop = await Workshop.findByIdAndUpdate(
            req.params.id, 
            { status: req.body.status }, // On change juste le status (ex: 'approved' ou 'rejected')
            { new: true }
        );
        res.status(200).json(updatedWorkshop);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
