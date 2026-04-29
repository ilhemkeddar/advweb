const User = require('../models/User');
const Registration = require('../models/Registration');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- 1. INSCRIPTION (Register) ---
exports.register = async (req, res) => {
    try {
        const { fullName, email, password, role, department } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }

        // Hacher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role: role || 'Student', // Utilise 'Student' par défaut si non précisé
            department: department || 'General',
            profilePicture: 'default-avatar.png'
        });

        await newUser.save();
        res.status(201).json({ message: "Utilisateur créé avec succès !" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// --- 2. CONNEXION (Login) ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Chercher l'utilisateur
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mot de passe incorrect." });
        }

        // Créer le Token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'votre_cle_secrete_ici',
            { expiresIn: '24h' }
        );

        // Réponse avec les infos utilisateur (sans le mot de passe)
        res.json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                department: user.department,
                profilePicture: user.profilePicture
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- 3. LOGIQUE DU DASHBOARD (Stats & Profil) ---
exports.getUserDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        // On compte dynamiquement les inscriptions réelles pour l'étudiant
        const enrolledCount = await Registration.countDocuments({ studentId: req.params.userId });
        const completedCount = await Registration.countDocuments({ studentId: req.params.userId, status: 'Completed' });
        const upcomingCount = await Registration.countDocuments({ studentId: req.params.userId, status: 'Upcoming' });

        res.json({
            fullName: user.fullName,
            role: user.role,
            profilePicture: user.profilePicture,
            stats: {
                enrolled: enrolledCount,
                upcoming: upcomingCount,
                completed: completedCount,
                learningHours: enrolledCount * 2 // Exemple : on estime 2h par workshop
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};