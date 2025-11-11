const express = require('express');
const router = express.Router();
const filtersController = require('../controllers/filtersController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Filters
 *   description: Managing search filters
 */

/**
 * @swagger
 * /api/filters:
 *   get:
 *     summary: Get all search filters
 *     tags: [Filters]
 *     responses:
 *       200:
 *         description: List of filters retrieved successfully
 */
router.get('/', filtersController.getAllFilters);

/**
 * @swagger
 * /api/filters/{filter_name}:
 *   put:
 *     summary: Update a search filter (Admin only)
 *     tags: [Filters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filter_name
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_enabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Filter updated successfully
 *       404:
 *         description: Filter not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (not admin)
 */
router.put('/:filter_name', authenticate, authorizeAdmin, filtersController.updateFilter);

module.exports = router;
