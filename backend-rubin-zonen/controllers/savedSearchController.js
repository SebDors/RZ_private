const db = require('../config/db');

exports.getSavedSearches = (req, res) => {
    const userId = req.user.id;
    const { type } = req.query; // e.g., 'quick' or 'advanced'

    let query = 'SELECT * FROM saved_searches WHERE user_id = ?';
    const params = [userId];

    if (type) {
        query += ' AND search_type = ?';
        params.push(type);
    }

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error fetching saved searches:', err);
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
};

exports.saveSearch = (req, res) => {
    const userId = req.user.id;
    const { name, search_params, search_type } = req.body;

    if (!name || !search_params || !search_type) {
        return res.status(400).send('Missing required fields: name, search_params, search_type');
    }

    const query = 'INSERT INTO saved_searches (user_id, name, search_params, search_type) VALUES (?, ?, ?, ?)';
    db.query(query, [userId, name, JSON.stringify(search_params), search_type], (err, results) => {
        if (err) {
            console.error('Error saving search:', err);
            return res.status(500).send('Server error');
        }
        res.status(201).json({ id: results.insertId, name, search_params, search_type });
    });
};

exports.deleteSearch = (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const query = 'DELETE FROM saved_searches WHERE id = ? AND user_id = ?';
    db.query(query, [id, userId], (err, results) => {
        if (err) {
            console.error('Error deleting saved search:', err);
            return res.status(500).send('Server error');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Saved search not found or user not authorized');
        }
        res.send('Saved search deleted');
    });
};
