const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// Appliquer l'authentification à toutes les routes
router.use(authenticate);

// --- Routes pour les Utilisateurs ---
// GET /api/quotes - Récupérer les devis de l'utilisateur connecté
router.get('/', quoteController.getUserQuotes);

// POST /api/quotes - Créer un nouveau devis à partir d'une liste de diamants
router.post('/', quoteController.createQuote);



// --- Routes pour les Administrateurs ---
// GET /api/quotes/all - Récupérer tous les devis de tous les utilisateurs (pour les admins)
router.get('/all', authorizeAdmin, quoteController.getAllQuotes);

// GET /api/quotes/:id - Récupérer un devis spécifique par son ID (pour les admins)
router.get('/:id', authorizeAdmin, quoteController.getQuoteById);

// PUT /api/quotes/:id - Mettre à jour le statut d'un devis (pour les admins)
router.put('/:id', authorizeAdmin, quoteController.updateQuoteStatus);

module.exports = router;