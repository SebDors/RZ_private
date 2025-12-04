const db = require('../config/db');
const { addLog } = require('./logController');
const { sendTemplateEmailToAddress } = require('./emailController');

// --- User Functions ---
// POST /api/quotes - Create a new quote
exports.createQuote = async (req, res) => {
    const userId = req.user.id;
    const { diamond_stock_ids } = req.body; // Expect an array of diamond IDs

    if (!diamond_stock_ids || !Array.isArray(diamond_stock_ids) || diamond_stock_ids.length === 0) {
        return res.status(400).json({ message: 'An array of diamond IDs (diamond_stock_ids) is required.' });
    }

    const client = await db.connect();
    try {
        await client.query('BEGIN'); // Start a transaction

        // 1. Insert the main quote
        const quoteInsertQuery = 'INSERT INTO quotes (user_id) VALUES ($1) RETURNING id, created_at, status;';
        const quoteResult = await client.query(quoteInsertQuery, [userId]);
        const newQuote = quoteResult.rows[0];

        // 2. Insert each diamond into quote_items
        const quoteItemsQuery = 'INSERT INTO quote_items (quote_id, diamond_stock_id) VALUES ($1, $2);';
        for (const stockId of diamond_stock_ids) {
            await client.query(quoteItemsQuery, [newQuote.id, stockId]);
        }

        await client.query('COMMIT'); // Commit the transaction
        
        // Get user info for email
        const userResult = await client.query('SELECT first_name, last_name, email FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length > 0) {
            const user = userResult.rows[0];

            // Send email to admin
            const adminEmail = process.env.ADMIN_EMAIL_RECEIVER;
            if (adminEmail) {
                sendTemplateEmailToAddress( // Not awaiting to not block the response
                    adminEmail,
                    'Ask_Quote_Admin',
                    {
                        client_name: `${user.first_name} ${user.last_name}`,
                        client_email: user.email,
                        diamond_ids: diamond_stock_ids.join(', '),
                        quote_id: newQuote.id,
                    },
                    userId // for logging
                );
            }
        }

        await addLog({
            userId,
            level: 'info',
            action: 'CREATE_QUOTE_SUCCESS',
            details: { quoteId: newQuote.id, diamond_ids: diamond_stock_ids },
        });
        res.status(201).json({ message: 'Quote created successfully.', quote: newQuote });

    } catch (error) {
        await client.query('ROLLBACK'); // Rollback the transaction on error
        await addLog({
            userId,
            level: 'error',
            action: 'CREATE_QUOTE_FAILED',
            details: { diamond_ids: diamond_stock_ids, error: error.message },
        });
        console.error('Error while creating quote:', error);
        res.status(500).json({ message: 'Server error while creating quote.' });
    } finally {
        client.release();
    }
};

// GET /api/quotes - Get quotes for the connected user
exports.getUserQuotes = async (req, res) => {
    const userId = req.user.id;
    try {
        const client = await db.connect();
        const queryText = `
            SELECT 
                q.id,
                q.status,
                q.created_at,
                json_agg(json_build_object(
                    'stock_id', d.stock_id,
                    'shape', d.shape,
                    'weight', d.weight,
                    'color', d.color
                )) AS items
            FROM quotes q
            LEFT JOIN quote_items qi ON q.id = qi.quote_id
            LEFT JOIN diamants d ON qi.diamond_stock_id = d.stock_id
            WHERE q.user_id = $1
            GROUP BY q.id
            ORDER BY q.created_at DESC;
        `;
        const result = await client.query(queryText, [userId]);
        client.release();
        await addLog({
            userId,
            level: 'info',
            action: 'VIEW_USER_QUOTES',
            details: { message: `User retrieved ${result.rows.length} quotes.` },
        });
        res.status(200).json(result.rows);
    } catch (error) {
        await addLog({
            userId,
            level: 'error',
            action: 'VIEW_USER_QUOTES_FAILED',
            details: { error: error.message },
        });
        console.error('Error retrieving user quotes:', error);
        res.status(500).json({ message: 'Server error while retrieving quotes.' });
    }
};

// --- Admin Functions ---
// GET /api/quotes/all - Get all quotes
exports.getAllQuotes = async (req, res) => {
    try {
        const client = await db.connect();
        const queryText = `
            SELECT 
                q.id,
                q.status,
                q.created_at,
                q.updated_at,
                json_build_object(
                    'id', u.id,
                    'email', u.email,
                    'first_name', u.first_name,
                    'last_name', u.last_name
                ) AS "user",
                json_agg(json_build_object(
                    'stock_id', d.stock_id,
                    'shape', d.shape,
                    'weight', d.weight,
                    'color', d.color
                )) AS items
            FROM quotes q
            JOIN users u ON q.user_id = u.id
            LEFT JOIN quote_items qi ON q.id = qi.quote_id
            LEFT JOIN diamants d ON qi.diamond_stock_id = d.stock_id
            GROUP BY q.id, u.id
            ORDER BY q.created_at DESC;
        `;
        const result = await client.query(queryText);
        client.release();
        await addLog({
            userId: req.user.id,
            level: 'info',
            action: 'ADMIN_VIEW_ALL_QUOTES',
            details: { message: `Admin retrieved ${result.rows.length} quotes.` },
        });
        res.status(200).json(result.rows);
    } catch (error) {
        await addLog({
            userId: req.user.id,
            level: 'error',
            action: 'ADMIN_VIEW_ALL_QUOTES_FAILED',
            details: { error: error.message },
        });
        console.error('Error retrieving all quotes:', error);
        res.status(500).json({ message: 'Server error while retrieving all quotes.' });
    }
};

// GET /api/quotes/:id - Get a specific quote by its ID
exports.getQuoteById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await db.connect();
        const queryText = `
            SELECT 
                q.id,
                q.status,
                q.created_at,
                q.updated_at,
                json_build_object(
                    'id', u.id,
                    'email', u.email,
                    'first_name', u.first_name,
                    'last_name', u.last_name,
                    'company_name', u.company_name
                ) AS "user",
                json_agg(json_build_object(
                    'stock_id', d.stock_id,
                    'shape', d.shape,
                    'weight', d.weight,
                    'color', d.color,
                    'clarity', d.clarity,
                    'price_carat', d.price_carat
                )) AS items
            FROM quotes q
            JOIN users u ON q.user_id = u.id
            LEFT JOIN quote_items qi ON q.id = qi.quote_id
            LEFT JOIN diamants d ON qi.diamond_stock_id = d.stock_id
            WHERE q.id = $1
            GROUP BY q.id, u.id;
        `;
        const result = await client.query(queryText, [id]);
        client.release();

        if (result.rows.length === 0) {
            await addLog({
                userId: req.user.id,
                level: 'warn',
                action: 'GET_QUOTE_BY_ID_NOT_FOUND',
                details: { quoteId: id },
            });
            return res.status(404).json({ message: 'Quote not found.' });
        }

        await addLog({
            userId: req.user.id,
            level: 'info',
            action: 'GET_QUOTE_BY_ID_SUCCESS',
            details: { quoteId: id },
        });
        res.status(200).json(result.rows[0]);
    } catch (error)
    {
        await addLog({
            userId: req.user.id,
            level: 'error',
            action: 'GET_QUOTE_BY_ID_FAILED',
            details: { quoteId: id, error: error.message },
        });
        console.error(`Error retrieving quote ${id}:`, error);
        res.status(500).json({ message: 'Server error while retrieving quote.' });
    }
};

// DELETE /api/quotes/:id - Delete a quote
exports.deleteQuote = async (req, res) => {
    const { id } = req.params;

    const client = await db.connect();
    try {
        await client.query('BEGIN'); // Start transaction

        // First, delete related quote items
        await client.query('DELETE FROM quote_items WHERE quote_id = $1;', [id]);

        // Then, delete the quote itself
        const result = await client.query('DELETE FROM quotes WHERE id = $1 RETURNING id;', [id]);

        if (result.rowCount === 0) {
            await client.query('ROLLBACK'); // Rollback if quote was not found
            await addLog({
                userId: req.user.id,
                level: 'warn',
                action: 'DELETE_QUOTE_NOT_FOUND',
                details: { quoteId: id },
            });
            return res.status(404).json({ message: 'Quote not found.' });
        }

        await client.query('COMMIT'); // Commit transaction
        await addLog({
            userId: req.user.id,
            level: 'info',
            action: 'DELETE_QUOTE_SUCCESS',
            details: { quoteId: id },
        });
        res.status(200).json({ message: 'Quote deleted successfully.' });

    } catch (error) {
        await client.query('ROLLBACK'); // Rollback on error
        await addLog({
            userId: req.user.id,
            level: 'error',
            action: 'DELETE_QUOTE_FAILED',
            details: { quoteId: id, error: error.message },
        });
        console.error(`Error deleting quote ${id}:`, error);
        res.status(500).json({ message: 'Server error while deleting quote.' });
    } finally {
        client.release();
    }
};

// PUT /api/quotes/:id - Update a quote's status
exports.updateQuoteStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'Status is required.' });
    }

    try {
        const client = await db.connect();
        const queryText = 'UPDATE quotes SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *;';
        const result = await client.query(queryText, [status, id]);
        client.release();

        if (result.rows.length === 0) {
            await addLog({
                userId: req.user.id,
                level: 'warn',
                action: 'UPDATE_QUOTE_STATUS_NOT_FOUND',
                details: { quoteId: id, status: status },
            });
            return res.status(404).json({ message: 'Quote not found.' });
        }

        await addLog({
            userId: req.user.id,
            level: 'info',
            action: 'UPDATE_QUOTE_STATUS_SUCCESS',
            details: { quoteId: id, newStatus: status },
        });
        res.status(200).json({ message: 'Quote status updated.', quote: result.rows[0] });
    } catch (error) {
        await addLog({
            userId: req.user.id,
            level: 'error',
            action: 'UPDATE_QUOTE_STATUS_FAILED',
            details: { quoteId: id, status: status, error: error.message },
        });
        console.error(`Error updating quote status ${id}:`, error);
        res.status(500).json({ message: 'Server error while updating status.' });
    }
};