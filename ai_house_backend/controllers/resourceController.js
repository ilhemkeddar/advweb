const Resource = require('../models/Resource');
const Workshop = require('../models/Workshop');

const todayKey = () => new Date().toISOString().slice(0, 10);

// Récupérer toutes les ressources avec filtres
// IMPORTANT: Show ONLY resources from past events
exports.getAllResources = async (req, res) => {
    try {
        const { department, type } = req.query;
        let query = {};

        // Filtre Département
        if (department && department !== 'All Departments') {
            query.department = department;
        }

        // IMPORTANT : Utilise 'type' pour correspondre au modèle Resource.js
        if (type && type !== 'All Types') {
            query.type = type; 
        }

        const resources = await Resource.find(query).sort({ createdAt: -1 });
        res.json(resources);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Ta fonction de stats (Garde-la, elle est top !)
exports.getResourceStats = async (req, res) => {
    try {
        const today = todayKey();
        res.json({
            totalResources: await Resource.countDocuments(),
            fileTypesCount: (await Resource.distinct('type')).length, // Changé fileType en type
            pastWorkshops: await Workshop.countDocuments({ date: { $lt: today } })
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Ajouter une ressource
exports.createResource = async (req, res) => {
    try {
        const newResource = new Resource(req.body);
        await newResource.save();
        res.status(201).json({ message: "Ressource ajoutée !", data: newResource });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};