const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');
const { authenticate } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Watchlist
 *   description: User watchlist management
 */

// All watchlist routes are protected and require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/watchlist:
 *   get:
 *     summary: Retrieve the user's watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Watchlist retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', watchlistController.getWatchlist);

/**
 * @swagger
 * /api/watchlist:
 *   post:
 *     summary: Add an item to the watchlist
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
 *         description: Item added to watchlist
 *       400:
 *         description: Invalid data
 */
router.post('/', watchlistController.addItemToWatchlist);

/**
 * @swagger
 * /api/watchlist/{diamond_stock_id}:
 *   delete:
 *     summary: Delete an item from the watchlist
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
 *         description: Item deleted from watchlist
 *       404:
 *         description: Item not found
 */
router.delete('/:diamond_stock_id', watchlistController.deleteWatchlistItem);

module.exports = router;