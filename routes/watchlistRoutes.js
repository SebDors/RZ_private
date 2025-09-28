const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');
const { authenticate } = require('../middleware/authMiddleware');

// Toutes les routes de la watchlist sont protégées et nécessitent une authentification
router.use(authenticate);

// GET /api/watchlist - Récupérer la watchlist de l'utilisateur
router.get('/', watchlistController.getWatchlist);

// POST /api/watchlist - Ajouter un article à la watchlist
router.post('/', watchlistController.addItemToWatchlist);

// DELETE /api/watchlist/:diamond_stock_id - Supprimer un article de la watchlist
router.delete('/:diamond_stock_id', watchlistController.deleteWatchlistItem);

module.exports = router;