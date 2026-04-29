const jwt = require('jsonwebtoken');

// 1. Middleware d'authentification (auth)
exports.auth = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: "Accès refusé. Aucun jeton fourni." });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'votre_cle_secrete_ici');
        req.user = decoded;
        next(); 
    } catch (err) {
        res.status(401).json({ message: "Jeton invalide." });
    }
};

// 2. Middleware pour vérifier si l'utilisateur est Admin (isAdmin)
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: "Accès refusé. Réservé aux administrateurs." });
    }
};