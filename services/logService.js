const db = require('../config/db');

/**
 * Enregistre une action utilisateur dans la base de données.
 * @param {Object} logData - Les données du log.
 * @param {number | null} logData.userId - L'ID de l'utilisateur (peut être null).
 * @param {string} logData.actionType - Le type d'action (ex: 'LOGIN').
 * @param {Object} [logData.details={}] - Un objet JSON avec des détails contextuels.
 */
const logActivity = async ({ userId, actionType, details = {} }) => {
    try {
        const client = await db.connect();
        const queryText = `
            INSERT INTO activity_logs (user_id, action_type, details)
            VALUES ($1, $2, $3);
        `;
        await client.query(queryText, [userId, actionType, details]);
        client.release();
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du log d\'activité :', error);
        // Nous ne propageons pas l'erreur pour ne pas interrompre l'action principale de l'utilisateur.
    }
};

module.exports = { logActivity };