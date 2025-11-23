const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile management and administration
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get the profile of the connected user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authenticate, usersController.getConnectedUserProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update the profile of the connected user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid data
 */
router.put('/profile', authenticate, usersController.updateConnectedUserProfile);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get the list of all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved
 *       403:
 *         description: Access denied
 */
router.get('/', authenticate, authorizeAdmin, usersController.getAllUsers);

/**
 * @swagger
 * /api/users/company-names:
 *   get:
 *     summary: Get a list of unique company names (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of unique company names retrieved successfully
 *       403:
 *         description: Access denied
 */
router.get('/company-names', authenticate, authorizeAdmin, usersController.getUniqueCompanyNames);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by their ID (Admin only)
 *     tags: [Users]
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
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get('/:id', authenticate, authorizeAdmin, usersController.getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Invalid data
 */
router.post('/', authenticate, authorizeAdmin, usersController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by their ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 */
router.put('/:id', authenticate, authorizeAdmin, usersController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by their ID (Admin only)
 *     tags: [Users]
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
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete('/:id', authenticate, authorizeAdmin, usersController.deleteUser);

/**
 * @swagger
 * /api/users/company-names:
 *   get:
 *     summary: Get a list of unique company names (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of unique company names retrieved successfully
 *       403:
 *         description: Access denied
 */
router.get('/company-names', authenticate, authorizeAdmin, usersController.getUniqueCompanyNames);

//TODO: Ajouter un endpoint pour list user by company name

module.exports = router;