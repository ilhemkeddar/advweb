const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true }, // ex: "ML Fundamentals Slides"
    workshopName: { type: String },          // ex: "Machine Learning Fundamentals"
    department: { type: String, required: true }, // ex: "Computer Science"
    type: { 
        type: String, 
        required: true,
        enum: ['PDF Documents', 'Videos', 'Slides', 'Code'] // Selon ton menu
    },
    link: { type: String, required: true },  // URL pour le bouton "Download"
    date: { type: String, default: "Mar 2026" } // Date affichée sur la carte
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);