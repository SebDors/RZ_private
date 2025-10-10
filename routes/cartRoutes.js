const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Panier
 *   description: Gestion du panier d'achat des utilisateurs
 */

// Toutes les routes du panier sont protégées et nécessitent une authentification
router.use(authenticate);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Récupérer le contenu du panier de l'utilisateur
 *     tags: [Panier]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contenu du panier récupéré avec succès
 *       401:
 *         description: Non autorisé
 */
router.get('/', cartController.getCart);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Ajouter un article au panier
 *     tags: [Panier]
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
 *               - quantity
 *             properties:
 *               diamond_stock_id:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Article ajouté au panier
 *       400:
 *         description: Données invalides
 */
router.post('/', cartController.addItemToCart);

/**
 * @swagger
 * /api/cart/{diamond_stock_id}:
 *   put:
 *     summary: Mettre à jour la quantité d'un article dans le panier
 *     tags: [Panier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: diamond_stock_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Quantité mise à jour
 *       400:
 *         description: Données invalides
 */
router.put('/:diamond_stock_id', cartController.updateCartItemQuantity);

/**
 * @swagger
 * /api/cart/{diamond_stock_id}:
 *   delete:
 *     summary: Supprimer un article du panier
 *     tags: [Panier]
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
 *         description: Article supprimé du panier
 *       404:
 *         description: Article non trouvé
 */
router.delete('/:diamond_stock_id', cartController.deleteCartItem);

module.exports = router;