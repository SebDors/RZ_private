const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');
const { authenticate } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Watchlist
 *   description: Gestion de la watchlist de l'utilisateur
 */

// Toutes les routes de la watchlist sont protégées et nécessitent une authentification
router.use(authenticate);

/**
 * @swagger
 * /api/watchlist:
 *   get:
 *     summary: Récupérer la watchlist de l'utilisateur
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Watchlist récupérée avec succès
 *       401:
 *         description: Non autorisé
 */
router.get('/', watchlistController.getWatchlist);

/**
 * @swagger
 * /api/watchlist:
 *   post:
 *     summary: Ajouter un article à la watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - diamond_stock_id
 *             properties:
 *               diamond_stock_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Article ajouté à la watchlist
 *       400:
 *         description: Données invalides
 */
router.post('/', watchlistController.addItemToWatchlist);

/**
 * @swagger
 * /api/watchlist/{diamond_stock_id}:
 *   delete:
 *     summary: Supprimer un article de la watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: diamond_stock_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article supprimé de la watchlist
 *       404:
 *         description: Article non trouvé
 */
router.delete('/:diamond_stock_id', watchlistController.deleteWatchlistItem);

module.exports = router;