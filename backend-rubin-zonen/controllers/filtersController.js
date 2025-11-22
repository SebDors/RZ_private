// controllers/filtersController.js
const db = require('../config/db');
const { addLog } = require('./logController');

// Get all search filters
exports.getAllFilters = async (req, res) => {
    try {
        const client = await db.connect();
        const result = await client.query('SELECT * FROM search_filters ORDER BY filter_name ASC');
        client.release();
        await addLog({
            userId: req.user ? req.user.id : undefined,
            level: 'INFO',
            action: 'VIEW_ALL_FILTERS',
            details: { message: 'All filters retrieved successfully.' },
        });
        res.status(200).json(result.rows);
    } catch (error) {
        await addLog({
            userId: req.user ? req.user.id : undefined,
            level: 'ERROR',
            action: 'VIEW_ALL_FILTERS_FAILED',
            details: { message: 'Error fetching filters.', error: error.message },
        });
        console.error('Error fetching filters:', error);
        res.status(500).json({ message: 'Server error while fetching filters.' });
    }
};

// Update a search filter
exports.updateFilter = async (req, res) => {
    const { filter_name } = req.params;
    const { is_enabled } = req.body;

    if (typeof is_enabled !== 'boolean') {
        await addLog({
            userId: req.user ? req.user.id : undefined,
            level: 'WARN',
            action: 'UPDATE_FILTER_INVALID_INPUT',
            details: { filter_name, is_enabled, message: 'Invalid is_enabled value. Must be a boolean.' },
        });
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
            await addLog({
                userId: req.user ? req.user.id : undefined,
                level: 'WARN',
                action: 'UPDATE_FILTER_NOT_FOUND',
                details: { filter_name, message: 'Filter not found.' },
            });
            return res.status(404).json({ message: 'Filter not found.' });
        }

        await addLog({
            userId: req.user ? req.user.id : undefined,
            level: 'INFO',
            action: 'UPDATE_FILTER_SUCCESS',
            details: { filter_name, is_enabled, message: 'Filter updated successfully.' },
        });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        await addLog({
            userId: req.user ? req.user.id : undefined,
            level: 'ERROR',
            action: 'UPDATE_FILTER_FAILED',
            details: { filter_name, is_enabled, error: error.message, message: 'Server error while updating filter.' },
        });
        console.error(`Error updating filter ${filter_name}:`, error);
        res.status(500).json({ message: 'Server error while updating filter.' });
    }
};
