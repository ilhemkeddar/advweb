const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: String,      
  department: String, 
  specialty: String,  
  image: String,      
  socialLinks: { linkedin: String, twitter: String }
});

module.exports = mongoose.model('Expert', expertSchema);