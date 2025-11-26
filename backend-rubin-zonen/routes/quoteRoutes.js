const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Quotes
 *   description: Quote management for users and administrators
 */

// Apply authentication to all routes
router.use(authenticate);

/**
 * @swagger
 * /api/quotes:
 *   get:
 *     summary: Get quotes for the connected user
 *     tags: [Quotes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's quotes retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', quoteController.getUserQuotes);

/**
 * @swagger
 * /api/quotes:
 *   post:
 *     summary: Create a new quote from a list of diamonds
 *     tags: [Quotes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diamond_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Quote created successfully
 *       400:
 *         description: Invalid data
 */
router.post('/', quoteController.createQuote);

/**
 * @swagger
 * /api/quotes/all:
 *   get:
 *     summary: Get all quotes from all users (Admin only)
 *     tags: [Quotes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all quotes
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */
router.get('/all', authorizeAdmin, quoteController.getAllQuotes);

/**
 * @swagger
 * /api/quotes/{id}:
 *   get:
 *     summary: Get a specific quote by its ID (Admin only)
 *     tags: [Quotes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quote found
 *       404:
 *         description: Quote not found
 */
router.get('/:id', authorizeAdmin, quoteController.getQuoteById);

/**
 * @swagger
 * /api/quotes/{id}:
 *   put:
 *     summary: Update a quote's status (Admin only)
 *     tags: [Quotes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Quote status updated
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Quote not found
 */
router.put('/:id', authorizeAdmin, quoteController.updateQuoteStatus);

router.delete('/:id', authorizeAdmin, quoteController.deleteQuote);

module.exports = router;