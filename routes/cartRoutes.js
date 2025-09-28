const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/authMiddleware');

// Toutes les routes du panier sont protégées et nécessitent une authentification
router.use(authenticate);

// GET /api/cart - Récupérer le contenu du panier de l'utilisateur
router.get('/', cartController.getCart);

// POST /api/cart - Ajouter un article au panier
router.post('/', cartController.addItemToCart);

// PUT /api/cart/:diamond_stock_id - Mettre à jour la quantité d'un article
router.put('/:diamond_stock_id', cartController.updateCartItemQuantity);

// DELETE /api/cart/:diamond_stock_id - Supprimer un article du panier
router.delete('/:diamond_stock_id', cartController.deleteCartItem);

module.exports = router;