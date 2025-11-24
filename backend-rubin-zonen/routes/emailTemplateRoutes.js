const express = require('express');
const router = express.Router();
const emailTemplateController = require('../controllers/emailTemplateController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Email Templates
 *   description: API for managing email templates
 */

/**
 * @swagger
 * /api/email-templates:
 *   get:
 *     summary: Retrieve a list of all email templates
 *     tags: [Email Templates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of email templates.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EmailTemplate'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', [authenticate, authorizeAdmin], emailTemplateController.getEmailTemplates);

/**
 * @swagger
 * /api/email-templates/{id}:
 *   get:
 *     summary: Get a single email template by ID
 *     tags: [Email Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the email template
 *     responses:
 *       200:
 *         description: The email template.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailTemplate'
 *       404:
 *         description: Email template not found
 */
router.get('/:id', [authenticate, authorizeAdmin], emailTemplateController.getEmailTemplateById);

/**
 * @swagger
 * /api/email-templates/{id}:
 *   put:
 *     summary: Update an email template
 *     tags: [Email Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the email template to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               body:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated email template.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailTemplate'
 *       400:
 *         description: Bad request (e.g., no subject or body provided)
 *       404:
 *         description: Email template not found
 */
router.put('/:id', [authenticate, authorizeAdmin], emailTemplateController.updateEmailTemplate);

module.exports = router;