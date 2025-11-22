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
        console.error('Erreur lors de l\'écriture du log en base de données :', error);
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
        console.error('Erreur lors de la récupération des logs :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des logs.' });
    }
};

module.exports = {
    addLog,
    getLogs,
};
