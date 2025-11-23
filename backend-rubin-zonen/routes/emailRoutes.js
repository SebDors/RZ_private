const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Email
 *   description: Envoi d'e-mails transactionnels
 */

// Pour l'instant, seule une route de test est exposée, et elle est protégée pour les admins
/**
 * @swagger
 * /api/email/send-test:
 *   post:
 *     summary: Envoyer un e-mail de test (Admin seulement)
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - subject
 *               - textContent
 *             properties:
 *               to:
 *                 type: string
 *                 format: email
 *               subject:
 *                 type: string
 *               textContent:
 *                 type: string
 *     responses:
 *       200:
 *         description: E-mail envoyé avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/send-test', authenticate, authorizeAdmin, emailController.sendCustomEmail);

module.exports = router;
