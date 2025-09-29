const db = require('../config/db');

exports.getLogs = async (req, res) => {
    try {
        const client = await db.connect();
        const queryText = `
            SELECT l.*, u.email 
            FROM activity_logs l
            LEFT JOIN users u ON l.user_id = u.id
            ORDER BY l.created_at DESC 
            LIMIT 100;
        `;
        const result = await client.query(queryText);
        client.release();
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des logs :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des logs.' });
    }
};