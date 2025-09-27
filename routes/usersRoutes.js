// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController'); // Vérifiez le nom du fichier : userController.js ou usersController.js
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// Routes pour l'utilisateur AUTHENTIFIÉ (gestion de son propre profil)
// GET le profil de l'utilisateur connecté
router.get('/profile', authenticate, usersController.getConnectedUserProfile);
// PUT mettre à jour le profil de l'utilisateur connecté
router.put('/profile', authenticate, usersController.updateConnectedUserProfile);
// DELETE supprimer son propre compte (optionnel et à manier avec précaution)
// router.delete('/profile', authenticate, usersController.deleteConnectedUser);


// Routes pour l'ADMINISTRATION des utilisateurs (requiert AUTHENTIFICATION et rôle ADMIN)
// GET tous les utilisateurs (pour les admins)
router.get('/', authenticate, authorizeAdmin, usersController.getAllUsers);

// GET un utilisateur par son ID (pour les admins)
router.get('/:id', authenticate, authorizeAdmin, usersController.getUserById);

// POST (Créer) un nouvel utilisateur (pour les admins, l'inscription "register" est publique)
router.post('/', authenticate, authorizeAdmin, usersController.createUser);

// PUT (Mettre à jour) un utilisateur existant par son ID (pour les admins)
router.put('/:id', authenticate, authorizeAdmin, usersController.updateUser);

// DELETE (Supprimer) un utilisateur par son ID (pour les admins)
router.delete('/:id', authenticate, authorizeAdmin, usersController.deleteUser);

module.exports = router;