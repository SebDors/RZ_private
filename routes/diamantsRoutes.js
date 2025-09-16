// routes/diamantsRoutes.js
const express = require('express');
const router = express.Router();
const diamantsController = require('../controllers/diamantsController'); // Importe le contrôleur des diamants

// Définition des routes pour les diamants
// GET /api/diamants/
router.get('/', diamantsController.getAllDiamants);

// GET /api/diamants/:stock_id
router.get('/:stock_id', diamantsController.getDiamantById);

// POST Créer un diamant
router.post('/', diamantsController.createDiamant);

// PUT - Mettre à jour un diamant
router.put('/:stock_id', diamantsController.updateDiamant);

// DELETE - Supprimer un diamant
router.delete('/:stock_id', diamantsController.deleteDiamant);

module.exports = router;    