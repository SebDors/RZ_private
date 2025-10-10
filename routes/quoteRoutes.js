const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Devis
 *   description: Gestion des devis pour les utilisateurs et les administrateurs
 */

// Appliquer l'authentification à toutes les routes
router.use(authenticate);

/**
 * @swagger
 * /api/quotes:
 *   get:
 *     summary: Récupérer les devis de l'utilisateur connecté
 *     tags: [Devis]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Devis de l'utilisateur récupérés avec succès
 *       401:
 *         description: Non autorisé
 */
router.get('/', quoteController.getUserQuotes);

/**
 * @swagger
 * /api/quotes:
 *   post:
 *     summary: Créer un nouveau devis à partir d'une liste de diamants
 *     tags: [Devis]
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
 *         description: Devis créé avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/', quoteController.createQuote);

/**
 * @swagger
 * /api/quotes/all:
 *   get:
 *     summary: Récupérer tous les devis de tous les utilisateurs (Admin seulement)
 *     tags: [Devis]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de tous les devis
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 */
router.get('/all', authorizeAdmin, quoteController.getAllQuotes);

/**
 * @swagger
 * /api/quotes/{id}:
 *   get:
 *     summary: Récupérer un devis spécifique par son ID (Admin seulement)
 *     tags: [Devis]
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
 *         description: Devis trouvé
 *       404:
 *         description: Devis non trouvé
 */
router.get('/:id', authorizeAdmin, quoteController.getQuoteById);

/**
 * @swagger
 * /api/quotes/{id}:
 *   put:
 *     summary: Mettre à jour le statut d'un devis (Admin seulement)
 *     tags: [Devis]
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
 *         description: Statut du devis mis à jour
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Devis non trouvé
 */
router.put('/:id', authorizeAdmin, quoteController.updateQuoteStatus);

module.exports = router;