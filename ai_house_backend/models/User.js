const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { 
        type: String, 
        required: [true, "Le nom complet est obligatoire"] 
    },
    email: { 
        type: String, 
        required: [true, "L'email est obligatoire"], 
        unique: true,
        lowercase: true,
        trim: true 
    },
    password: { 
        type: String, 
        required: [true, "Le mot de passe est obligatoire"],
        minlength: 6 
    },
    role: { 
        type: String, 
        enum: ['Student', 'Professor', 'Admin'], // Respecte bien la casse (Majuscule)
        default: 'Student' 
    },
    department: { 
        type: String,
        required: function() { return this.role === 'Professor'; } // Optionnel : rend le département obligatoire seulement pour les profs
    },
    profilePicture: { 
        type: String, 
        default: 'default-avatar.png' 
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);