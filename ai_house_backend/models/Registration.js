const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    // L'ID de l'étudiant (lié à la collection User)
    studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // L'ID du workshop (lié à la collection Workshop)
    workshopId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Workshop', 
        required: true 
    },
    // Statut pour gérer les onglets "Upcoming" et "Completed" de ton design
    status: { 
        type: String, 
        enum: ['Upcoming', 'Completed'], 
        default: 'Upcoming' 
    },
    // Date d'inscription
    joinedAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);