const db = require('../config/db');

const getSavedSearches = async (req, res) => {
        const userId = req.user.id;
        try {
            let queryText = "SELECT * FROM saved_searches WHERE user_id = $1";
            const params = [userId];
            const result = await db.query(queryText, params);
            res.json(result.rows);
        } catch (error) {
        console.error('Error fetching saved searches:', error);
        res.status(500).send('Server error');
    }
};

const saveSearch = async (req, res) => {
    const userId = req.user.id;
    const { name, search_params } = req.body;

    if (!name || !search_params) {
        return res.status(400).send('Missing required fields: name, search_params');
    }

    try {
        const queryText = 'INSERT INTO saved_searches (user_id, name, search_params, search_type) VALUES ($1, $2, $3, $4) RETURNING *';
        const result = await db.query(queryText, [userId, name, search_params, 'quick']);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error saving search:', error);
        res.status(500).send('Server error');
    }
};

const deleteSearch = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    
    try {
        const queryText = 'DELETE FROM saved_searches WHERE id = $1 AND user_id = $2 RETURNING *';
        const result = await db.query(queryText, [id, userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Saved search not found or user not authorized' });
        }
        res.status(200).json({ message: 'Saved search deleted' });
    } catch (error) {
        console.error('Error deleting saved search:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getSavedSearches,
    saveSearch,
    deleteSearch,
};
