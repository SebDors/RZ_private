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

/**
 * @swagger
 * /api/email/send-custom:
 *   post:
 *     summary: Envoyer un e-mail personnalisé (Admin seulement)
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
router.post('/send-custom', authenticate, authorizeAdmin, async (req, res) => {
    const { to, subject, textContent } = req.body;
    try {
        const data = await emailController.sendCustomEmail(to, subject, textContent);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @swagger
 * /api/email/send-template:
 *   post:
 *     summary: Envoyer un e-mail à partir d'un modèle
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
 *               - template_name
 *             properties:
 *               template_name:
 *                 type: string
 *               data:
 *                 type: object
 *     responses:
 *       200:
 *         description: E-mail envoyé avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Modèle non trouvé
 */
router.post('/send-template', authenticate, async (req, res) => {
    const userId = req.user.id; // Assumes user ID is on req.user from 'authenticate' middleware
    const { template_name, data } = req.body;
    try {
        await emailController.sendTemplateEmail(userId, template_name, data);
        res.json({ success: true, message: 'Email sent successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


module.exports = router;
