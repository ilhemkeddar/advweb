const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- INSCRIPTION (SIGN UP) ---
exports.signup = async (req, res) => {
    try {
        const { fullName, email, password, role, department } = req.body;

        // 1. Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Cet email est déjà utilisé" });
        }

        // 2. Hacher le mot de passe (Sécurité)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Créer l'utilisateur
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role: role || 'Student', // Par défaut Student si non précisé
            department
        });

        await newUser.save();

        res.status(201).json({ 
            message: "Utilisateur créé avec succès !",
            user: {
                fullName: newUser.fullName,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- CONNEXION (LOGIN) ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Trouver l'utilisateur par son email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Utilisateur non trouvé" });
        }

        // 2. Comparer le mot de passe envoyé avec le mot de passe haché
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        // 3. Création du Token JWT (Valable 1 jour)
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        // 4. Réponse envoyée au Frontend React
        res.json({
            message: "Bienvenue !",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                role: user.role,
                email: user.email,
                department: user.department
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};