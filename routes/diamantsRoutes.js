const express = require('express');
const router = express.Router();
const diamantsController = require('../controllers/diamantsController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware'); // Importe les middlewares

// Définition des routes pour les diamants
// GET /api/diamants/
router.get('/', diamantsController.getAllDiamants);

// GET /api/diamants/:stock_id
router.get('/:stock_id', diamantsController.getDiamantById);

// Opérations CRUD qui nécessitent un rôle administrateur
// POST (Créer) un nouveau diamant
router.post('/', authenticate, authorizeAdmin, diamantsController.createDiamant);

// PUT (Mettre à jour) un diamant existant par son stock_id
router.put('/:stock_id', authenticate, authorizeAdmin, diamantsController.updateDiamant);

// DELETE (Supprimer) un diamant par son stock_id
router.delete('/:stock_id', authenticate, authorizeAdmin, diamantsController.deleteDiamant);

module.exports = router;