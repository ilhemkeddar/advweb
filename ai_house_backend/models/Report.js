const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    senderName: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high'], 
        default: 'medium' 
    },
    date: { type: String, default: () => new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
    read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);