const Registration = require('../models/Registration');
const Workshop = require('../models/Workshop');

// 1. S'inscrire à un Workshop (Action du bouton "Enroll")
exports.registerToWorkshop = async (req, res) => {
    try {
        // On utilise les ID pour lier les données proprement
        const { studentId, workshopId } = req.body;

        // Vérifier si l'étudiant est déjà inscrit
        const alreadyEnrolled = await Registration.findOne({ studentId, workshopId });
        if (alreadyEnrolled) {
            return res.status(400).json({ message: "Tu es déjà inscrit à ce workshop !" });
        }

        const newReg = new Registration({
            studentId,    // Lien vers l'User
            workshopId,   // Lien vers le Workshop
            status: 'Upcoming'
        });
        
        await newReg.save();

        // Mise à jour du compteur de places sur le workshop
        await Workshop.findByIdAndUpdate(workshopId, { $inc: { registeredCount: 1 } });

        res.status(201).json({ message: "Inscription validée !", data: newReg });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// 2. Récupérer les workshops d'un étudiant (Pour la page "My Learning")
exports.getStudentWorkshops = async (req, res) => {
    try {
        const { studentId } = req.params;
        const registrations = await Registration.find({ studentId })
            .populate('workshopId'); // Récupère les détails (titre, lieu, date)
            
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Récupérer TOUTES les inscriptions (Pour ton futur Dashboard Admin)
exports.getAllRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find()
            .populate('studentId', 'fullName email') // Affiche qui s'est inscrit
            .populate('workshopId', 'title date');   // Affiche à quoi
            
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};