const mongoose = require('mongoose');

const representativeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true }, // ex: "Professor", "Doctor"
    image: { type: String, default: 'default.png' },
    department: { 
        type: String, 
        required: true 
    }, 
    status: { 
        type: String, 
        enum: ['Certified', 'In Training'], 
        default: 'Certified' 
    },
    specialties: { 
        type: [String], 
        default: [] 
    },
   
    email: { type: String }, // Indispensable pour le bouton "Send Email"
    workshopsCount: { type: Number, default: 0 },
    bioLink: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Representative', representativeSchema);