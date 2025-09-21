// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController'); // Vérifiez le nom du fichier : userController.js ou usersController.js

// Définition des routes pour les utilisateurs

// GET tous les utilisateurs
router.get('/', usersController.getAllUsers);

// GET un utilisateur par son ID
router.get('/:id', usersController.getUserById);

// POST (Créer) un nouvel utilisateur (à utiliser avec précaution, l'enregistrement "register" sera plus sécurisé)
router.post('/', usersController.createUser);

// PUT (Mettre à jour) un utilisateur existant par son ID
router.put('/:id', usersController.updateUser);

// DELETE (Supprimer) un utilisateur par son ID
router.delete('/:id', usersController.deleteUser);

module.exports = router;