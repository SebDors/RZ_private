const db = require('../config/db');
const { addLog } = require('./logController');

// GET /api/watchlist - Retrieve user's watchlist
exports.getWatchlist = async (req, res) => {
    const userId = req.user.id;
    try {
        const client = await db.connect();
        const queryText = `
            SELECT 
                w.diamond_stock_id,
                w.added_at,
                d.shape,
                d.weight,
                d.color,
                d.clarity,
                d.price_carat,
                d.image_file
            FROM watchlist_items w
            JOIN diamants d ON w.diamond_stock_id = d.stock_id
            WHERE w.user_id = $1
            ORDER BY w.added_at DESC;
        `;
        const result = await client.query(queryText, [userId]);
        client.release();
        await addLog({
            userId,
            level: 'info',
            action: 'VIEW_WATCHLIST_SUCCESS',
            details: { message: `User retrieved ${result.rows.length} watchlist items.` },
        });
        res.status(200).json(result.rows);
    } catch (error) {
        await addLog({
            userId,
            level: 'error',
            action: 'VIEW_WATCHLIST_FAILED',
            details: { error: error.message },
        });
        console.error('Error retrieving watchlist:', error);
        res.status(500).json({ message: 'Server error while retrieving watchlist.' });
    }
};

// POST /api/watchlist - Add an item to the watchlist
exports.addItemToWatchlist = async (req, res) => {
    const userId = req.user.id;
    const { diamond_stock_id } = req.body;

    if (!diamond_stock_id) {
        return res.status(400).json({ message: 'The diamond ID (diamond_stock_id) is required.' });
    }

    try {
        const client = await db.connect();
        // ON CONFLICT DO NOTHING: if the item is already present, do nothing and do not return an error.
        const queryText = `
            INSERT INTO watchlist_items (user_id, diamond_stock_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, diamond_stock_id) DO NOTHING
            RETURNING *;
        `;
        const result = await client.query(queryText, [userId, diamond_stock_id]);
        client.release();

        if (result.rows.length === 0) {
            // This case occurs if the item was already in the watchlist
            await addLog({
                userId,
                level: 'warn',
                action: 'ADD_TO_WATCHLIST_ALREADY_EXISTS',
                details: { diamond_stock_id },
            });
            return res.status(200).json({ message: 'This item is already in your watchlist.' });
        }
        await addLog({
            userId,
            level: 'info',
            action: 'ADD_TO_WATCHLIST_SUCCESS',
            details: { diamond_stock_id },
        });
        res.status(201).json({ message: 'Item added to watchlist.', item: result.rows[0] });
    } catch (error) {
        await addLog({
            userId,
            level: 'error',
            action: 'ADD_TO_WATCHLIST_FAILED',
            details: { diamond_stock_id, error: error.message },
        });
        console.error('Error adding to watchlist:', error);
        res.status(500).json({ message: 'Server error while adding to watchlist.' });
    }
};

// DELETE /api/watchlist/:diamond_stock_id - Delete an item from the watchlist
exports.deleteWatchlistItem = async (req, res) => {
    const userId = req.user.id;
    const { diamond_stock_id } = req.params;

    try {
        const client = await db.connect();
        const queryText = 'DELETE FROM watchlist_items WHERE user_id = $1 AND diamond_stock_id = $2 RETURNING *;';
        const result = await client.query(queryText, [userId, diamond_stock_id]);
        client.release();

        if (result.rows.length === 0) {
            await addLog({
                userId,
                level: 'warn',
                action: 'DELETE_FROM_WATCHLIST_NOT_FOUND',
                details: { diamond_stock_id },
            });
            return res.status(404).json({ message: 'Item not found in watchlist.' });
        }
        await addLog({
            userId,
            level: 'info',
            action: 'DELETE_FROM_WATCHLIST_SUCCESS',
            details: { diamond_stock_id },
        });
        res.status(200).json({ message: 'Item successfully removed from watchlist.', deletedItem: result.rows[0] });
    } catch (error) {
        await addLog({
            userId,
            level: 'error',
            action: 'DELETE_FROM_WATCHLIST_FAILED',
            details: { diamond_stock_id, error: error.message },
        });
        console.error('Error deleting item from watchlist:', error);
        res.status(500).json({ message: 'Server error while deleting item from watchlist.' });
    }
};