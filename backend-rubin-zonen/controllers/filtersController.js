// controllers/filtersController.js
const db = require('../config/db');

exports.getAllFilters = async (req, res) => {
    try {
        const client = await db.connect();
        const result = await client.query('SELECT * FROM search_filters ORDER BY filter_name ASC');
        client.release();
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching filters:', error);
        res.status(500).json({ message: 'Server error while fetching filters.' });
    }
};

exports.updateFilter = async (req, res) => {
    const { filter_name } = req.params;
    const { is_enabled } = req.body;

    if (typeof is_enabled !== 'boolean') {
        return res.status(400).json({ message: 'Invalid is_enabled value. It must be a boolean.' });
    }

    try {
        const client = await db.connect();
        const queryText = `
            UPDATE search_filters
            SET is_enabled = $1
            WHERE filter_name = $2
            RETURNING *;
        `;
        const result = await client.query(queryText, [is_enabled, filter_name]);
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Filter not found.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(`Error updating filter ${filter_name}:`, error);
        res.status(500).json({ message: 'Server error while updating filter.' });
    }
};
