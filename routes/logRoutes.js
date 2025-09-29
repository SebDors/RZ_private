const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// Protéger toutes les routes de log pour les admins uniquement
router.use(authenticate, authorizeAdmin);

// GET /api/logs - Récupérer tous les logs d'activité
router.get('/', logController.getLogs);

module.exports = router;