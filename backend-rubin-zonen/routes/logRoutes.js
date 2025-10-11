const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Logs
 *   description: Consultation des logs d'activité (Admin seulement)
 */

// Protéger toutes les routes de log pour les admins uniquement
router.use(authenticate, authorizeAdmin);

/**
 * @swagger
 * /api/logs:
 *   get:
 *     summary: Récupérer tous les logs d'activité (Admin seulement)
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des logs récupérée avec succès
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé (rôle non admin)
 */
router.get('/', logController.getLogs);

module.exports = router;