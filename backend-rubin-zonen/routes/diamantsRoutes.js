const express = require('express');
const router = express.Router();
const diamantsController = require('../controllers/diamantsController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const fs = require('fs');

// Configure multer for file uploads
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}
const upload = multer({ dest: uploadDir });

/**
 * @swagger
 * tags:
 *   name: Diamonds
 *   description: Diamond database management
 */

/**
 * @swagger
 * /api/diamants/upload_data:
 *   post:
 *     summary: Upload a CSV file to import diamonds (Admin only)
 *     tags: [Diamonds]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: diamonds_csv
 *         type: file
 *         required: true
 *         description: The CSV file of diamonds to import.
 *     responses:
 *       200:
 *         description: Diamond data imported successfully
 *       400:
 *         description: Missing or invalid file
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.post('/upload_data', authenticate, authorizeAdmin, upload.single('diamonds_csv'), diamantsController.uploadDiamonds);


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