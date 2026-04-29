const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    }, // ex: "Computer Science"
    code: { 
        type: String, 
        required: true,
        unique: true 
    }, // ex: "CS", "MATH", "MED"
    icon: { 
        type: String 
    }, // Tu pourras y stocker le nom d'une icône Lucide ou FontAwesome
    description: { 
        type: String 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Department', departmentSchema);