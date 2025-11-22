const db = require('../config/db');

const addLog = async ({ userId = null, level, action, details = {} }) => {
    try {
        const client = await db.connect();
        const queryText = `
            INSERT INTO logs (user_id, level, action, details)
            VALUES ($1, $2, $3, $4);
        `;
        await client.query(queryText, [userId, level, action, details]);
        client.release();
    } catch (error) {
        console.error('Error writing log to database:', error);
    }
};

const getLogs = async (req, res) => {
    try {
        const client = await db.connect();
        const queryText = `
            SELECT 
                l.id,
                l.level,
                l.action,
                l.details,
                l.created_at,
                u.email AS user_email
            FROM logs l
            LEFT JOIN users u ON l.user_id = u.id
            ORDER BY l.created_at DESC;
        `;
        const result = await client.query(queryText);
        client.release();
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving logs:', error);
        res.status(500).json({ message: 'Server error while retrieving logs.' });
    }
};

const deleteAllLogs = async (req, res) => {
    const userId = req.user.id;
    try {
        const client = await db.connect();
        await client.query('DELETE FROM logs');
        client.release();

        await addLog({
            userId,
            level: 'warn',
            action: 'ADMIN_DELETE_ALL_LOGS',
            details: { message: `All logs deleted by user ID: ${userId}` },
        });

        res.status(200).json({ message: 'All logs have been deleted.' });
    } catch (error) {
        console.error('Error deleting all logs:', error);
        // Do not log this error to the database as it might fail too
        res.status(500).json({ message: 'Server error while deleting logs.' });
    }
};

module.exports = {
    addLog,
    getLogs,
    deleteAllLogs,
};
