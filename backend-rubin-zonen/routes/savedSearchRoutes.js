const express = require('express');
const router = express.Router();
const savedSearchController = require('../controllers/savedSearchController');
const { authenticate } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Saved Searches
 *   description: User saved searches management
 */

/**
 * @swagger
 * /api/saved-searches:
 *   get:
 *     summary: Retrieve the user's saved searches
 *     tags: [Saved Searches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saved searches retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, savedSearchController.getSavedSearches);

/**
 * @swagger
 * /api/saved-searches:
 *   post:
 *     summary: Save a new search
 *     tags: [Saved Searches]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - search_params
 *             properties:
 *               name:
 *                 type: string
 *               search_params:
 *                 type: object
 *     responses:
 *       201:
 *         description: Search saved successfully
 *       400:
 *         description: Invalid data
 */
router.post('/', authenticate, savedSearchController.saveSearch);

/**
 * @swagger
 * /api/saved-searches/{id}:
 *   delete:
 *     summary: Delete a saved search
 *     tags: [Saved Searches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Saved search deleted successfully
 *       404:
 *         description: Saved search not found
 */
router.delete('/:id', authenticate, savedSearchController.deleteSearch);

module.exports = router;
