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
 *   name: Diamants
 *   description: Gestion des diamants de la base de données
 */

/**
 * @swagger
 * /api/diamants/upload_data:
 *   post:
 *     summary: Uploader un fichier CSV pour importer les diamants (Admin seulement)
 *     tags: [Diamants]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: diamonds_csv
 *         type: file
 *         required: true
 *         description: Le fichier CSV des diamants à importer.
 *     responses:
 *       200:
 *         description: Données des diamants importées avec succès
 *       400:
 *         description: Fichier manquant ou invalide
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */
router.post('/upload_data', authenticate, authorizeAdmin, upload.single('diamonds_csv'), diamantsController.uploadDiamonds);


/**
 * @swagger
 * /api/diamants:
 *   get:
 *     summary: Récupérer la liste de tous les diamants
 *     tags: [Diamants]
 *     responses:
 *       200:
 *         description: Liste des diamants récupérée avec succès
 */
router.get('/',authenticate, diamantsController.getAllDiamants);

/**
 * @swagger
 * /api/diamants/{stock_id}:
 *   get:
 *     summary: Récupérer un diamant par son stock_id
 *     tags: [Diamants]
 *     parameters:
 *       - in: path
 *         name: stock_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Diamant trouvé
 *       404:
 *         description: Diamant non trouvé
 */
router.get('/:stock_id', diamantsController.getDiamantById);

/**
 * @swagger
 * /api/diamants:
 *   post:
 *     summary: Créer un nouveau diamant (Admin seulement)
 *     tags: [Diamants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock_id:
 *                 type: string
 *               shape:
 *                 type: string
 *               carat:
 *                 type: number
 *               color:
 *                 type: string
 *               clarity:
 *                 type: string
 *               cut:
 *                 type: string
 *               polish:
 *                 type: string
 *               symmetry:
 *                 type: string
 *               fluorescence:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Diamant créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé (rôle non admin)
 */
router.post('/', authenticate, authorizeAdmin, diamantsController.createDiamant);

/**
 * @swagger
 * /api/diamants/{stock_id}:
 *   put:
 *     summary: Mettre à jour un diamant (Admin seulement)
 *     tags: [Diamants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: stock_id
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
 *               shape:
 *                 type: string
 *               carat:
 *                 type: number
 *               # ... (ajoutez les autres champs du diamant ici)
 *     responses:
 *       200:
 *         description: Diamant mis à jour avec succès
 *       404:
 *         description: Diamant non trouvé
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 */
router.put('/:stock_id', authenticate, authorizeAdmin, diamantsController.updateDiamant);

/**
 * @swagger
 * /api/diamants/{stock_id}:
 *   delete:
 *     summary: Supprimer un diamant (Admin seulement)
 *     tags: [Diamants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: stock_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Diamant supprimé avec succès
 *       404:
 *         description: Diamant non trouvé
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 */
router.delete('/:stock_id', authenticate, authorizeAdmin, diamantsController.deleteDiamant);

module.exports = router;