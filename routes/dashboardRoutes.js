const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/authMiddleware');

// Protéger la route du dashboard pour s'assurer que l'utilisateur est connecté
router.use(authenticate);

// GET /api/dashboard/stats - Récupérer les statistiques pour le dashboard
router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;