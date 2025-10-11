const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        const client = await db.connect();

        // Requête pour les pierres spéciales
        const specialStonesQuery = 'SELECT COUNT(*) FROM diamants WHERE is_special = TRUE AND is_upcoming = FALSE;';
        const specialStonesResult = await client.query(specialStonesQuery);

        // Requête pour les pierres à venir
        const upcomingStonesQuery = 'SELECT COUNT(*) FROM diamants WHERE is_upcoming = TRUE;';
        const upcomingStonesResult = await client.query(upcomingStonesQuery);

        // Requête pour le nombre total de pierres disponibles (non à venir)
        const totalStonesQuery = 'SELECT COUNT(*) FROM diamants WHERE is_upcoming = FALSE;';
        const totalStonesResult = await client.query(totalStonesQuery);
        
        client.release();

        const stats = {
            specialStonesCount: parseInt(specialStonesResult.rows[0].count, 10),
            upcomingStonesCount: parseInt(upcomingStonesResult.rows[0].count, 10),
            totalAvailableStones: parseInt(totalStonesResult.rows[0].count, 10)
        };

        res.status(200).json(stats);
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques du dashboard :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des statistiques.' });
    }
};