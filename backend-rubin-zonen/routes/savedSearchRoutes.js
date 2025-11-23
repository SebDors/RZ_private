const express = require('express');
const router = express.Router();
const savedSearchController = require('../controllers/savedSearchController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, savedSearchController.getSavedSearches);
router.post('/', authMiddleware, savedSearchController.saveSearch);
router.delete('/:id', authMiddleware, savedSearchController.deleteSearch);

module.exports = router;
