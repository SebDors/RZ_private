// routes/diamantsRoutes.js
const express = require('express');
const router = express.Router();
const diamantsController = require('../controllers/diamantsController'); // Importe le contrôleur des diamants

// Définition des routes pour les diamants
// Exemple: GET /api/diamants/
router.get('/', diamantsController.getAllDiamants);

// Exemple: GET /api/diamants/:stock_id
router.get('/:stock_id', diamantsController.getDiamantById);

// D'autres routes CRUD (POST, PUT, DELETE) viendront plus tard avec l'authentification

module.exports = router;    