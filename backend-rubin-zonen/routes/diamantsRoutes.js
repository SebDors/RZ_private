const express = require('express');
const router = express.Router();
const diamantsController = require('../controllers/diamantsController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');


/**
 * @swagger
 * tags:
 *   name: Diamonds
 *   description: Diamond database management
 */

/**
 * @swagger
 * /api/diamants/refresh:
 *   post:
 *     summary: Refresh diamonds from the FTP source (Admin only)
 *     tags: [Diamonds]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       202:
 *         description: Diamond refresh process started
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.post('/refresh', authenticate, authorizeAdmin, diamantsController.refreshDiamonds);


/**
 * @swagger
 * /api/diamants:
 *   get:
 *     summary: Get the list of all diamonds
 *     tags: [Diamonds]
 *     responses:
 *       200:
 *         description: List of diamonds retrieved successfully
 */
router.get('/',authenticate, diamantsController.getAllDiamants);

/**
 * @swagger
 * /api/diamants/{stock_id}:
 *   get:
 *     summary: Get a diamond by its stock_id
 *     tags: [Diamonds]
 *     parameters:
 *       - in: path
 *         name: stock_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Diamond found
 *       404:
 *         description: Diamond not found
 */
router.get('/:stock_id', authenticate, diamantsController.getDiamantById);

module.exports = router;