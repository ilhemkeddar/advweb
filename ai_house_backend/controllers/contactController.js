const Contact = require('../models/Contact');

exports.submitMessage = async (req, res) => {
    try {
        const newMessage = new Contact(req.body);
        await newMessage.save();
        res.status(201).json({ 
            message: "Message envoyé avec succès !", 
            data: newMessage 
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};