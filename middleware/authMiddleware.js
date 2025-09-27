require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    // Le token est généralement envoyé dans l'en-tête Authorization comme "Bearer TOKEN_VALUE"
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
    }

    const token = authHeader.split(' ')[1]; // Récupère la partie TOKEN_VALUE

    if (!token) {
        return res.status(401).json({ message: 'Accès refusé. Format de token invalide.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attache l'ID et le rôle de l'utilisateur au corps de la requête
        next(); // Passe au middleware/contrôleur suivant
    } catch (error) {
        console.error('Erreur de validation du token :', error);
        return res.status(403).json({ message: 'Token invalide ou expiré.' });
    }
};

// Middleware pour vérifier le rôle d'administrateur
exports.authorizeAdmin = (req, res, next) => {
    // Supposons que authenticate a déjà attaché req.user
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé. Rôle administrateur requis.' });
    }
    next(); // L'utilisateur est un administrateur, passe au middleware/contrôleur suivant
};