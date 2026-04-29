const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }, 
  date: String,
  time: String,
  location: String,
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  // Structure parfaite pour correspondre au Frontend
  professor: {
    name: { type: String },
    role: { type: String } 
  },

  type: String,
  category: String,
  targetAudience: String,

  resources: [{
    name: String,
    url: String
  }],

  capacity: { type: Number, default: 60 },
  registeredCount: { type: Number, default: 0 },

  // CONSEIL : Change 'upcoming' par 'pending' par défaut
  // Comme ça, les nouveaux ateliers apparaissent direct dans 
  // la section "Validation" de ton Dashboard Admin.
  status: { type: String, default: 'pending' } 
});

module.exports = mongoose.model('Workshop', workshopSchema);